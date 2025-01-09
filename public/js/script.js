// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
};

const setLoadingState = (isLoading) => {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = isLoading ? '<p>Loading...</p>' : '';
};

const fetchData = async (url, params = '') => {
    try {
        setLoadingState(true);
        const response = await fetch(`${url}${params}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        document.getElementById('results').innerHTML = '<p>Error occurred. Please retry.</p>';
        throw error;
    } finally {
        setLoadingState(false);
    }
};

// Table-specific population functions
const createColumnFunctions = (columns) => columns.map(col => item => col(item));

const populateTable = (tableId, data, columns, noDataMessage) => {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = data.length
        ? data.map(item => `
            <tr>
                ${columns.map(col => `<td>${col(item)}</td>`).join('')}
            </tr>`).join('')
        : `<tr><td colspan="${columns.length}">${noDataMessage}</td></tr>`;
};

// Table population functions
const populateEmployeeTable = (employees) => {
    const columns = createColumnFunctions([
        emp => emp.id,
        emp => emp.first_name,
        emp => emp.last_name,
        emp => emp.email,
        emp => emp.job_title,
        emp => emp.department,
        emp => formatDate(emp.hire_date),
        emp => emp.age,
        emp => emp.is_rf_smart_employee ? 'Active' : 'Inactive',
        emp => emp.is_reader ? 'Yes' : 'No',
        emp => emp.is_donor ? 'Yes' : 'No',
        emp => [emp.pet_type_1, emp.pet_name_1].filter(Boolean).join(' - '),
        emp => [emp.pet_type_2, emp.pet_name_2].filter(Boolean).join(' - '),
        emp => emp.fav_color ?? '',
        emp => emp.fav_music ?? '',
        emp => emp.less_fav_music ?? ''
    ]);
    populateTable('employeeData', employees, columns, 'No employees found based on your search criteria.');
};

// Show/hide Add Reader/Donor form
const showAddEmployeeForm = () => {
    document.getElementById('add-employee-section').style.display = 'block';
};

const hideAddEmployeeForm = () => {
    document.getElementById('add-employee-section').style.display = 'none';
};

// Handle Add Reader/Donor form submission
const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();

    const newEmployee = {
        first_name: document.getElementById('employeeFirstName').value,
        last_name: document.getElementById('employeeLastName').value,
        email: document.getElementById('employeeEmail').value,
        job_title: document.getElementById('employeeJobTitle').value,
        department: document.getElementById('employeeDepartment').value,
        hire_date: document.getElementById('hireDate').value,
        age: document.getElementById('age').value,
        is_rf_smart_employee: document.getElementById('employeeRFSmartStatus').value === 'true',
        is_reader: document.getElementById('employeeIsReader').value === 'true',
        is_donor: document.getElementById('employeeIsDonor').value === 'true',
        pet_type_1: document.getElementById('employeePetType1').value,
        pet_name_1: document.getElementById('employeePetName1').value,
        pet_type_2: document.getElementById('employeePetType2').value,
        pet_name_2: document.getElementById('employeePetName2').value,
        fav_color: document.getElementById('employeeFavColor').value,
        fav_music: document.getElementById('employeeFavMusic').value,
        less_fav_music: document.getElementById('employeeLessFavMusic').value,
    };

    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });

        if (response.ok) {
            alert('Reader/Donor added successfully!');
            hideAddEmployeeForm();
            const addedEmployee = await response.json();
            populateEmployeeTable([addedEmployee]);
        } else {
            alert('Failed to add Reader/Donor.');
        }
    } catch (error) {
        console.error('Error adding Reader/Donor:', error);
        alert('An error occurred while adding the Reader/Donor.');
    }
};

// Function to handle check-out/return button clicks
const handleBookStatusChange = async (bookId, currentStatus) => {
    try {
        const newStatus = currentStatus === 'Available' ? 'Checked Out' : 'Available';

        const response = await fetch(`/api/books/${bookId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update book status');
        }

        const updatedBook = await response.json();

        // Update the row and the button label in the UI
        updateBookRow(updatedBook);

        // Display success message
        const results = document.getElementById('results');
        results.innerHTML = `<p class="success">Book status updated to "${newStatus}"</p>`;
        setTimeout(() => {
            results.innerHTML = '';
        }, 3000);
    } catch (error) {
        console.error('Error updating book status:', error);
        document.getElementById('results').innerHTML = `<p class="error">${error.message}</p>`;
    }
};

// Update a single book row in the table
const updateBookRow = (book) => {
    const tableRows = document.querySelectorAll('#booksData tr');
    tableRows.forEach((row) => {
        const bookIdCell = row.querySelector('td:first-child');
        if (bookIdCell && bookIdCell.textContent == book.id) {
            // Update the status cell
            row.querySelector('td:nth-child(5)').textContent = book.status;

            // Update the button text and data-status attribute
            const button = row.querySelector('button');
            button.textContent = book.status === 'Available' ? 'Check Out' : 'Return';
            button.dataset.status = book.status;
        }
    });
};

// Modify the populateBooksTable to include the button
const populateBooksTable = (books) => {
    const columns = createColumnFunctions([
        (book) => book.id,
        (book) => book.title,
        (book) => book.author,
        (book) => book.genre,
        (book) => book.status,
        (book) => book.notes ?? '',
        (book) =>
            `<button data-book-id="${book.id}" data-status="${book.status}">
                ${book.status === 'Available' ? 'Check Out' : 'Return'}
            </button>`, // Add Check Out/Return button
    ]);
    populateTable('booksData', books, columns, 'No books found based on your search criteria.');
};

// Listener for dynamically created buttons in the books table
document.getElementById('booksData').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const bookId = e.target.dataset.bookId;
        const currentStatus = e.target.dataset.status;
        handleBookStatusChange(bookId, currentStatus);
    }
});

