RF-SMART Library Conference Room Book Management System
Scope
This application is designed to manage RF-SMART’s "Library" conference room books. It focuses on technical implementation while addressing user needs based on provided user stories and personas.

Key Features & User Stories
1. View Available Books
User Story: Employees can check which books are available for checkout.
Implementation: Display a list of books with title, author, availability, and check-out status.
UI Component: A table or list view showing all available books.
2. View & Leave Comments on Books
User Story: Employees can read and leave comments on books.
Implementation: A comment section for each book where users can add and view comments.
UI Component: A book detail page displaying comments and an input field for new ones.
3. Check Out & Check In Books
User Story: Employees can borrow and return books.
Implementation: Mark books as unavailable when checked out and update when returned.
UI Component: Buttons for checking out and checking in books, possibly with a due date.
4. Delete Books
User Story: Books can be deleted if lost, damaged, or taken permanently.
Implementation: Remove books from the database when deleted.
UI Component: A "Delete" button for book records.
5. Donate Books
User Story: Donors can contribute books to the library.
Implementation: Allow users to submit book details (title, author, description).
UI Component: A form for adding new books.
Application Design
Database Schema
We use MySQL or PostgreSQL with the following schema:

Books Table
Column	Type	Description
book_id	Primary Key	Unique ID for the book
title	String	Book title
author	String	Author of the book
status	Enum	Available, Checked Out
donor_id	Foreign Key	References Donors table
check_out_date	Date	When the book was checked out
due_date	Date	When the book is due
return_date	Date	When the book was returned
Comments Table
Column	Type	Description
comment_id	Primary Key	Unique comment ID
book_id	Foreign Key	References Books table
user_id	Foreign Key	References Users table
comment_text	String	User comment
date_posted	Date	When the comment was posted
Users Table
Column	Type	Description
user_id	Primary Key	Unique user ID
name	String	User's name
email	String	Email address
role	Enum	Employee, Reader, Donor
Donors Table
Column	Type	Description
donor_id	Primary Key	Unique donor ID
user_id	Foreign Key	References Users table
donated_books	Array	List of book IDs
Checkouts Table
Column	Type	Description
checkout_id	Primary Key	Unique checkout ID
book_id	Foreign Key	References Books table
user_id	Foreign Key	References Users table
check_out_date	Date	When the book was checked out
due_date	Date	Due date for return
return_date	Date	When the book was returned
REST API Endpoints
Books
GET /books → Retrieve all available books.
GET /books/{book_id} → Get details of a specific book (including comments).
POST /books → Add a new book (for donors).
DELETE /books/{book_id} → Delete a book (mark as lost/destroyed).
Checkouts
POST /checkout/{book_id} → Check out a book.
POST /checkin/{book_id} → Check in a book.
Comments
POST /comments/{book_id} → Leave a comment on a book.
GET /comments/{book_id} → Retrieve all comments for a book.
Web Application
Front-end
Uses HTML, CSS, JavaScript with a Node.js backend.
Provides UI components for:
Viewing books
Checking out/in books
Leaving and reading comments
Donating books
Back-end (Node.js/Express)
Implements API routes and controllers for managing books, comments, and checkouts.
Uses MySQL/PostgreSQL for database interactions via Sequelize ORM or raw SQL queries.
Database Interaction
ORM (Sequelize or TypeORM) to manage CRUD operations.
Authentication & Authorization
RF-SMART Employees: Can donate books and mark them as lost.
Readers: Can check out/return books and leave comments.
Donors: Can add new books.
Testing with Playwright
UI Tests
✔ Verify book listing page displays correctly.
✔ Test book checkout and check-in workflow.
✔ Ensure comments are correctly added and displayed.

API Tests
✔ CRUD operations for books (create, read, update, delete).
✔ Adding, retrieving, and deleting comments.

Negative Tests
✔ Attempting to check out an already checked-out book.
✔ Deleting a book that does not exist.
✔ Donating a book without required details.

Tech Stack
Backend
Node.js + Express
Sequelize ORM
MySQL/PostgreSQL
Frontend
HTML, CSS, JavaScript
Node.js serving static content
Testing
Playwright + TypeScript for end-to-end testing
Containers (Optional)
Podman/Docker for containerizing the application and database
Summary
This application enables users to manage books, comments, check-outs, donations, and lost items in RF-SMART’s library system. With clear roles and permissions, users can easily perform their tasks while ensuring a smooth and organized experience.

