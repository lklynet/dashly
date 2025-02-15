function setupDragAndDrop() {
  const cards = document.querySelectorAll(".card");
  const droppables = document.querySelectorAll(".drop-zone");

  cards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
    });
  });

  droppables.forEach((dropZone) => {
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("highlight");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("highlight");
    });

    dropZone.addEventListener("drop", async (event) => {
      event.preventDefault();
      dropZone.classList.remove("highlight");
      const domainId = parseInt(event.dataTransfer.getData("text/plain"), 10);
      const newGroup = dropZone.dataset.group;

      Object.keys(groups).forEach((group) => {
        const index = groups[group].indexOf(domainId);
        if (index > -1) groups[group].splice(index, 1);
      });

      if (!groups[newGroup].includes(domainId)) {
        groups[newGroup].push(domainId);
        await saveGroupsToJSON(groups);
      }

      renderDashboard();
      setupDragAndDrop();
    });
  });
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
    console.error("Error saving groups to JSON:", error);
  }
}