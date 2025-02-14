# 📚 RF-SMART Library Conference Room Book Management System  

## 📌 Scope  
This application manages RF-SMART’s **Library** conference room books, focusing on both technical implementation and user needs.  

---

## 🚀 Key Features & User Stories  

### 🔍 View Available Books  
📖 **Story:** Employees can check which books are available for checkout.  
💡 **Implementation:** Display book title, author, availability, and check-out status.  
🖥 **UI Component:** A list or table showing available books.  

### 💬 View & Leave Comments on Books  
📖 **Story:** Employees can read and leave comments on books.  
💡 **Implementation:** Comment section under each book entry.  
🖥 **UI Component:** Book detail page with comments and an input field.  

### 🔄 Check Out & Check In Books  
📖 **Story:** Employees can borrow and return books.  
💡 **Implementation:** Update book availability and track check-out dates.  
🖥 **UI Component:** Buttons for checking out and returning books.  

### 🗑 Delete Books  
📖 **Story:** Books can be removed if lost, damaged, or kept.  
💡 **Implementation:** Delete books from the database.  
🖥 **UI Component:** A **"Delete"** button for each book.  

### 🎁 Donate Books  
📖 **Story:** Donors can contribute books to the library.  
💡 **Implementation:** Allow users to submit book details (title, author, description).  
🖥 **UI Component:** A simple **"Donate a Book"** form.  

---

## 🏛 Application Design  

### 📊 Database Schema (MySQL/PostgreSQL)  

#### **📚 Books Table**  
| Column | Type | Description |  
|--------|------|-------------|  
| `book_id` | Primary Key | Unique book ID |  
| `title` | String | Book title |  
| `author` | String | Book author |  
| `status` | Enum | Available, Checked Out |  
| `donor_id` | Foreign Key | References Donors table |  
| `check_out_date` | Date | When checked out |  
| `due_date` | Date | When due |  
| `return_date` | Date | When returned |  

#### **💬 Comments Table**  
| Column | Type | Description |  
|--------|------|-------------|  
| `comment_id` | Primary Key | Unique comment ID |  
| `book_id` | Foreign Key | References Books table |  
| `user_id` | Foreign Key | References Users table |  
| `comment_text` | String | User comment |  
| `date_posted` | Date | When posted |  

#### **👤 Users Table**  
| Column | Type | Description |  
|--------|------|-------------|  
| `user_id` | Primary Key | Unique user ID |  
| `name` | String | User's name |  
| `email` | String | Email address |  
| `role` | Enum | Employee, Reader, Donor |  

#### **🎁 Donors Table**  
| Column | Type | Description |  
|--------|------|-------------|  
| `donor_id` | Primary Key | Unique donor ID |  
| `user_id` | Foreign Key | References Users table |  
| `donated_books` | Array | List of donated book IDs |  

#### **🔄 Checkouts Table**  
| Column | Type | Description |  
|--------|------|-------------|  
| `checkout_id` | Primary Key | Unique checkout ID |  
| `book_id` | Foreign Key | References Books table |  
| `user_id` | Foreign Key | References Users table |  
| `check_out_date` | Date | When checked out |  
| `due_date` | Date | When due |  
| `return_date` | Date | When returned |  

---

## 🔌 REST API Endpoints  

### 📚 Books  
- `GET /books` → Retrieve all available books.  
- `GET /books/{book_id}` → Get details of a specific book.  
- `POST /books` → Add a new book (for donors).  
- `DELETE /books/{book_id}` → Delete a book.  

### 🔄 Checkouts  
- `POST /checkout/{book_id}` → Check out a book.  
- `POST /checkin/{book_id}` → Check in a book.  

### 💬 Comments  
- `POST /comments/{book_id}` → Add a comment.  
- `GET /comments/{book_id}` → Get all comments for a book.  

---

## 🌍 Web Application  

### 🎨 **Front-end**  
✅ **HTML, CSS, JavaScript** with a Node.js backend.  
✅ Displays books, check-out system, comments, and donation form.  

### 🛠 **Back-end (Node.js/Express)**  
✅ Handles API routes & business logic.  
✅ Uses **Sequelize ORM** for database interaction.  

### 🔒 **Authentication & Authorization**  
- **RF-SMART Employees** → Can donate books and mark books as lost.  
- **Readers** → Can check out/return books and leave comments.  
- **Donors** → Can add new books.  

---

## 🧪 Testing with Playwright  

### ✅ **UI Tests**  
✔ Verify book listing page.  
✔ Test book checkout and check-in process.  
✔ Ensure comments can be added and viewed.  

### ✅ **API Tests**  
✔ Test CRUD operations for books.  
✔ Test adding, retrieving, and deleting comments.  

### 🚨 **Negative Tests**  
✔ Attempting to check out an already checked-out book.  
✔ Deleting a non-existent book.  
✔ Donating a book without required details.  

---

## 🏗 Tech Stack  

### **Backend**  
- ⚡ **Node.js + Express**  
- 🗄 **Sequelize ORM**  
- 🛢 **MySQL/PostgreSQL**  

### **Frontend**  
- 🎨 **HTML, CSS, JavaScript**  
- 🖥 **Node.js for serving static content**  

### **Testing**  
- 🎭 **Playwright + TypeScript**  

### **Containers (Optional)**  
- 🐳 **Podman/Docker** for containerization.  

---

## 📌 Summary  
This application provides an intuitive way to manage RF-SMART’s library, allowing users to:  
✅ View books & check availability.  
✅ Check out and return books.  
✅ Leave comments and read reviews.  
✅ Donate books or remove lost/damaged books.  

This system ensures smooth book management while maintaining security and proper user roles. 🚀  

---

## 🎯 Next Steps  
🔹 Improve UI with React/Vue (optional).  
🔹 Enhance search & filtering features.  
🔹 Add notifications for due dates.  

---

### 🛠 Made with ❤️ for RF-SMART Library Management.  
