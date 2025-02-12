import { test, expect } from '@playwright/test';
import { BookPage } from './pages/book-page';

test.describe('Negative Add Book Tests', () => {
    let bookPage: BookPage;

    test.beforeEach(async ({ page }) => {
        bookPage = new BookPage(page);
        await bookPage.goto();
    });

    // Negative Test: Missing Title
    test('should show an error when title is missing', async () => {
        const newBook = {
            title: '', // Missing title
            author: 'The Author',
            genre: 'Fiction',
            status: 'Available',
            notes: 'Test book notes v2'
        };

        await bookPage.openAddBookForm();
        await bookPage.fillBookForm(newBook);
        await bookPage.submitBookForm();

        // Wait for the error message to appear
        const titleErrorMessage = await bookPage.page.locator('#bookTitle').locator('..').locator('.field-error');  // Adjust the selector if needed
        await bookPage.page.waitForSelector('.field-error', { state: 'visible', timeout: 7000 }); // Wait for any error message to be visible
        await expect(titleErrorMessage).toBeVisible();
        await expect(titleErrorMessage).toContainText('Please fill out this field');
    });

    // Negative Test: Missing Author
    test('should show an error when author is missing', async () => {
        const newBook = {
            title: 'The Test Book v2',
            author: '', // Missing author
            genre: 'Fiction',
            status: 'Available',
            notes: 'Test book notes v2'
        };

        await bookPage.openAddBookForm();
        await bookPage.fillBookForm(newBook);
        await bookPage.submitBookForm();

        // Wait for the error message to appear
        const authorErrorMessage = await bookPage.page.locator('#bookAuthor').locator('..').locator('.field-error'); // Adjust the selector if needed
        await bookPage.page.waitForSelector('.field-error', { state: 'visible', timeout: 7000 }); // Wait for any error message to be visible
        await expect(authorErrorMessage).toBeVisible();
        await expect(authorErrorMessage).toContainText('Please fill out this field');
    });

    // Negative Test: Missing Genre
    test('should show an error when genre is missing', async () => {
        const newBook = {
            title: 'The Test Book v2',
            author: 'The Author',
            genre: '', // Missing genre
            status: 'Available',
            notes: 'Test book notes v2'
        };

        await bookPage.openAddBookForm();
        await bookPage.fillBookForm(newBook);
        await bookPage.submitBookForm();

        // Wait for the error message to appear
        const genreErrorMessage = await bookPage.page.locator('#bookGenre').locator('..').locator('.field-error'); // Adjust the selector if needed
        await bookPage.page.waitForSelector('.field-error', { state: 'visible', timeout: 7000 }); // Wait for any error message to be visible
        await expect(genreErrorMessage).toBeVisible();
        await expect(genreErrorMessage).toContainText('Please fill out this field');
    });
});
