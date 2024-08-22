document.addEventListener('DOMContentLoaded', function () {
  const openModalBtn = document.getElementById('add');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('myModal');
  const submitBtn = document.getElementById('submitBtn');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const modalForm = document.getElementById('modalForm');
  const notesContainer = document.getElementById('notesContainer');
  const searchInput = document.getElementById('search');

  let editTarget = null; // Variable to store the note being edited

  // Load notes from local storage on page load
  function loadNotesFromLocalStorage() {
    let child = notesContainer.lastElementChild;
    while (child) {
        if (child == document.getElementById("do")) {
          break;
        } else {
        notesContainer.removeChild(child);
        child = notesContainer.lastElementChild;
        }}
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach((note) => {
      createNoteCard(note.title, note.description);
    });
  }

  // Save notes to local storage
  function saveNotesToLocalStorage() {
    const noteCards = document.querySelectorAll('.card');
    const notes = [];
    noteCards.forEach((card) => {
      const title = card.querySelector('h2').innerText;
      const description = card.querySelector('p').innerText;
      notes.push({ title, description });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  // Create a new note card and append it to the notes container
  function createNoteCard(title, description) {
    const noteCard = document.createElement('div');
    noteCard.classList.add('card');
    noteCard.innerHTML = `<h2>${title}</h2><p>${description}</p>`;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-btn');

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    noteCard.appendChild(buttonsContainer);

    // Add click event listeners to the buttons
    editButton.addEventListener('click', function () {
      openEditModal(title, description, noteCard);
    });

    deleteButton.addEventListener('click', function () {
      deleteNoteCard(noteCard);
    });

    notesContainer.appendChild(noteCard);
  }

  // Open the edit modal with existing data
  function openEditModal(title, description, targetNoteCard) {
    modal.style.display = 'block';
    titleInput.value = title;
    descriptionInput.value = description;
    editTarget = targetNoteCard; // Set the edit target to the clicked note card
  }

  // Delete the note card
  function deleteNoteCard(noteCard) {
    notesContainer.removeChild(noteCard);
    saveNotesToLocalStorage();
  }

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    editTarget = null; // Reset edit target when closing the modal
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      editTarget = null; // Reset edit target when closing the modal
    }
  });

  submitBtn.addEventListener('click', function () {
    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title && description) {
      if (editTarget) {
        // If there's an edit target, update the existing note
        editTarget.querySelector('h2').innerText = title;
        editTarget.querySelector('p').innerText = description;
        editTarget = null; // Reset edit target after editing
        
      } else {
        // Otherwise, create a new note card
        createNoteCard(title, description);
      }

      // Save notes to local storage
      saveNotesToLocalStorage();

      // Clear the form after adding/editing a note
      modalForm.reset();
      // Close the modal
      modal.style.display = 'none';
      loadNotesFromLocalStorage ()
    } else {
      alert('Please enter both title and description.');
    }
  });

  // Search functionality
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const noteCards = document.querySelectorAll('.card');

    noteCards.forEach((noteCard) => {
      const title = noteCard.querySelector('h2').innerText.toLowerCase();
      const description = noteCard.querySelector('p').innerText.toLowerCase();
      const isMatch = title.includes(query) || description.includes(query);
      noteCard.style.display = isMatch ? 'block' : 'none';
    });
  });

  // Load notes from local storage on page load
  loadNotesFromLocalStorage();
});
