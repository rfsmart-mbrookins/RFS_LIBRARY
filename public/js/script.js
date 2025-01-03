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

// Reusable table population function
const populateTable = (tableId, data, columns, noDataMessage) => {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = data.length
        ? data.map(item => `
            <tr>
                ${columns.map(col => `<td>${col(item)}</td>`).join('')}
            </tr>`).join('')
        : `<tr><td colspan="${columns.length}">${noDataMessage}</td></tr>`;
};

// Table-specific population functions
const populateEmployeeTable = (employees) => {
    populateTable('employeeData', employees, [
        emp => emp.id,
        emp => emp.first_name,
        emp => emp.last_name,
        emp => emp.email,
        emp => emp.job_title,
        emp => emp.department,
        emp => formatDate(emp.hire_date),
        emp => emp.age,
        emp => emp.is_reader ? 'Yes' : 'No',
        emp => emp.is_donor ? 'Yes' : 'No',
        emp => [emp.pet_type_1, emp.pet_name_1].filter(Boolean).join(' - '),
        emp => [emp.pet_type_2, emp.pet_name_2].filter(Boolean).join(' - '),
        emp => emp.fav_color ?? '',
        emp => emp.fav_music ?? '',
        emp => emp.less_fav_music ?? ''
    ], 'No employees found based on your search criteria.');
};

const populateBooksTable = (books) => {
    populateTable('booksData', books, [
        book => book.id,
        book => book.title,
        book => book.author,
        book => book.genre,
        book => book.status,
        book => book.notes
    ], 'No books found based on your search criteria.');
};

const populateCommentsTable = (comments) => {
    populateTable('commentsData', comments, [
        comment => comment.book_title,
        comment => comment.book_author,
        comment => comment.reviewed_by,
        comment => comment.content,
        comment => formatDate(comment.created_at)
    ], 'No comments found based on your search criteria.');
};

const populateCheckoutsTable = (checkouts) => {
    populateTable('checkoutsData', checkouts, [
        checkout => checkout.book_title,
        checkout => checkout.reader,
        checkout => formatDate(checkout.checkout_date),
        checkout => formatDate(checkout.due_date)
    ], 'No checkouts found based on your search criteria.');
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

// Setup event listeners
setupSearchForm('employeeSearchForm', '/api/employees/search', populateEmployeeTable);
setupShowAllButton('showAllEmployeesButton', '/api/employees', populateEmployeeTable);

setupSearchForm('bookSearchForm', '/api/books/search', populateBooksTable);
setupShowAllButton('showAllBooksButton', '/api/books', populateBooksTable);

setupSearchForm('commentSearchForm', '/api/comments/search', populateCommentsTable);
setupShowAllButton('showAllCommentsButton', '/api/comments', populateCommentsTable);

setupSearchForm('checkoutSearchForm', '/api/checkouts/search', populateCheckoutsTable);
setupShowAllButton('showAllCheckouts', '/api/checkouts', populateCheckoutsTable);
