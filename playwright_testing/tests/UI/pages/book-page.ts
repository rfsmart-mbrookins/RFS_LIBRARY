import { Page, Locator, expect } from '@playwright/test';

export class BookPage {
    readonly page: Page;
    readonly addBookButton: Locator;
    readonly addBookSection: Locator;
    readonly titleInput: Locator;
    readonly authorInput: Locator;
    readonly genreInput: Locator;
    readonly statusSelect: Locator;
    readonly notesInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly booksTable: Locator;
    readonly baseURL: string;

    constructor(page: Page) {
        this.page = page;
        this.baseURL = 'http://localhost:8000';
        this.addBookButton = page.locator('#addBook');
        this.addBookSection = page.locator('#add-book-section');
        this.titleInput = page.locator('#bookTitle');
        this.authorInput = page.locator('#bookAuthor');
        this.genreInput = page.locator('#bookGenre');
        this.statusSelect = page.locator('#bookStatus');
        this.notesInput = page.locator('#bookNotes');
        this.submitButton = page.locator('#addBookForm button[type="submit"]');
        this.cancelButton = page.locator('#cancelAddBook');
        this.booksTable = page.locator('#booksData');
    }

    async goto() {
        try {
            await this.page.goto(this.baseURL, {
                waitUntil: 'networkidle',
                timeout: 15000
            });
        } catch (error) {
            throw new Error(`Failed to load page at ${this.baseURL}. Make sure your application server is running. Error: ${error.message}`);
        }
    }

    async openAddBookForm() {
        await this.addBookButton.waitFor({ state: 'visible' });
        await this.addBookButton.click();
        await expect(this.addBookSection).toBeVisible();
    }

    async cancelAddBook() {
        await this.cancelButton.click();
        await expect(this.addBookSection).toBeHidden();
    }

    async fillBookForm(bookData: {
        title: string;
        author: string;
        genre: string;
        status: string;
        notes?: string;
    }) {
        await this.titleInput.fill(bookData.title);
        await this.authorInput.fill(bookData.author);
        await this.genreInput.fill(bookData.genre);
        await this.statusSelect.selectOption(bookData.status);  // Changed to selectOption
        if (bookData.notes) {
            await this.notesInput.fill(bookData.notes);
        }
    }

    async submitBookForm() {
        await this.submitButton.click();
    }

    async addBook(bookData: {
        title: string;
        author: string;
        genre: string;
        status: string;
        notes?: string;
    }) {
        await this.openAddBookForm();
        await this.fillBookForm(bookData);
        await this.submitBookForm();

        try {
            // Wait for and handle the success alert
            const alertMessage = await this.page.waitForEvent('dialog', { timeout: 5000 });
            await expect(alertMessage.message()).toBe('Book added successfully!');
            await alertMessage.accept();

            // Verify form is hidden after submission
            await expect(this.addBookSection).toBeHidden();
        } catch (error) {
            throw new Error(`Failed to add book: ${error.message}`);
        }
    }

    async verifyBookInTable(bookData: {
        title: string;
        author: string;
        genre: string;
        status: string;
        notes?: string;
    }) {
        try {
            const bookRow = this.booksTable.locator(`tr:has-text("${bookData.title}")`);
            await expect(bookRow.locator(`td:has-text("${bookData.author}")`)).toBeVisible();
            await expect(bookRow.locator(`td:has-text("${bookData.genre}")`)).toBeVisible();
            await expect(bookRow.locator(`td:has-text("${bookData.status}")`)).toBeVisible();
            if (bookData.notes) {
                await expect(bookRow.locator(`td:has-text("${bookData.notes}")`)).toBeVisible();
            }
        } catch (error) {
            throw new Error(`Failed to verify book in table: ${error.message}`);
        }
    }

    async verifyRequiredFields() {
        await expect(this.titleInput).toHaveAttribute('required', '');
        await expect(this.authorInput).toHaveAttribute('required', '');
        await expect(this.genreInput).toHaveAttribute('required', '');
    }
}