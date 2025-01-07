interface IBook {
  title: string;
  authors: { name: string }[] | null;
  cover_id: string | null;
  first_publish_year: number | null;
  edition_count: number | null;
}

// Define a generic type for the BookManager class
interface IBookManager<T> {
  categorySelect: HTMLSelectElement;
  tableBody: HTMLTableSectionElement;
  books: T[];
  loadingMessage: HTMLElement;
  fetchBooksData(): Promise<void>;
  populateBooksTable(): void;
  filterBooksByCategory(): void;
  toggleLoadingMessage(isLoading: boolean): void;
}

class BookCategoryManager implements IBookManager<IBook> {
  public categorySelect: HTMLSelectElement;
  public tableBody: HTMLTableSectionElement;
  public books: IBook[] = [];
  public loadingMessage: HTMLElement;

  constructor() {
    // Initialize UI elements and properties
    this.categorySelect = document.getElementById(
      "categories"
    ) as HTMLSelectElement;
    this.tableBody = document
      .getElementById("books")!
      .getElementsByTagName("tbody")[0] as HTMLTableSectionElement;
    this.loadingMessage = document.getElementById("loadingMessage")!;

    // Set up event listeners
    this.addEventListeners();

    // Fetch data when the page is loaded
    this.loadDataOnWindowLoad();
  }

  // Adds event listeners for category change and page load
  private addEventListeners(): void {
    this.categorySelect.addEventListener("change", (event) => {
      event.preventDefault();
      console.log("Category changed");
      this.fetchBooksData();
      this.filterBooksByCategory();
    });
  }

  // Load data when the page initially loads
  private loadDataOnWindowLoad(): void {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      this.fetchBooksData();
    });
  }

  // Calculate the age of a book based on its publication year
  private calculateBookAge(publishYear: number | null): string {
    if (publishYear === null) {
      return "N/A"; // Return N/A if the publish year is not available
    }
    const currentYear = new Date().getFullYear();
    const age = currentYear - publishYear;
    return age.toString();
  }

  // Fetch data from the Open Library API
  public async fetchBooksData(): Promise<void> {
    try {
      this.toggleLoadingMessage(true);
      this.tableBody.innerHTML = ""; // Clear the table
      const response = await fetch(
        `https://openlibrary.org/subjects/${this.categorySelect.value}.json`
      );
      const data = await response.json();
      this.books = data.works; // Store fetched books in the generic books array
      this.populateBooksTable();
    } catch (error) {
      console.error("Error fetching books data:", error);
    } finally {
      this.toggleLoadingMessage(false);
    }
  }

  // Toggle visibility of the loading message
  public toggleLoadingMessage(isLoading: boolean): void {
    if (isLoading) {
      this.loadingMessage.classList.remove("hidden");
    } else {
      this.loadingMessage.classList.add("hidden");
    }
  }

  // Calculate the discount for a book based on its price
  private calculateDiscount(price: number): number {
    let discount = 0;
    if (price > 1000) {
      discount = price * 0.1;
    } else {
      discount = price * 0.05;
    }
    return Math.floor(discount);
  }

  // Populate the table with the fetched books data
  public populateBooksTable(): void {
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
      publishYearCell.innerText = book.first_publish_year
        ? book.first_publish_year.toString()
        : "N/A";
      genreCell.innerText = this.categorySelect.value;
      editionCountCell.innerText = book.edition_count
        ? book.edition_count.toString()
        : "N/A";
      discountCell.innerText = this.calculateDiscount(
        book.edition_count || 0
      ).toString();
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

  // Filter books based on the selected category
  public filterBooksByCategory(): void {
    const rows = Array.from(this.tableBody.getElementsByTagName("tr"));

    rows.forEach((row) => {
      const rowCategory = row.classList[1]; // Get the category from the row's class
      const shouldShow =
        rowCategory === this.categorySelect.value ||
        this.categorySelect.value === "all";

      if (shouldShow) {
        row.classList.remove("hidden");
      } else {
        row.classList.add("hidden");
      }
    });
  }
}

// Instantiate the BookCategoryManager class to start the process
const bookCategoryManager = new BookCategoryManager();
