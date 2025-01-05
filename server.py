from flask import Flask, jsonify, send_from_directory, request # type: ignore
import sqlite3
import json
import os

app = Flask(__name__, static_folder="static")

# Hardcoded paths match the mounted volumes
import os

# Ensure paths are absolute
READ_ONLY_DB_PATH = os.getenv("NGINX_DB_PATH", "/nginx/database.sqlite")
user_settings_env = os.getenv("USER_SETTINGS", "data")
if not os.path.isabs(user_settings_env):
    user_settings_env = os.path.join("/", user_settings_env)

USER_SETTINGS_DB = os.path.join(user_settings_env, "user_settings.db")

# Ensure the directory exists
user_settings_dir = os.path.dirname(USER_SETTINGS_DB)
os.makedirs(user_settings_dir, exist_ok=True)

# Log paths for debugging (optional)
print(f"READ_ONLY_DB_PATH: {READ_ONLY_DB_PATH}")
print(f"USER_SETTINGS_DB: {USER_SETTINGS_DB}")

def init_user_settings_db():
    print("Initializing user_settings.db")  # Debug Log
    conn = sqlite3.connect(USER_SETTINGS_DB)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            id INTEGER PRIMARY KEY,
            settings_json TEXT
        )
    """)
    c.execute("SELECT COUNT(*) FROM app_settings")
    count = c.fetchone()[0]
    if count == 0:
        print("Inserting default settings.")  # Debug Log
        default_settings = {
            "theme": "light",
            "hideInactive": False,
            "hideSearch": False,
            "layoutView": "list",
            "sortBy": "domain",
            "maxColumns": 3,
            "groups": {},  # Add groups here
            "renamedGroupNames": {}
        }
        c.execute("INSERT INTO app_settings (id, settings_json) VALUES (?, ?)",
                  (1, json.dumps(default_settings)))
    conn.commit()
    conn.close()

def init_user_settings_db():
    print("Initializing user_settings.db")  # Debug Log
    conn = sqlite3.connect(USER_SETTINGS_DB)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            id INTEGER PRIMARY KEY,
            settings_json TEXT
        )
    """)
    c.execute("SELECT COUNT(*) FROM app_settings")
    count = c.fetchone()[0]
    if count == 0:
        print("Inserting default settings.")  # Debug Log
        default_settings = {
            "theme": "light",
            "hideInactive": False,
            "hideSearch": False,
            "layoutView": "list",
            "sortBy": "domain",
            "maxColumns": 3,
            "groups": {},
            "renamedGroupNames": {}
        }
        c.execute("INSERT INTO app_settings (id, settings_json) VALUES (?, ?)",
                  (1, json.dumps(default_settings)))
    conn.commit()
    conn.close()


@app.route("/domains")
def get_domains():
    """
    Fetch domain info from the read-only DB (database.sqlite).
    """
    conn = sqlite3.connect(READ_ONLY_DB_PATH)
    cursor = conn.cursor()
    query = """
        SELECT id, domain_names, forward_host, forward_port, meta, enabled 
        FROM proxy_host
        WHERE is_deleted = 0
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    domains = []
    for row in rows:
        domain = {
            "id": row[0],
            "domain_names": json.loads(row[1]),
            "forward_host": row[2],
            "forward_port": row[3],
            "nginx_online": json.loads(row[4]).get("nginx_online", False) if row[4] else False,
            "enabled": bool(row[5])
        }
        domains.append(domain)

    return jsonify({"domains": domains})

@app.route("/appsettings", methods=["GET"])
def get_app_settings():
    """
    Return the user settings from user_settings.db as JSON.
    """
    conn = sqlite3.connect(USER_SETTINGS_DB)
    c = conn.cursor()
    c.execute("SELECT settings_json FROM app_settings WHERE id=1")
    row = c.fetchone()
    conn.close()

    if row:
        settings_data = json.loads(row[0])
        return jsonify(settings_data)
    else:
        # If for some reason the row doesn't exist, we can return defaults or an error
        return jsonify({"error": "Settings not found"}), 404

@app.route("/appsettings", methods=["POST"])
def update_app_settings():
    """
    Update the user settings in user_settings.db from request body JSON.
    """
    try:
        new_settings = request.json  # Expect a JSON body
    except Exception as e:
        return jsonify({"error": "Invalid JSON"}), 400

    # Validate or sanitize new_settings as needed (omitted here for brevity)

    # Save to DB
    conn = sqlite3.connect(USER_SETTINGS_DB)
    c = conn.cursor()
    c.execute("UPDATE app_settings SET settings_json = ? WHERE id=1",
              (json.dumps(new_settings),))
    conn.commit()
    conn.close()

    return jsonify({"message": "Settings updated successfully"}), 200

@app.route("/")
def serve_frontend():
    # Fetch the saved theme from the database
    conn = sqlite3.connect(USER_SETTINGS_DB)
    c = conn.cursor()
    c.execute("SELECT settings_json FROM app_settings WHERE id=1")
    row = c.fetchone()
    conn.close()

    # Default to "light" theme if no settings are found
    saved_theme = "light"
    if row:
        settings = json.loads(row[0])
        saved_theme = settings.get("theme", "light")

    # Read the index.html file and inject the theme into the <script> tag
    with open(os.path.join(app.static_folder, "index.html")) as f:
        html_content = f.read()

    # Replace the {{theme}} placeholder in the inline script
    html_content = html_content.replace("{{theme}}", saved_theme)

    # Return the modified HTML
    return html_content




@app.route("/<path:path>")
def serve_static_files(path):
    # Serve other static files (e.g., CSS, JS)
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    # Initialize the user settings DB/tables
    init_user_settings_db()
    
    app.run(host="0.0.0.0", port=8080)