class BookManager {
    constructor() {
        this.selectedRow = null;
        this.books = [];
        this.formSubmitButton = document.getElementById("submitData");
        this.tableBody = document.getElementById("booklist").getElementsByTagName('tbody')[0];
        this.filterGenre = document.getElementById("filterGenre");

        this.formSubmitButton.addEventListener("click", (e) => this.onSubmitForm(e));
        this.filterGenre.addEventListener("change", () => this.filterBooksByGenre());
    }

    onSubmitForm(e) {
        e.preventDefault();
        const formData = this.readFormData();
        if (this.selectedRow === null) {
            const returnValue = this.validateForm();
            console.log(returnValue);
            if (returnValue) {
                this.insertNewRecord(formData);
            } else {
                alert("All fields must be filled out");
                return;
            }
        } else {
            this.updateRecord(formData);
        }
        this.resetForm();
    }

    readFormData() {
        return {
            name: document.getElementById("name").value,
            author: document.getElementById("author").value,
            isbn: document.getElementById("isbn").value,
            publisher: document.getElementById("publisher").value,
            date: document.getElementById("date").value,
            price: document.getElementById("price").value,
            genre: document.getElementById("genre").value
        };
    }

    insertNewRecord(data) {
        this.books.push(data);
        this.renderBooks();
    }

    renderBooks() {
        this.tableBody.innerHTML = "";
        this.books.forEach(book => {
            const newRow = this.tableBody.insertRow();
            newRow.insertCell(0).innerHTML = book.name;
            newRow.insertCell(1).innerHTML = book.author;
            newRow.insertCell(2).innerHTML = book.isbn;
            newRow.insertCell(3).innerHTML = book.publisher;
            newRow.insertCell(4).innerHTML = book.date;
            newRow.insertCell(5).innerHTML = book.price;
            newRow.insertCell(6).innerHTML = book.genre;
            newRow.insertCell(7).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
            newRow.insertCell(8).innerHTML = this.ageCalculator(book.date);
        });
    }

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

    onEdit(td) {
        this.selectedRow = td.parentElement.parentElement;
        document.getElementById("name").value = this.selectedRow.cells[0].innerHTML;
        document.getElementById("author").value = this.selectedRow.cells[1].innerHTML;
        document.getElementById("isbn").value = this.selectedRow.cells[2].innerHTML;
        document.getElementById("publisher").value = this.selectedRow.cells[3].innerHTML;
        document.getElementById("date").value = this.selectedRow.cells[4].innerHTML;
        document.getElementById("price").value = this.selectedRow.cells[5].innerHTML;
        document.getElementById("genre").value = this.selectedRow.cells[6].innerHTML;
    }

    updateRecord(formData) {
        this.selectedRow.cells[0].innerHTML = formData.name;
        this.selectedRow.cells[1].innerHTML = formData.author;
        this.selectedRow.cells[2].innerHTML = formData.isbn;
        this.selectedRow.cells[3].innerHTML = formData.publisher;
        this.selectedRow.cells[4].innerHTML = formData.date;
        this.selectedRow.cells[5].innerHTML = formData.price;
        this.selectedRow.cells[6].innerHTML = formData.genre;
        this.selectedRow.cells[8].innerHTML = this.ageCalculator(formData.date);
    }

    onDelete(td) {
        if (confirm('Are you sure to delete this record?')) {
            const row = td.parentElement.parentElement;
            const bookIndex = Array.from(row.parentElement.children).indexOf(row);
            this.books.splice(bookIndex, 1);
            this.renderBooks();
            this.resetForm();
        }
    }

    ageCalculator(date) {
        const dob = new Date(date);
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

    validateForm() {
        const name = document.getElementById("name").value;
        const author = document.getElementById("author").value;
        const isbn = document.getElementById("isbn").value;
        const publisher = document.getElementById("publisher").value;
        const date = document.getElementById("date").value;
        const price = document.getElementById("price").value;
        const genre = document.getElementById("genre").value;

        if (name === "" || author === "" || isbn === "" || publisher === "" || date === "" || genre === "") {
            alert("All fields must be filled out.");
            return false;
        }

        if (isNaN(isbn)) {
            alert("ISBN should be a valid number.");
            return false;
        }
        return true;
    }

    filterBooksByGenre() {
        const selectedGenre = this.filterGenre.value;
        if (selectedGenre === "all") {
            this.renderBooks();
        } else {
            const filteredBooks = this.books.filter(book => book.genre === selectedGenre);
            this.tableBody.innerHTML = "";
            filteredBooks.forEach(book => {
                const newRow = this.tableBody.insertRow();
                newRow.insertCell(0).innerHTML = book.name;
                newRow.insertCell(1).innerHTML = book.author;
                newRow.insertCell(2).innerHTML = book.isbn;
                newRow.insertCell(3).innerHTML = book.publisher;
                newRow.insertCell(4).innerHTML = book.date;
                newRow.insertCell(5).innerHTML = book.price;
                newRow.insertCell(6).innerHTML = book.genre;
                newRow.insertCell(7).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
                newRow.insertCell(8).innerHTML = this.ageCalculator(book.date);
            });
        }
    }
}

// Initialize the BookManager class
const bookManager = new BookManager();
