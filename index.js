const addBook = document.querySelector('.add-btn');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const bookForm = document.getElementById('bookForm');
const bookList = document.querySelector('.book-list');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');
const statusInput = document.getElementById('status');
const genreInput = document.getElementById('genre');
const coverUrlInput = document.getElementById('cover-url');


const myLibrary = [];

const localStorageSave = function(){
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function Book(title, Author, Pages, Status, Genre, CoverUrl) {
  // the constructor...
    this.title = title;
    this.author = Author;
    this.pages = Pages;
    this.status = Status;
    this.genre = Genre;
    this.coverUrl = CoverUrl;
    this.id = crypto.randomUUID();
}

function addBookToLibrary(title, Author, Pages, Status, Genre, CoverUrl) {
  // take params, create a book then store it in the array
    const newBook = new Book(title, Author, Pages, Status, Genre, CoverUrl);
    myLibrary.push(newBook);
    localStorageSave();
    return newBook;
}

    // Show modal
addBook.addEventListener('click', () => {
    modal.style.display = 'block';
});

    // Hide modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

const getNextStatus = (current) => {
    if (current === 'read') return 'reading';
    if (current === 'reading') return 'unread';
    return 'read';
};

// DOM element for new book
const NewBookAdded = function (book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.setAttribute('data-id', book.id);
    bookItem.innerHTML = `
        <img src="${book.coverUrl}" alt="Book Cover">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>Genre: ${book.genre}</p>
        <p>Status: <span class="book-status">${book.status}</span></p>
        <button class="status-btn">Change status</button>
        <button class="delete-btn">Delete</button>
    `;

    // Add event listener for status button
    bookItem.querySelector('.status-btn').addEventListener('click', function() {
        const statusSpan = bookItem.querySelector('.book-status');
        const currentStatus = statusSpan.textContent;
        const nextStatus = getNextStatus(currentStatus);
        statusSpan.textContent = nextStatus;
        book.status = nextStatus;
        localStorageSave();
    });

    // Add event listener for remove button
    bookItem.querySelector('.delete-btn').addEventListener('click', function() {
        bookItem.remove();
        const index = myLibrary.findIndex(b => b.id === book.id);
        if (index > -1) {
            myLibrary.splice(index, 1);
            localStorageSave();
        }
    });

    return bookItem;
}

// Handle form submission
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const author = authorInput.value;
    const pages = pagesInput.value;
    const status = statusInput.value;
    const genre = genreInput.value;
    const coverUrl = coverUrlInput.value;

    const newBook = addBookToLibrary(title, author, pages, status, genre, coverUrl);
    const bookElement = NewBookAdded(newBook);
    bookList.appendChild(bookElement);

    // Reset form and hide modal
    bookForm.reset();
    modal.style.display = 'none';
    localStorageSave();
});

// Load books from stored books in localStorage
window.addEventListener('DOMContentLoaded', () => {
    const storedBooks = JSON.parse(localStorage.getItem('myLibrary')) || [];
    storedBooks.forEach(bookData => {
        const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.status, bookData.genre, bookData.coverUrl);
        myLibrary.push(book);
        const bookElement = NewBookAdded(book);
        bookList.appendChild(bookElement);
    });
});