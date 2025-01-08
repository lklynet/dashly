from flask import Flask, jsonify, send_from_directory, request
import json
import os
import sqlite3
import time

app = Flask(__name__, static_folder="static")

SETTINGS_FILE = os.getenv("USER_SETTINGS_FILE", "/app/data/settings.json")
READ_ONLY_DB_PATH = os.getenv("NGINX_DB_PATH", "/nginx/database.sqlite")

os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)

print(f"Settings File: {SETTINGS_FILE}")
print(f"Read-Only DB Path: {READ_ONLY_DB_PATH}")

DEFAULT_SETTINGS = {
    "theme": "light",
    "hideInactive": False,
    "hideSearch": False,
    "layoutView": "list",
    "sortBy": "domain",
    "maxColumns": 3,
    "groups": {},
    "renamedGroupNames": {}
}

cached_domains = {
    "domains": [],
    "last_updated": None
}
CACHE_EXPIRY_SECONDS = 15

def load_settings():
    """Load settings from the JSON file or initialize with defaults."""
    if not os.path.exists(SETTINGS_FILE):
        save_settings(DEFAULT_SETTINGS)
    try:
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        save_settings(DEFAULT_SETTINGS)
        return DEFAULT_SETTINGS

def save_settings(settings):
    """Save settings to the JSON file."""
    settings.pop("domains", None)
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=4)

def refresh_cached_domains():
    """Refresh the cached domains from the database."""
    if not os.path.exists(READ_ONLY_DB_PATH):
        return {"error": "Database not found"}

    try:
        with sqlite3.connect(READ_ONLY_DB_PATH) as conn:
            cursor = conn.cursor()
            query = """
                SELECT id, domain_names, forward_host, forward_port, meta, enabled 
                FROM proxy_host
                WHERE is_deleted = 0
            """
            cursor.execute(query)
            rows = cursor.fetchall()

        cached_domains["domains"] = [
            {
                "id": row[0],
                "domain_names": json.loads(row[1]),
                "forward_host": row[2],
                "forward_port": row[3],
                "nginx_online": json.loads(row[4]).get("nginx_online", False) if row[4] else False,
                "enabled": bool(row[5])
            }
            for row in rows
        ]
        cached_domains["last_updated"] = time.time()
        return cached_domains["domains"]
    except Exception as e:
        return {"error": "Failed to refresh domains", "details": str(e)}

def get_cached_domains():
    """Return cached domains, refreshing if expired."""
    if (
        not cached_domains["domains"] or
        not cached_domains["last_updated"] or
        (time.time() - cached_domains["last_updated"] > CACHE_EXPIRY_SECONDS)
    ):
        result = refresh_cached_domains()
        if isinstance(result, dict) and "error" in result:
            return result
    return cached_domains["domains"]

settings = load_settings()

@app.route("/domains")
def get_domains_endpoint():
    """Return cached domain data as a standalone endpoint."""
    cached_domains_result = get_cached_domains()
    if isinstance(cached_domains_result, dict) and "error" in cached_domains_result:
        return jsonify(cached_domains_result), 500
    return jsonify({"allDomains": cached_domains_result})

@app.route("/settings", methods=["GET"])
def get_settings():
    """Return the user settings as JSON."""
    cached_domains_result = get_cached_domains()
    if isinstance(cached_domains_result, dict) and "error" in cached_domains_result:
        return jsonify(cached_domains_result), 500
    settings["allDomains"] = cached_domains_result
    return jsonify(settings)

@app.route("/save-settings", methods=["POST"])
def update_settings():
    """Update settings in the JSON file."""
    try:
        new_settings = request.json
        if not isinstance(new_settings, dict):
            raise ValueError("Invalid data format")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid JSON data"}), 400

    settings.update(new_settings)
    save_settings(settings)
    return jsonify({"message": "Settings updated successfully"}), 200

@app.route("/save-groups", methods=["POST"])
def save_groups():
    """Save groups and optionally renamedGroupNames."""
    try:
        data = request.json
        if not isinstance(data, dict):
            raise ValueError("Invalid data format")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid JSON data"}), 400

    settings["groups"] = data.get("groups", settings["groups"])
    settings["renamedGroupNames"] = data.get("renamedGroupNames", settings["renamedGroupNames"])
    save_settings(settings)
    return jsonify({"message": "Groups updated successfully"}), 200

@app.route("/refresh-domains", methods=["POST"])
def refresh_domains():
    """Manually refresh the domain cache."""
    refresh_result = refresh_cached_domains()
    if isinstance(refresh_result, dict) and "error" in refresh_result:
        return jsonify(refresh_result), 500
    return jsonify({"message": "Domains refreshed successfully", "allDomains": refresh_result})

@app.route("/")
def serve_frontend():
    """Serve the main frontend HTML with theme injected."""
    saved_theme = settings.get("theme", "light")
    index_path = os.path.join(app.static_folder, "index.html")

    if not os.path.exists(index_path):
        return jsonify({"error": "index.html not found"}), 500

    with open(index_path) as f:
        html_content = f.read()

    html_content = html_content.replace("{{theme}}", saved_theme)
    return html_content

@app.route("/<path:path>")
def serve_static_files(path):
    """Serve static files (e.g., CSS, JS)."""
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)