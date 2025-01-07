interface IBook {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  price: number;
  genre: string;
}

// Generic interface for the form service
interface IFormService<T> {
  handleFormSubmit(event: Event): void;
  resetForm(): void;
  getFormData(): T;
  validateForm(): boolean;
}

function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Called ${key} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Generic class responsible for managing books
class BookManager<T extends IBook> implements IFormService<T> {
  private selectedRow: HTMLTableRowElement | null = null;
  private books: T[] = [];
  private submitButton: HTMLButtonElement;
  private tableBody: HTMLTableSectionElement;
  private genreFilter: HTMLSelectElement;

  constructor() {
    this.submitButton = document.getElementById(
      "submitData"
    ) as HTMLButtonElement;
    this.tableBody = document
      .getElementById("booklist")!
      .getElementsByTagName("tbody")[0] as HTMLTableSectionElement;
    this.genreFilter = document.getElementById(
      "filterGenre"
    ) as HTMLSelectElement;

    this.submitButton.addEventListener("click", (event) =>
      this.handleFormSubmit(event)
    );
    this.genreFilter.addEventListener("change", () =>
      this.filterBooksByGenre()
    );
  }

  @logMethod
  handleFormSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission
    const formData = this.getFormData();
    const isFormValid = this.validateForm();

    // If the form is valid and there's no selected row, add a new book
    if (isFormValid) {
      if (this.selectedRow === null) {
        this.addNewBook(formData);
      } else {
        this.updateBookRecord(formData);
      }
      this.resetForm();
      this.filterBooksByGenre(); // Re-filter after form submission
    }
  }

  // Retrieves form data from the input fields.
  getFormData(): T {
    return {
      title: (document.getElementById("name") as HTMLInputElement).value,
      author: (document.getElementById("author") as HTMLInputElement).value,
      isbn: (document.getElementById("isbn") as HTMLInputElement).value,
      publisher: (document.getElementById("publisher") as HTMLInputElement)
        .value,
      publicationDate: (document.getElementById("date") as HTMLInputElement)
        .value,
      price: parseFloat(
        (document.getElementById("price") as HTMLInputElement).value
      ),
      genre: (document.getElementById("genre") as HTMLSelectElement).value,
    } as T; // Casting to the generic type T
  }

  // Adds a new book to the books array and re-renders the table.
  addNewBook(bookData: T): void {
    this.books.push(bookData);
    this.renderBooks();
  }

  // Renders all books in the books array to the table.
  renderBooks(): void {
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
      newRow.insertCell(
        7
      ).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
      newRow.insertCell(8).innerHTML = this.calculateAge(book.publicationDate);
    });
  }

  // Resets the form fields to their default empty values.
  resetForm(): void {
    (document.getElementById("name") as HTMLInputElement).value = "";
    (document.getElementById("author") as HTMLInputElement).value = "";
    (document.getElementById("isbn") as HTMLInputElement).value = "";
    (document.getElementById("publisher") as HTMLInputElement).value = "";
    (document.getElementById("date") as HTMLInputElement).value = "";
    (document.getElementById("price") as HTMLInputElement).value = "";
    (document.getElementById("genre") as HTMLSelectElement).value = "";
    this.selectedRow = null;
  }

  // Populates the form with data from the selected book row for editing.
  onEdit(cell: HTMLAnchorElement): void {
    this.selectedRow = cell.parentElement!.parentElement as HTMLTableRowElement;
    (document.getElementById("name") as HTMLInputElement).value =
      this.selectedRow.cells[0].innerHTML;
    (document.getElementById("author") as HTMLInputElement).value =
      this.selectedRow.cells[1].innerHTML;
    (document.getElementById("isbn") as HTMLInputElement).value =
      this.selectedRow.cells[2].innerHTML;
    (document.getElementById("publisher") as HTMLInputElement).value =
      this.selectedRow.cells[3].innerHTML;
    (document.getElementById("date") as HTMLInputElement).value =
      this.selectedRow.cells[4].innerHTML;
    (document.getElementById("price") as HTMLInputElement).value =
      this.selectedRow.cells[5].innerHTML;
    (document.getElementById("genre") as HTMLSelectElement).value =
      this.selectedRow.cells[6].innerHTML;
  }

  // Updates the selected book record with the new form data.
  updateBookRecord(bookData: T): void {
    const bookIndex = this.books.findIndex(
      (book) => book.isbn === this.selectedRow?.cells[2].innerHTML
    );
    if (bookIndex !== -1) {
      // Update the book in the array with the new data
      this.books[bookIndex] = bookData;

      // Update the table row to reflect the updated data
      this.selectedRow!.cells[0].innerHTML = bookData.title;
      this.selectedRow!.cells[1].innerHTML = bookData.author;
      this.selectedRow!.cells[2].innerHTML = bookData.isbn;
      this.selectedRow!.cells[3].innerHTML = bookData.publisher;
      this.selectedRow!.cells[4].innerHTML = bookData.publicationDate;
      this.selectedRow!.cells[5].innerHTML = bookData.price.toString();
      this.selectedRow!.cells[6].innerHTML = bookData.genre;
      this.selectedRow!.cells[8].innerHTML = this.calculateAge(
        bookData.publicationDate
      );
    } else {
      alert("Error: Book not found for updating.");
    }
  }

  // Deletes the selected book record after confirmation.
  onDelete(cell: HTMLAnchorElement): void {
    if (confirm("Are you sure to delete this record?")) {
      const row = cell.parentElement!.parentElement as HTMLTableRowElement;
      const bookIndex = Array.from(row.parentElement!.children).indexOf(row);
      this.books.splice(bookIndex, 1);
      this.renderBooks();
      this.resetForm();
    }
  }

  // Calculates the age of the book based on its publication date.
  calculateAge(publicationDate: string): string {
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
  validateForm(): boolean {
    const bookTitle = (
      document.getElementById("name") as HTMLInputElement
    ).value.trim();
    const bookAuthor = (
      document.getElementById("author") as HTMLInputElement
    ).value.trim();
    const bookIsbn = (
      document.getElementById("isbn") as HTMLInputElement
    ).value.trim();
    const bookPublisher = (
      document.getElementById("publisher") as HTMLInputElement
    ).value.trim();
    const bookPublicationDate = (
      document.getElementById("date") as HTMLInputElement
    ).value.trim();
    const bookPrice = (
      document.getElementById("price") as HTMLInputElement
    ).value.trim();
    const bookGenre = (
      document.getElementById("genre") as HTMLSelectElement
    ).value.trim();

    // Reset any previous alert state (if any)
    let errorMessage = "";

    if (
      bookTitle === "" ||
      bookAuthor === "" ||
      bookIsbn === "" ||
      bookPublisher === "" ||
      bookPublicationDate === "" ||
      bookGenre === ""
    ) {
      errorMessage = "All fields must be filled out.";
    } else if (isNaN(Number(bookIsbn)) || Number(bookIsbn) <= 0) {
      errorMessage = "ISBN should be a valid positive number.";
    } else if (isNaN(Number(bookPrice)) || Number(bookPrice) <= 0) {
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
  filterBooksByGenre(): void {
    const genre = this.genreFilter.value.trim().toLowerCase();
    const filteredBooks =
      genre === "all"
        ? this.books
        : this.books.filter((book) => book.genre.toLowerCase() === genre);

    this.renderFilteredBooks(filteredBooks);
  }

  // Renders filtered books by genre.
  renderFilteredBooks(filteredBooks: T[]): void {
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
      newRow.insertCell(
        7
      ).innerHTML = `<a href="#" onClick="bookManager.onEdit(this)">Edit</a> | <a href="#" onClick="bookManager.onDelete(this)">Delete</a>`;
      newRow.insertCell(8).innerHTML = this.calculateAge(book.publicationDate);
    });
  }
}

const bookManager = new BookManager<IBook>();
