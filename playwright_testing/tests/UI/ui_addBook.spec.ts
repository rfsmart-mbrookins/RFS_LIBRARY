import { test, expect } from '@playwright/test';
import { BookPage } from './pages/book-page';

test.describe('Add Book Functionality', () => {
    let bookPage: BookPage;

    test.beforeEach(async ({ page }) => {
        bookPage = new BookPage(page);
        await bookPage.goto();
    });

    //Add a new book
    test('Add a new book', async () => {
        const newBook = {
            title: 'Dad Jokes for The Office',
            author: 'The Writer Formally Known as Author',
            genre: 'Comedy',
            status: 'Available',
            notes: 'HR Approved'
        };

        await bookPage.addBook(newBook);
        await bookPage.verifyBookInTable(newBook);
    });

    //Click cancel button
    test('Cancel adding book', async () => {
        await bookPage.openAddBookForm();
        await bookPage.cancelAddBook();
    });

    // Validate required fields
    test('Validate required fields', async () => {
        await bookPage.openAddBookForm();
        await bookPage.submitBookForm();
        await bookPage.verifyRequiredFields();
        await expect(bookPage.addBookSection).toBeVisible();
    });
    
});