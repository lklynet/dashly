function setupGroupNameEditing() {
  const groupNameInputs = document.querySelectorAll(".group-name-input");

  groupNameInputs.forEach((input) => {
    input.addEventListener("blur", async (event) => {
      const oldGroupName = event.target.dataset.group;
      const newGroupName = event.target.value.trim();

      // Check if the group name has actually changed
      if (newGroupName === oldGroupName) {
        return; // Do nothing if the name hasn't changed
      }

      if (newGroupName && !groups[newGroupName]) {
        // Rename the group
        groups[newGroupName] = groups[oldGroupName];
        delete groups[oldGroupName];

        // Update the renamed group name for "All Services" if applicable
        const settings = await fetchSettings();
        if (
          oldGroupName === settings.renamedGroupNames?.allServices ||
          oldGroupName === "All Services"
        ) {
          const renamedGroupNames = {
            ...settings.renamedGroupNames,
            allServices: newGroupName,
          };
          saveSetting("renamedGroupNames", renamedGroupNames); // Save the renamed group name
        }

        saveSetting("groups", groups); // Persist updated groups
        renderDashboard();
        setupDragAndDrop();
        console.log(
          `Group renamed from "${oldGroupName}" to "${newGroupName}".`
        );
      } else {
        alert("Invalid group name or name already exists.");
        event.target.value = oldGroupName; // Revert input to old name
      }
    });
  });
}

function setupDeleteGroupButtons() {
  const deleteButtons = document.querySelectorAll(".delete-group-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const groupName = event.target.dataset.group;

      // Check if the group still contains services
      if (groups[groupName] && groups[groupName].length > 0) {
        alert("You can't delete a group that still contains services.");
        return;
      }

      // Delete the group
      if (groups[groupName]) {
        delete groups[groupName];
        saveSetting("groups", groups); // Persist group removal
        renderDashboard();
        setupDragAndDrop();
        console.log(`Group "${groupName}" deleted.`);
      }
    });
  });
}
