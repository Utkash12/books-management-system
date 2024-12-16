

const general = document.getElementById('categories');
const tableBody = document.getElementById("books");

const fetchData = async () => {
    try {
        tableBody.innerHTML = '';
        const response = await fetch(`https://openlibrary.org/subjects/${general.value}.json`);
        const data = await response.json();
        console.log(data.works);
        books = data.works;
        books.forEach(book => {
            const newRow = document.createElement('tr');
            newRow.classList.add(general.value);
            const th1 = document.createElement('td');
            const th2 = document.createElement('td');
            const th3 = document.createElement('td');
            const th4 = document.createElement('td');
            const th5 = document.createElement('td');
            th1.innerText = book.title;
            th2.innerText = book.authors[0].name;
            th3.innerText = book.cover_id;
            th4.innerText = book.first_publish_year;
            th5.innerText = general.value;
            newRow.appendChild(th1);
            newRow.appendChild(th2);
            newRow.appendChild(th3);
            newRow.appendChild(th4);
            newRow.appendChild(th5);
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.log(error);
    }
}
const changeCategory = () => {
    const allData = Array.from(document.getElementsByTagName('tr'));
    allData.forEach(elem => {
        const classlist = elem.classList;
        if (classlist[1] !== general.value && classlist[1] !== undefined) {
            elem.classList.add('hidden');
        } else {
            elem.classList.remove('hidden');
        }
        if (general.value == "all") {
            elem.classList.remove('hidden');
        }
    });
}
general.addEventListener('change', (e) => {
    e.preventDefault();
    console.log('Category changed');
    fetchData();
    changeCategory();
});

