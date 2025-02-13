import { test, expect, Page, Locator } from '@playwright/test';
import { BookPage } from './pages/book-page';
import { EmployeePage } from './pages/employee-page';

test.describe('Negative Tests', () => {
    let bookPage: BookPage;
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        bookPage = new BookPage(page);
        employeePage = new EmployeePage(page);
        await bookPage.goto();
        await employeePage.goto();
    });

    // Validate required input fields
    async function validateRequiredField(inputLocator: Locator) {
        await expect(inputLocator).toHaveAttribute('required', '');

        const inputElement = await inputLocator.elementHandle();
        const isInvalid = await inputElement?.evaluate(input => input.matches(':invalid'));
        expect(isInvalid).toBe(true);

        const tooltipMessage = await inputElement?.evaluate(el => (el as HTMLInputElement).validationMessage);
        expect(tooltipMessage).toContain('Please fill out this field');
    }

    // Neg 1: Missing Title Required Error Validation
    test('Missing Title Required Error Validation', async () => {
        const newBook = {
            title: '', 
            author: 'The Author',
            genre: 'Fiction',
            status: 'Available',
            notes: 'Missing Title'
        };

        await bookPage.openAddBookForm();
        await bookPage.fillBookForm(newBook);
        await bookPage.submitBookForm();
        await validateRequiredField(bookPage.titleInput);
    });

    // Neg 2: Missing Author Required Error Validation
    test('Missing Author Required Error Validation', async () => {
        const newBook = {
            title: 'The Book formally known as a Manuscript',
            author: '', 
            genre: 'Technology',
            status: 'Available',
            notes: 'Missing Author'
        };

        await bookPage.openAddBookForm();
        await bookPage.fillBookForm(newBook);
        await bookPage.submitBookForm();
        await validateRequiredField(bookPage.authorInput);
    });

    //Neg 3: Missing First Name Require Validation
    test('Missing First Name Required Error Validation', async () => {
        const newEmployee = {
            firstName: '',  
            lastName: 'Bourne',
            email: 'jason.bourne@rfsmart.com',
            jobTitle: 'Engineer',
            department: 'IT'
        };

        await employeePage.openAddEmployeeForm();
        await employeePage.fillEmployeeForm(newEmployee);
        await employeePage.submitEmployeeForm();
        await validateRequiredField(employeePage.firstNameInput);
    });

      //Neg 4: Missing Last Name Require Validation
      test('Missing Last Name Required Error Validation', async () => {
        const newEmployee = {
            firstName: 'Moe',
            lastName: '',
            email: 'moe.doe@rfsmart.com',
            jobTitle: 'Manager',
            department: 'IT'
        };

        await employeePage.openAddEmployeeForm();
        await employeePage.fillEmployeeForm(newEmployee);
        await employeePage.submitEmployeeForm();
        await validateRequiredField(employeePage.lastNameInput);
    });
});
