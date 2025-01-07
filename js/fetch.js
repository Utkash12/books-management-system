class BookCategoryManager {
  constructor() {
    // Initialize UI elements and properties
    this.categorySelect = document.getElementById("categories");
    this.tableBody = document
      .getElementById("books")
      .getElementsByTagName("tbody")[0];
    this.books = [];
    this.loadingMessage = document.getElementById("loadingMessage");

    // Set up event listeners
    this.addEventListeners();

    // Fetch data when the page is loaded
    this.loadDataOnWindowLoad();
  }

  // Adds event listeners for category change and page load
  addEventListeners() {
    this.categorySelect.addEventListener("change", (event) => {
      event.preventDefault();
      console.log("Category changed");
      this.fetchBooksData();
    });
  }

  // Load data when the page initially loads
  loadDataOnWindowLoad() {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      this.fetchBooksData();
    });
  }

  // Calculate the age of a book based on its publication year
  calculateBookAge(publishYear) {
    const currentYear = new Date().getFullYear();
    const bookPublishYear = parseInt(publishYear);
    if (isNaN(bookPublishYear)) {
      return "N/A"; // Return N/A if the publish year is not available
    }
    const age = currentYear - bookPublishYear;
    return age;
  }

  // Fetch data from the Open Library API
  async fetchBooksData() {
    try {
      this.toggleLoadingMessage(true);
      this.clearTableBody(); // Only clear table body, not the header
      const response = await fetch(
        `https://openlibrary.org/subjects/${this.categorySelect.value}.json`
      );
      const data = await response.json();
      console.log(data.works);
      this.books = data.works;
      this.populateBooksTable();
    } catch (error) {
      console.error("Error fetching books data:", error);
    } finally {
      this.toggleLoadingMessage(false);
    }
  }

  // Toggle visibility of the loading message
  toggleLoadingMessage(isLoading) {
    if (isLoading) {
      this.loadingMessage.classList.remove("hidden");
    } else {
      this.loadingMessage.classList.add("hidden");
    }
  }

  // Calculate the discount for a book based on its price
  calculateDiscount(price) {
    let discount = 0;
    if (price > 1000) {
      discount = price * 0.1;
    } else {
      discount = price * 0.05;
    }
    return Math.floor(discount);
  }

  // Clear the table body content
  clearTableBody() {
    this.tableBody.innerHTML = ""; // Clear all rows inside tbody
  }

  // Populate the table with the fetched books data
  populateBooksTable() {
    this.books.forEach((book) => {
      const row = document.createElement("tr");
      row.classList.add(this.categorySelect.value);

      // Create table cells for each book property
      const titleCell = document.createElement("td");
      const authorCell = document.createElement("td");
      const isbnCell = document.createElement("td");
      const publishYearCell = document.createElement("td");
      const genreCell = document.createElement("td");
      const editionCountCell = document.createElement("td");
      const discountCell = document.createElement("td");
      const ageCell = document.createElement("td");

      // Set the text content for each cell
      titleCell.innerText = book.title;
      authorCell.innerText =
        book.authors && book.authors[0]
          ? book.authors[0].name
          : "Unknown Author";
      isbnCell.innerText = book.cover_id || "No Cover";
      publishYearCell.innerText = book.first_publish_year || "N/A";
      genreCell.innerText = this.categorySelect.value;
      editionCountCell.innerText = book.edition_count || "N/A";
      discountCell.innerText = this.calculateDiscount(
        parseInt(book.edition_count) || 0
      );
      ageCell.innerText = this.calculateBookAge(book.first_publish_year);

      // Append the cells to the row
      row.appendChild(titleCell);
      row.appendChild(authorCell);
      row.appendChild(isbnCell);
      row.appendChild(publishYearCell);
      row.appendChild(genreCell);
      row.appendChild(editionCountCell);
      row.appendChild(discountCell);
      row.appendChild(ageCell);

      // Append the row to the table body
      this.tableBody.appendChild(row);
    });
  }
}

// Instantiate the BookCategoryManager class to start the process
const bookCategoryManager = new BookCategoryManager();