const populateCommentsTable = (comments) => {
    const columns = createColumnFunctions([
        comment => comment.book_title,
        comment => comment.book_author,
        comment => comment.reviewed_by,
        comment => comment.content,
        comment => formatDate(comment.created_at)
    ]);
    populateTable('commentsData', comments, columns, 'No comments found based on your search criteria.');
};

const populateCheckoutsTable = (checkouts) => {
    const columns = createColumnFunctions([
        checkout => checkout.book_title,
        checkout => checkout.reader,
        checkout => formatDate(checkout.checkout_date),
        checkout => formatDate(checkout.due_date)
    ]);
    populateTable('checkoutsData', checkouts, columns, 'No checkouts found based on your search criteria.');
};

// Reusable search form handler
const setupSearchForm = (formId, apiUrl, populateFn) => {
    document.getElementById(formId).addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchBy = document.querySelector(`#${formId} select`).value;
        const searchValue = document.querySelector(`#${formId} input`).value.trim();

        if (!searchValue) {
            alert('Please enter a value to search.');
            return;
        }

        const data = await fetchData(apiUrl, `?${searchBy}=${searchValue}`);
        populateFn(data);
    });
};

// Reusable show-all button handler
const setupShowAllButton = (buttonId, apiUrl, populateFn) => {
    document.getElementById(buttonId).addEventListener('click', async () => {
        const data = await fetchData(apiUrl);
        populateFn(data);
    });
};

// Add Book Form Handling
const showAddBookForm = () => {
    document.getElementById('add-book-section').style.display = 'block';
};

const hideAddBookForm = () => {
    document.getElementById('add-book-section').style.display = 'none';
};

const handleAddBookSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;
    const status = document.getElementById('bookStatus').value;
    const notes = document.getElementById('bookNotes').value;

    const newBook = {
        title,
        author,
        genre,
        status,
        notes: notes.trim() || null  // Optional notes
    };

    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            alert('Book added successfully!');
            hideAddBookForm();
            const newBookData = await response.json();
            populateBooksTable([newBookData]); // Add the new book to the table
        } else {
            alert('Failed to add book.');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('An error occurred while adding the book.');
    }
};

//add employee listener
const setupAddEmployeeEventListeners = () => {
    document.getElementById('addReaderDonor').addEventListener('click', showAddEmployeeForm);
    document.getElementById('cancelAddEmployee').addEventListener('click', hideAddEmployeeForm);
    document.getElementById('addEmployeeForm').addEventListener('submit', handleAddEmployeeSubmit);
};

// Setup event listeners for adding book
const setupAddBookEventListeners = () => {
    document.getElementById('addBook').addEventListener('click', showAddBookForm);
    document.getElementById('cancelAddBook').addEventListener('click', hideAddBookForm);
    document.getElementById('addBookForm').addEventListener('submit', handleAddBookSubmit);
};

// Initialize the setup
const setupEventListeners = () => {
    setupSearchForm('employeeSearchForm', '/api/employees/search', populateEmployeeTable);
    setupShowAllButton('showAllEmployeesButton', '/api/employees', populateEmployeeTable);
    setupAddEmployeeEventListeners();

    setupSearchForm('bookSearchForm', '/api/books/search', populateBooksTable);
    setupShowAllButton('showAllBooksButton', '/api/books', populateBooksTable);

    setupSearchForm('commentSearchForm', '/api/comments/search', populateCommentsTable);
    setupShowAllButton('showAllCommentsButton', '/api/comments', populateCommentsTable);

    setupSearchForm('checkoutSearchForm', '/api/checkouts/search', populateCheckoutsTable);
    setupShowAllButton('showAllCheckouts', '/api/checkouts', populateCheckoutsTable);

    setupAddBookEventListeners(); // Add event listeners for the Add Book functionality
};

// Initialize all event listeners
setupEventListeners();
