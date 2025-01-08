async function setupEventListeners() {
  const addGroupButton = document.getElementById("add-group");
  if (addGroupButton) {
    addGroupButton.addEventListener("click", async () => {
      const defaultGroupName = "New Group";
      let groupName = defaultGroupName;
      let counter = 1;
  
      while (groups[groupName]) {
        groupName = `${defaultGroupName} ${counter}`;
        counter++;
      }
  
      groups[groupName] = [];
  
      try {
        const settingsResponse = await fetch("/settings");
        if (!settingsResponse.ok) throw new Error("Failed to fetch settings");
  
        const settings = await settingsResponse.json();
        const updatedSettings = { ...settings, groups };
  
        await fetch("/save-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSettings),
        });
        renderDashboard();
        setupDragAndDrop();
      } catch (error) {
        console.error("Error adding group:", error);
      }
    });
  }

  const editButton = document.getElementById("edit-button");
  if (editButton) {
    editButton.addEventListener("click", () => {
      editMode = !editMode;

      const editControls = document.querySelector(".edit-controls");

      if (!editControls) {
        console.error("Missing edit-controls element.");
        return;
      }

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
  } else {
    console.error("Edit button not found in DOM.");
  }
}