// Date formatter: mm/dd/yyyy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Handle invalid date
    if (isNaN(date.getTime())) return ''; // Return empty if invalid date

    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
};

// Employee table populator
const populateEmployeeTable = (employees) => {
    const tableBody = document.getElementById('employeeData');
    tableBody.innerHTML = '';

    if (!employees.length) {
        tableBody.innerHTML = '<tr><td colspan="14">No employees found based on your search criteria.</td></tr>';
        return;
    }

    employees.forEach(emp => {
        const pet1 = [emp.pet_type_1, emp.pet_name_1].filter(Boolean).join(' - ');
        const pet2 = [emp.pet_type_2, emp.pet_name_2].filter(Boolean).join(' - ');

        tableBody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.first_name}</td>
                <td>${emp.last_name}</td>
                <td>${emp.email}</td>
                <td>${emp.job_title}</td>
                <td>${emp.department}</td>
                <td>${formatDate(emp.hire_date)}</td>
                <td>${emp.age}</td>
                <td>${emp.is_reader ? 'Yes' : 'No'}</td>
                <td>${emp.is_donor ? 'Yes' : 'No'}</td>
                <td>${pet1}</td>
                <td>${pet2}</td>
                <td>${emp.fav_color ?? ''}</td>
                <td>${emp.fav_music ?? ''}</td>
                <td>${emp.less_fav_music ?? ''}</td>
            </tr>`;
    });
};

// Books table populator
const populateBooksTable = (books) => {
    const tableBody = document.getElementById('booksData');
    tableBody.innerHTML = books.length ?
        books.map(book => `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.status}</td>
                <td>${book.notes}</td>
            </tr>`).join('') :
        '<tr><td colspan="6">No results found.</td></tr>';
};

// Comments table populator
const populateCommentsTable = (comments) => {
    const tableBody = document.getElementById('commentsData');
    tableBody.innerHTML = comments.length ?
        comments.map(comment => `
            <tr>
                <td>${comment.book_title}</td> 
                <td>${comment.book_author}</td> 
                <td>${comment.reviewed_by}</td>
                <td>${comment.content}</td>
                <td>${formatDate(comment.created_at)}</td>
            </tr>`).join('') :
        '<tr><td colspan="5">No results found.</td></tr>';
};

// API handlers
const fetchData = async (url, params = '') => {
    try {
        setLoadingState(true);  // Show loading
        const response = await fetch(`${url}${params}`);
        const data = await response.json();
        setLoadingState(false);  // Hide loading
        return data;
    } catch (error) {
        console.error('API Error:', error);
        setLoadingState(false);  // Hide loading
        document.getElementById('results').innerHTML = '<p>Error occurred. Please retry.</p>';
        throw error;
    }
};

// Loading state function
const setLoadingState = (isLoading) => {
    const resultsElement = document.getElementById('results');
    if (isLoading) {
        resultsElement.innerHTML = '<p>Loading...</p>';
    } else {
        resultsElement.innerHTML = '';
    }
};

// Event listeners
document.getElementById('employeeSearchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchBy = document.getElementById('searchBy').value;
    const searchValue = document.getElementById('searchValue').value.trim();

    // Validation check
    if (!searchValue) {
        alert('Please enter a value to search.');
        return;
    }

    const data = await fetchData('/api/employees/search', `?${searchBy}=${searchValue}`);
    populateEmployeeTable(data);
});

document.getElementById('showAllEmployeesButton').addEventListener('click', async () => {
    const data = await fetchData('/api/employees');
    populateEmployeeTable(data);
});

document.getElementById('bookSearchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchBy = document.getElementById('searchByBooks').value;
    const searchValue = document.getElementById('searchValueBooks').value.trim();
    const data = await fetchData('/api/books/search', `?${searchBy}=${searchValue}`);
    populateBooksTable(data);
});

document.getElementById('showAllBooksButton').addEventListener('click', async () => {
    const data = await fetchData('/api/books');
    populateBooksTable(data);
});

// Comments event listeners
document.getElementById('commentSearchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchBy = document.getElementById('searchByComments').value;
    const searchValue = document.getElementById('searchValueComments').value.trim();
    const data = await fetchData('/api/comments/search', `?${searchBy}=${searchValue}`);
    console.log('Comment Data:', data);  // Log data to verify structure
    populateCommentsTable(data);
});

document.getElementById('showAllCommentsButton').addEventListener('click', async () => {
    const data = await fetchData('/api/comments');
    console.log('All Comments Data:', data);  // Log data to verify structure
    populateCommentsTable(data);
});