// Initialize state variables
let showInactive = true; // Toggle for inactive domains
let showSearch = true; // Toggle for search bar
let allDomains = []; // Store all domains
let editMode = false; // Edit Mode toggle state
let groups = { "New Services": [] }; // Stores groups and their associated domain IDs
let allServicesGroupName = "New Services"; // Track the current name of the "New Services" group
let maxColumns = 3; // Default max columns for groups

const gridcontainer = document.getElementById("dashboard");

let groupCount = 0;
function calculateWidth(groupsInRow) {
  return 100 / groupsInRow + "%";
}

// Fetch and render the dashboard
async function fetchAndRender() {
  try {
    // Fetch user settings from the backend
    const settings = await fetchSettings();
    maxColumns = settings.maxColumns || 3; // Load max columns or default to 3
    const maxColumnsButton = document.getElementById("max-columns-toggle");
    maxColumnsButton.textContent = `Columns: ${maxColumns}`;
    showInactive = !settings.hideInactive; // Invert because "hideInactive" means hidden
    currentSortCriteria = settings.sortBy || "domain"; // Load sort criteria or default to domain

    // Update the sort button text
    const sortButton = document.getElementById("sort-toggle");
    sortButton.textContent = `Sort: ${formatSortOption(currentSortCriteria)}`;

    // Update the "Hide Inactive Domains" button text
    const toggleInactiveButton = document.getElementById("toggle-inactive");
    toggleInactiveButton.textContent = showInactive
      ? "Hide Inactive Domains"
      : "Show Inactive Domains";

    document
      .getElementById("max-columns-toggle")
      .addEventListener("click", () => {
        toggleMaxColumns();
      });

    // Fetch domain data from the server
    const response = await fetch("/domains");
    const { domains } = await response.json();
    allDomains = domains; // Store all domains

    // Initialize groups
    groups = settings.groups || {};
    let allServicesGroupName =
      settings.renamedGroupNames?.allServices || "New Services";

    // Check if the renamed "New Services" group exists
    if (!groups[allServicesGroupName]) {
      groups[allServicesGroupName] = domains.map((domain) => domain.id); // Populate with all domain IDs
    }

    // Save updated settings to ensure "New Services" persists under the renamed name
    saveSetting("groups", groups);
    saveSetting("renamedGroupNames", {
      ...settings.renamedGroupNames,
      allServices: allServicesGroupName,
    });

    // Render the dashboard
    sortDomains(currentSortCriteria);
    renderDashboard();
    setupEventListeners(); // Set up event listeners
    setupDragAndDrop(); // Set up drag-and-drop functionality
  } catch (error) {
    console.error("Error fetching or rendering data:", error);
  }
}

function toggleMaxColumns() {
  // Cycle through 1, 2, 3 columns
  maxColumns = maxColumns === 3 ? 1 : maxColumns + 1;

  // Update the button text
  const maxColumnsButton = document.getElementById("max-columns-toggle");
  maxColumnsButton.textContent = `Columns: ${maxColumns}`;

  // Save the setting persistently
  saveSetting("maxColumns", maxColumns);

  // Re-render the dashboard with the new column layout
  renderDashboard();
}

// Update the grid template dynamically
function updateGridTemplate(groupCount) {
  const dashboard = document.getElementById("dashboard");

  // Reset the grid layout
  dashboard.style.display = "grid";
  dashboard.style.gridGap = "1rem";

  if (groupCount <= maxColumns) {
    // If fewer groups than maxColumns, make each group fill proportionally
    dashboard.style.gridTemplateColumns = `repeat(${groupCount}, 1fr)`;
  } else {
    // Distribute columns evenly across maxColumns, wrapping naturally
    dashboard.style.gridTemplateColumns = `repeat(${maxColumns}, 1fr)`;
  }

  // Let rows dynamically adjust heights
  dashboard.style.gridAutoRows = "auto";
}

// Render the dashboard with groups
function renderDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = ""; // Clear the grid

  const groupCount = Object.keys(groups).length;
  updateGridTemplate(groupCount);

  Object.keys(groups).forEach((groupName) => {
    const groupContainer = document.createElement("div");
    groupContainer.className = "group-container";
    groupContainer.dataset.group = groupName;

    const groupHeader = document.createElement("div");
    groupHeader.className = "group-header";

    if (editMode) {
      groupHeader.innerHTML = `
            <input 
                class="group-name-input" 
                data-group="${groupName}" 
                value="${groupName}" 
            />
            <button class="delete-group-button" data-group="${groupName}">
                &times;
            </button>
        `;
    } else {
      groupHeader.innerHTML = `<h2>${groupName}</h2>`;
    }

    groupContainer.appendChild(groupHeader);

    const groupServices = document.createElement("div");
    groupServices.className = "group-services droppable";
    groupServices.dataset.group = groupName;

    if (editMode) {
      const dropZone = document.createElement("div");
      dropZone.className = "drop-zone";
      dropZone.dataset.group = groupName;
      dropZone.textContent = "Drop here to add to group";
      groupServices.appendChild(dropZone);
    }

    const domainIds = groups[groupName];
    domainIds.forEach((domainId) => {
      const domain = allDomains.find((d) => d.id === domainId);
      if (domain && (showInactive || domain.enabled)) {
        const card = createCard(domain);
        groupServices.appendChild(card);
      }
    });

    groupContainer.appendChild(groupServices);
    dashboard.appendChild(groupContainer);
  });

  // Handle ungrouped domains
  const ungroupedDomains = allDomains.filter((domain) => {
    return !Object.values(groups).some((group) => group.includes(domain.id));
  });

  if (ungroupedDomains.length > 0) {
    console.log(
      "Adding ungrouped domains to 'New Services':",
      ungroupedDomains
    );

    const defaultGroup = "New Services";
    if (!groups[defaultGroup]) {
      groups[defaultGroup] = [];
    }

    ungroupedDomains.forEach((domain) => {
      groups[defaultGroup].push(domain.id);
    });

    saveSetting("groups", groups); // Persist changes
  }

  if (editMode) {
    setupGroupNameEditing();
    setupDeleteGroupButtons();
  }

  setupDragAndDrop(); // Ensure drag-and-drop functionality
}

// Create Card
function createCard(domain) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = editMode; // Keep your drag logic
  card.dataset.id = domain.id;

  const hostPort = `${domain.forward_host}:${domain.forward_port}`;

  let statusClass = "red";
  if (domain.nginx_online && domain.enabled) {
    statusClass = "green";
  } else if (!domain.nginx_online && domain.enabled) {
    statusClass = "yellow";
  }

  // Keep your existing card layout
  card.innerHTML = `
    <div class="status-dot ${statusClass}"></div>
    <h3>${domain.domain_names.join(", ")}</h3>
    <p>${hostPort}</p>
  `;

  // If NOT in edit mode, add an invisible link overlay
  if (!editMode) {
    const linkOverlay = document.createElement("a");
    // Choose your preferred protocol or domain
    linkOverlay.href = `http://${domain.domain_names.join(", ")}`;
    linkOverlay.target = "_blank";
    linkOverlay.rel = "noopener noreferrer";
    // Give it a class so we can do minimal styling in CSS
    linkOverlay.className = "card-overlay-link";

    card.appendChild(linkOverlay);
  }

  return card;
}
