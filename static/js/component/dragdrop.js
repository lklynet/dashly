// Drag-and-Drop Handlers
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
      dropZone.classList.add("highlight"); // Highlight the drop zone
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("highlight"); // Remove highlight
    });

    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("highlight"); // Remove highlight
      const domainId = event.dataTransfer.getData("text/plain");
      const newGroup = dropZone.dataset.group;

      Object.keys(groups).forEach((group) => {
        const index = groups[group].indexOf(parseInt(domainId, 10));
        if (index > -1) groups[group].splice(index, 1);
      });

      if (!groups[newGroup].includes(parseInt(domainId, 10))) {
        groups[newGroup].push(parseInt(domainId, 10));
        saveSetting("groups", groups); // Persist updated group services
      }

      renderDashboard();
      setupDragAndDrop();
    });
  });
}
