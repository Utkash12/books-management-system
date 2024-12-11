

var selectedRow = null;
const formSubmitButton = document.getElementById("submitData");

formSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    var formData = readFormData();
    if (selectedRow == null) {
        const returnValue = validateForm();
        console.log(returnValue);
        if (returnValue)
            insertNewRecord(formData);
        else {
            alert("All fields must be filled out");
            return;
        };
    } else {
        updateRecord(formData);  
    }

    validateForm();
    resetForm();
});

function readFormData() {
    var formData = {};
    formData["name"] = document.getElementById("name").value;
    formData["author"] = document.getElementById("author").value;
    formData["isbn"] = document.getElementById("isbn").value;
    formData["publisher"] = document.getElementById("publisher").value;
    formData["date"] = document.getElementById("date").value;
    formData["genre"] = document.getElementById("genre").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("booklist").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    newRow.insertCell(0).innerHTML = data.name;
    newRow.insertCell(1).innerHTML = data.author;
    newRow.insertCell(2).innerHTML = data.isbn;
    newRow.insertCell(3).innerHTML = data.publisher;
    newRow.insertCell(4).innerHTML = data.date;
    newRow.insertCell(5).innerHTML = data.genre;
    newRow.insertCell(6).innerHTML = `<a href="#" onClick="onEdit(this)">Edit</a> | <a href="#" onClick="onDelete(this)">Delete</a>`;
    newRow.insertCell(7).innerHTML = ageCalculator(data.date);
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("publisher").value = "";
    document.getElementById("date").value = "";
    document.getElementById("genre").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].innerHTML;
    document.getElementById("author").value = selectedRow.cells[1].innerHTML;
    document.getElementById("isbn").value = selectedRow.cells[2].innerHTML;
    document.getElementById("publisher").value = selectedRow.cells[3].innerHTML;
    document.getElementById("date").value = selectedRow.cells[4].innerHTML;
    document.getElementById("genre").value = selectedRow.cells[5].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.name;
    selectedRow.cells[1].innerHTML = formData.author;
    selectedRow.cells[2].innerHTML = formData.isbn;
    selectedRow.cells[3].innerHTML = formData.publisher;
    selectedRow.cells[4].innerHTML = formData.date;
    selectedRow.cells[5].innerHTML = formData.genre;
    selectedRow.cells[7].innerHTML = ageCalculator(formData.date);
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("booklist").deleteRow(row.rowIndex);
        resetForm();
    }
}

function ageCalculator(date) {
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

function validateForm() {
    const name = document.getElementById("name").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;
    const publisher = document.getElementById("publisher").value;
    const date = document.getElementById("date").value;
    const genre = document.getElementById("genre").value;

    let errorMessages = [];

    if (name === "") {
        errorMessages.push("Name must be filled out.");
        return false;
    }
    if (author === "") {
        errorMessages.push("Author must be filled out.");
        return false;
    }
    if (isbn === "") {
        errorMessages.push("ISBN must be filled out.");
        return false;
    } else if (isNaN(isbn)) {
        errorMessages.push("ISBN should be a valid number and between 10-13 digits.");
        alert("ISBN should be a valid number");
        return false;
    }
    if (publisher === "") {
        errorMessages.push("Publisher must be filled out.");
        return false;
    }
    if (date === "") {
        errorMessages.push("Date must be filled out.");
        return false;
    }
    if (genre === "") {
        errorMessages.push("Genre must be selected.");
        return false;
    }

    if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
        return false; 
    }
    return true;
}
