class BookManager {
  constructor() {
    // Initialize the book manager, select DOM elements and set up event listeners.
    this.selectedRow = null;
    this.books = [];
    this.submitButton = document.getElementById("submitData");
    this.tableBody = document
      .getElementById("booklist")
      .getElementsByTagName("tbody")[0];
    this.genreFilter = document.getElementById("filterGenre");
    this.submitButton.addEventListener("click", (event) =>
      this.handleFormSubmit(event)
    );
    this.genreFilter.addEventListener("change", () =>
      this.filterBooksByGenre()
    );
  }

  // Handles the form submission, validates data, adds or updates a book.
  handleFormSubmit(event) {
    event.preventDefault();
    const formData = this.getFormData();
    if (this.selectedRow === null) {
      const isFormValid = this.validateForm();
      if (isFormValid) {
        this.addNewBook(formData);
      } else {
        return;
      }
    } else {
      if (this.validateForm()) this.updateBookRecord(formData);
    }
    this.resetForm();
  }

  // Retrieves form data from the input fields.
  getFormData() {
    return {
      title: document.getElementById("name").value,
      author: document.getElementById("author").value,
      isbn: document.getElementById("isbn").value,
      publisher: document.getElementById("publisher").value,
      publicationDate: document.getElementById("date").value,
      price: document.getElementById("price").value,
      genre: document.getElementById("genre").value,
    };
  }

  // Adds a new book to the books array and re-renders the table.
  addNewBook(bookData) {
    this.books.push(bookData);
    this.renderBooks();
  }

  // Renders all books in the books array to the table.
  renderBooks() {
    this.tableBody.innerHTML = "";
    this.books.forEach((book) => {
      const newRow = this.tableBody.insertRow();
      newRow.insertCell(0).innerHTML = book.title;
      newRow.insertCell(1).innerHTML = book.author;
      newRow.insertCell(2).innerHTML = book.isbn;
      newRow.insertCell(3).innerHTML = book.publisher;
      newRow.insertCell(4).innerHTML = book.publicationDate;
      newRow.insertCell(5).innerHTML = book.price;
      newRow.insertCell(6).innerHTML = book.genre;
      newRow.insertCell(
        7
      ).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
      newRow.insertCell(8).innerHTML = this.calculateAge(book.publicationDate);
    });
  }

  // Resets the form fields to their default empty values.
  resetForm() {
    document.getElementById("name").value = ""; // Fixed typo here
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("publisher").value = "";
    document.getElementById("date").value = "";
    document.getElementById("price").value = "";
    document.getElementById("genre").value = "";
    this.selectedRow = null;
  }

  // Populates the form with data from the selected book row for editing.
  onEdit(cell) {
    this.selectedRow = cell.parentElement.parentElement;
    document.getElementById("name").value = this.selectedRow.cells[0].innerHTML;
    document.getElementById("author").value =
      this.selectedRow.cells[1].innerHTML;
    document.getElementById("isbn").value = this.selectedRow.cells[2].innerHTML;
    document.getElementById("publisher").value =
      this.selectedRow.cells[3].innerHTML;
    document.getElementById("date").value = this.selectedRow.cells[4].innerHTML;
    document.getElementById("price").value =
      this.selectedRow.cells[5].innerHTML;
    document.getElementById("genre").value =
      this.selectedRow.cells[6].innerHTML;
  }

  // Updates the selected book record with the new form data.
  updateBookRecord(bookData) {
    // Find the index of the book being edited
    const bookIndex = Array.from(
      this.selectedRow.parentElement.children
    ).indexOf(this.selectedRow);
    // Update the book in the array
    this.books[bookIndex] = bookData;

    // Update the row in the table
    this.selectedRow.cells[0].innerHTML = bookData.title;
    this.selectedRow.cells[1].innerHTML = bookData.author;
    this.selectedRow.cells[2].innerHTML = bookData.isbn;
    this.selectedRow.cells[3].innerHTML = bookData.publisher;
    this.selectedRow.cells[4].innerHTML = bookData.publicationDate;
    this.selectedRow.cells[5].innerHTML = bookData.price;
    this.selectedRow.cells[6].innerHTML = bookData.genre;
    this.selectedRow.cells[8].innerHTML = this.calculateAge(
      bookData.publicationDate
    );

    // Reapply the genre filter after the update
    this.filterBooksByGenre();
  }

  // Deletes the selected book record after confirmation.
  onDelete(cell) {
    if (confirm("Are you sure to delete this record?")) {
      const row = cell.parentElement.parentElement;
      const bookIndex = Array.from(row.parentElement.children).indexOf(row);
      this.books.splice(bookIndex, 1);
      this.renderBooks();
      this.resetForm();
    }
  }

  // Calculates the age of the book based on its publication date.
  calculateAge(publicationDate) {
    const dob = new Date(publicationDate);
    const today = new Date();

    let ageYears = today.getFullYear() - dob.getFullYear();
    let ageMonths = today.getMonth() - dob.getMonth();
    let ageDays = today.getDate() - dob.getDate();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }
    if (ageDays < 0) {
      ageMonths--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      ageDays += lastMonth.getDate();
    }

    return `${ageYears} years, ${ageMonths} months, and ${ageDays} days`;
  }

  // Validates the form data before submitting.
  validateForm() {
    const bookTitle = document.getElementById("name").value;
    const bookAuthor = document.getElementById("author").value;
    const bookIsbn = document.getElementById("isbn").value;
    const bookPublisher = document.getElementById("publisher").value;
    const bookPublicationDate = document.getElementById("date").value;
    const bookPrice = document.getElementById("price").value;
    const bookGenre = document.getElementById("genre").value;

    let errorMessage = "";

    // Check if any required field is empty
    if (bookTitle === "") errorMessage += "Title is required.\n";
    if (bookAuthor === "") errorMessage += "Author is required.\n";
    if (bookIsbn === "") errorMessage += "ISBN is required.\n";
    if (bookPublisher === "") errorMessage += "Publisher is required.\n";
    if (bookPublicationDate === "")
      errorMessage += "Publication Date is required.\n";
    if (bookGenre === "") errorMessage += "Genre is required.\n";

    // If there's any missing information, show one alert
    if (errorMessage !== "") {
      alert("Please fill out the following fields:\n" + errorMessage);
      return false;
    }

    // Check if ISBN is a valid number
    if (isNaN(bookIsbn)) {
      alert("ISBN should be a valid number.");
      return false;
    }

    return true;
  }

  // Filters books based on the selected genre and re-renders the table.
  filterBooksByGenre() {
    const selectedGenre = this.genreFilter.value;
    if (selectedGenre === "all") {
      this.renderBooks();
    } else {
      const filteredBooks = this.books.filter(
        (book) => book.genre === selectedGenre
      );
      this.tableBody.innerHTML = "";
      filteredBooks.forEach((book) => {
        const newRow = this.tableBody.insertRow();
        newRow.insertCell(0).innerHTML = book.title;
        newRow.insertCell(1).innerHTML = book.author;
        newRow.insertCell(2).innerHTML = book.isbn;
        newRow.insertCell(3).innerHTML = book.publisher;
        newRow.insertCell(4).innerHTML = book.publicationDate;
        newRow.insertCell(5).innerHTML = book.price;
        newRow.insertCell(6).innerHTML = book.genre;
        newRow.insertCell(
          7
        ).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
        newRow.insertCell(8).innerHTML = this.calculateAge(
          book.publicationDate
        );
      });
    }
  }
}

// Initialize the book manager instance.
const bookManager = new BookManager();
 