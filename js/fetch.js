
class BookCategoryManager {
    constructor() {
        this.general = document.getElementById('categories');
        this.tableBody = document.getElementById("books").getElementsByTagName('tbody')[0];
        this.books = [];
        this.addEventListeners();
        this.onWindowLoad();
    }

    addEventListeners() {
        this.general.addEventListener('change', (e) => {
            e.preventDefault();
            console.log('Category changed');
            this.fetchData();
            this.changeCategory();
        });
    }

    onWindowLoad() {
        window.addEventListener('load', (e) => {
            e.preventDefault();
            this.fetchData();
        });
    }

    calculateAge(publishYear) {
        const currentYear = new Date().getFullYear();
        const bookYear = parseInt(publishYear);
        if (isNaN(bookYear)) {
            return 'N/A'; 
        }
        const age = currentYear - bookYear;
        return age;
    }

    async fetchData() {
        try {
            this.tableBody.innerHTML = ''; 
            const response = await fetch(`https://openlibrary.org/subjects/${this.general.value}.json`);
            const data = await response.json();
            console.log(data.works);
            this.books = data.works;
            this.populateTable();
        } catch (error) {
            console.log(error);
        }
    }

    calculateDiscount(price) {
        let discountedPrice = 0;
        let inInt = 0;
        if (price > 100) {
            discountedPrice = price * 0.1;
            inInt = parseInt(discountedPrice);
        } else {
            discountedPrice = price * 0.05;
            inInt = parseInt(discountedPrice);
        }
        return inInt;
    }

    populateTable() {
        this.books.forEach(book => {
            const newRow = document.createElement('tr');
            newRow.classList.add(this.general.value);

            const th1 = document.createElement('td');
            const th2 = document.createElement('td');
            const th3 = document.createElement('td');
            const th4 = document.createElement('td');
            const th5 = document.createElement('td');
            const th6 = document.createElement('td');
            const th7 = document.createElement('td');
            const th8 = document.createElement('td');

            th1.innerText = book.title;
            th2.innerText = book.authors && book.authors[0] ? book.authors[0].name : 'Unknown Author';
            th3.innerText = book.cover_id || 'No Cover';
            th4.innerText = book.first_publish_year || 'N/A';
            th5.innerText = this.general.value;
            th6.innerText = book.edition_count || 'N/A';
            th7.innerText = this.calculateDiscount(parseInt(book.edition_count) || 0);
            th8.innerText = this.calculateAge(book.first_publish_year);

            newRow.appendChild(th1);
            newRow.appendChild(th2);
            newRow.appendChild(th3);
            newRow.appendChild(th4);
            newRow.appendChild(th5);
            newRow.appendChild(th6);
            newRow.appendChild(th7);
            newRow.appendChild(th8);

            this.tableBody.appendChild(newRow);
        });
    }

    changeCategory() {
        const allData = Array.from(document.getElementsByTagName('tr'));
        allData.forEach(elem => {
            const classlist = elem.classList;
            if (classlist[1] !== this.general.value && classlist[1] !== undefined) {
                elem.classList.add('hidden');
            } else {
                elem.classList.remove('hidden');
            }
            if (this.general.value == "all") {
                elem.classList.remove('hidden');
            }
        });
    }
}

const bookCategoryManager = new BookCategoryManager();
