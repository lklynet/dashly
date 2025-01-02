function setupEventListeners() {
  document.getElementById("add-group").addEventListener("click", () => {
    const groupName = prompt("Enter new group name:");
    if (groupName && !groups[groupName]) {
      groups[groupName] = [];
      renderDashboard();
      setupDragAndDrop();
      saveSetting("groups", groups); // Persist groups to backend
    } else {
      alert("Group name already exists or is invalid.");
    }
  });

  document.getElementById("edit-button").addEventListener("click", () => {
    editMode = !editMode;

    const editControls = document.querySelector(".edit-controls");
    const editButton = document.getElementById("edit-button");

    if (editMode) {
      editControls.classList.remove("hidden");
      editButton.textContent = "Done";
    } else {
      editControls.classList.add("hidden");
      editButton.textContent = "Edit";
    }

    renderDashboard();
    setupDragAndDrop();
  });
}

fetchAndRender();
