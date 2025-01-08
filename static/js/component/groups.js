function setupGroupNameEditing() {
  const groupNameInputs = document.querySelectorAll(".group-name-input");

  groupNameInputs.forEach((input) => {
    async function handleGroupRename(event) {
      const oldGroupName = event.target.dataset.group;
      const newGroupName = event.target.value.trim();

      if (newGroupName === oldGroupName) {
        return;
      }

      if (newGroupName && !groups[newGroupName]) {
        groups[newGroupName] = groups[oldGroupName];
        delete groups[oldGroupName];

        if (
          oldGroupName === renamedGroupNames?.allServices ||
          oldGroupName === "All Services"
        ) {
          renamedGroupNames.allServices = newGroupName;
          await saveGroupsAndRenamedNamesToJSON(groups, renamedGroupNames);
        } else {
          await saveGroupsToJSON(groups);
        }

        renderDashboard();
        setupDragAndDrop();

      } else {
        alert("Invalid group name or name already exists.");
        event.target.value = oldGroupName;
      }
    }

    input.addEventListener("blur", handleGroupRename);

    input.addEventListener("keypress", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); 
        await handleGroupRename(event);
        input.blur();
      }
    });
  });
}

function setupDeleteGroupButtons() {
  const deleteButtons = document.querySelectorAll(".delete-group-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const groupName = event.target.dataset.group;

      if (groups[groupName] && groups[groupName].length > 0) {
        alert("You can't delete a group that still contains services.");
        return;
      }

      if (groups[groupName]) {
        delete groups[groupName];
        await saveGroupsToJSON(groups);
        renderDashboard();
        setupDragAndDrop();
      }
    });
  });
}

async function saveGroupsAndRenamedNamesToJSON(updatedGroups, updatedRenamedNames) {
  try {
    await fetch("/save-groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groups: updatedGroups,
        renamedGroupNames: updatedRenamedNames,
      }),
    });
  } catch (error) {
    console.error("Error saving groups and renamed group names:", error);
  }
}

async function saveGroupsToJSON(updatedGroups) {
  try {
    await fetch("/save-groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groups: updatedGroups }),
    });
  } catch (error) {
    console.error("Error saving groups:", error);
  }
}