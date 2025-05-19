const BookRepository = require('../repositories/bookRepository.async');

const getAllBooks = async () => {
    return await BookRepository.getBooks();
};

const getBookById = async (id) => {
    const books = await BookRepository.getBooks();
    return books.find(book => book.id === id);
};

const searchByTitle = async (title) => {
    const books = await BookRepository.getBooks();
    return books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
};

const searchByKeyword = async (keyword) => {
    const books = await BookRepository.getBooks();
    return books.filter(book => book.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())));
};

const createBook = async (book) => {
    const books = await BookRepository.getBooks();
    books.push(book);
    await BookRepository.saveBooks(books);
};

const updateBook = async (id, updatedBook) => {
    const books = await BookRepository.getBooks();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...updatedBook };
        await BookRepository.saveBooks(books);
    }
};

const deleteBook = async (id) => {
    const books = await BookRepository.getBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    await BookRepository.saveBooks(filteredBooks);
};

module.exports = {
    getAllBooks,
    getBookById,
    searchByTitle,
    searchByKeyword,
    createBook,
    updateBook,
    deleteBook
};