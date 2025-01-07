"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function logMethod(target, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Called ${key} with args: ${JSON.stringify(args)}`);
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
// Generic class responsible for managing books
class BookManager {
    selectedRow = null;
    books = [];
    submitButton;
    tableBody;
    genreFilter;
    constructor() {
        this.submitButton = document.getElementById("submitData");
        this.tableBody = document.getElementById("booklist").getElementsByTagName("tbody")[0];
        this.genreFilter = document.getElementById("filterGenre");
        this.submitButton.addEventListener("click", (event) => this.handleFormSubmit(event));
        this.genreFilter.addEventListener("change", () => this.filterBooksByGenre());
    }
    handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const formData = this.getFormData();
        const isFormValid = this.validateForm();
        // If the form is valid and there's no selected row, add a new book
        if (isFormValid) {
            if (this.selectedRow === null) {
                this.addNewBook(formData);
            }
            else {
                this.updateBookRecord(formData);
            }
            this.resetForm();
            this.filterBooksByGenre(); // Re-filter after form submission
        }
    }
    // Retrieves form data from the input fields.
    getFormData() {
        return {
            title: document.getElementById("name").value,
            author: document.getElementById("author").value,
            isbn: document.getElementById("isbn").value,
            publisher: document.getElementById("publisher").value,
            publicationDate: document.getElementById("date").value,
            price: parseFloat(document.getElementById("price").value),
            genre: document.getElementById("genre").value,
        }; // Casting to the generic type T
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
            newRow.insertCell(5).innerHTML = book.price.toString();
            newRow.insertCell(6).innerHTML = book.genre;
            newRow.insertCell(7).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
            newRow.insertCell(8).innerHTML = this.calculateAge(book.publicationDate);
        });
    }
    // Resets the form fields to their default empty values.
    resetForm() {
        document.getElementById("name").value = "";
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
        document.getElementById("author").value = this.selectedRow.cells[1].innerHTML;
        document.getElementById("isbn").value = this.selectedRow.cells[2].innerHTML;
        document.getElementById("publisher").value = this.selectedRow.cells[3].innerHTML;
        document.getElementById("date").value = this.selectedRow.cells[4].innerHTML;
        document.getElementById("price").value = this.selectedRow.cells[5].innerHTML;
        document.getElementById("genre").value = this.selectedRow.cells[6].innerHTML;
    }
    // Updates the selected book record with the new form data.
    updateBookRecord(bookData) {
        const bookIndex = this.books.findIndex((book) => book.isbn === this.selectedRow?.cells[2].innerHTML);
        if (bookIndex !== -1) {
            // Update the book in the array with the new data
            this.books[bookIndex] = bookData;
            // Update the table row to reflect the updated data
            this.selectedRow.cells[0].innerHTML = bookData.title;
            this.selectedRow.cells[1].innerHTML = bookData.author;
            this.selectedRow.cells[2].innerHTML = bookData.isbn;
            this.selectedRow.cells[3].innerHTML = bookData.publisher;
            this.selectedRow.cells[4].innerHTML = bookData.publicationDate;
            this.selectedRow.cells[5].innerHTML = bookData.price.toString();
            this.selectedRow.cells[6].innerHTML = bookData.genre;
            this.selectedRow.cells[8].innerHTML = this.calculateAge(bookData.publicationDate);
        }
        else {
            alert("Error: Book not found for updating.");
        }
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
    // Validates the form before submission.
    validateForm() {
        const bookTitle = document.getElementById("name").value.trim();
        const bookAuthor = document.getElementById("author").value.trim();
        const bookIsbn = document.getElementById("isbn").value.trim();
        const bookPublisher = document.getElementById("publisher").value.trim();
        const bookPublicationDate = document.getElementById("date").value.trim();
        const bookPrice = document.getElementById("price").value.trim();
        const bookGenre = document.getElementById("genre").value.trim();
        // Reset any previous alert state (if any)
        let errorMessage = "";
        if (bookTitle === "" || bookAuthor === "" || bookIsbn === "" ||
            bookPublisher === "" || bookPublicationDate === "" || bookGenre === "") {
            errorMessage = "All fields must be filled out.";
        }
        else if (isNaN(Number(bookIsbn)) || Number(bookIsbn) <= 0) {
            errorMessage = "ISBN should be a valid positive number.";
        }
        else if (isNaN(Number(bookPrice)) || Number(bookPrice) <= 0) {
            errorMessage = "Price should be a valid positive number.";
        }
        // Display the error message only once
        if (errorMessage) {
            alert(errorMessage);
            return false;
        }
        return true; // Form is valid
    }
    // Filters books by genre based on the selected option.
    filterBooksByGenre() {
        const genre = this.genreFilter.value.trim().toLowerCase();
        const filteredBooks = genre === "all"
            ? this.books
            : this.books.filter(book => book.genre.toLowerCase() === genre);
        this.renderFilteredBooks(filteredBooks);
    }
    // Renders filtered books by genre.
    renderFilteredBooks(filteredBooks) {
        this.tableBody.innerHTML = "";
        filteredBooks.forEach((book) => {
            const newRow = this.tableBody.insertRow();
            newRow.insertCell(0).innerHTML = book.title;
            newRow.insertCell(1).innerHTML = book.author;
            newRow.insertCell(2).innerHTML = book.isbn;
            newRow.insertCell(3).innerHTML = book.publisher;
            newRow.insertCell(4).innerHTML = book.publicationDate;
            newRow.insertCell(5).innerHTML = book.price.toString();
            newRow.insertCell(6).innerHTML = book.genre;
            newRow.insertCell(7).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
            newRow.insertCell(8).innerHTML = this.calculateAge(book.publicationDate);
        });
    }
}
__decorate([
    logMethod
], BookManager.prototype, "handleFormSubmit", null);
const bookManager = new BookManager();
