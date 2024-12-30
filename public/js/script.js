// Helper function to format date as mm/dd/yyyy
function formatDate(dateString) {
    if (!dateString) return ''; // Return empty if no date provided

    const date = new Date(dateString);

    // Extract month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Return the formatted date as mm/dd/yyyy
    return `${month}/${day}/${year}`;
}

// Function to populate the employee table
function populateTable(employees) {
    const tableBody = document.getElementById('employeeData');
    tableBody.innerHTML = ''; // Clear previous results

    if (employees.length > 0) {
        employees.forEach(employee => {
            const row = document.createElement('tr');

            // Separate pet type and pet name with " - "
            const pet1 = employee.pet_type_1 && employee.pet_name_1 ? `${employee.pet_type_1} - ${employee.pet_name_1}` : '';
            const pet2 = employee.pet_type_2 && employee.pet_name_2 ? `${employee.pet_type_2} - ${employee.pet_name_2}` : '';

            // Determine reader and donor status (Yes or No)
            const isReader = employee.is_reader === 1 ? "Yes" : "No";
            const isDonor = employee.is_donor === 1 ? "Yes" : "No";

            // Format the hire date as mm/dd/yyyy
            const formattedHireDate = formatDate(employee.hire_date);

            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.first_name}</td>
                <td>${employee.last_name}</td>
                <td>${employee.email}</td>
                <td>${employee.job_title}</td>
                <td>${employee.department}</td>
                <td>${formattedHireDate}</td>
                <td>${employee.age}</td>
                <td>${isReader}</td>
                <td>${isDonor}</td>
                <td>${pet1}</td>
                <td>${pet2}</td>
                <td>${employee.fav_color ?? ''}</td>
                <td>${employee.fav_music ?? ''}</td>
                <td>${employee.less_fav_music ?? ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="13">No results found.</td>`;  // Ensure correct colspan
        tableBody.appendChild(row);
    }
}

// Search form submission
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const searchBy = document.getElementById('searchBy').value;
    const searchValue = document.getElementById('searchValue').value;

    // Send the search data to the server
    fetch(`/api/employees/search?${searchBy}=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            populateTable(data); // Populate the table with search results
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('results').innerHTML = '<p>An error occurred. Please try again.</p>';
        });
});

// Show all employees when the "Show All Employees" button is clicked
document.getElementById('showAllEmployeesButton').addEventListener('click', function () {
    fetch('/api/employees')  // Assuming this endpoint returns all employees
        .then(response => response.json())
        .then(data => {
            populateTable(data); // Populate the table with all employees
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('results').innerHTML = '<p>An error occurred. Please try again.</p>';
        });
});
