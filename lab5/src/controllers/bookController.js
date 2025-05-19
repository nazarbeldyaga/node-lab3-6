const BookService = require('../services/bookService');

const searchByTitle = async (req, res) => {
    const title = req.query.title || '';
    const books = await BookService.searchByTitle(title);
    res.render('guest/results', { books, searchTerm: title, searchType: 'title', title: 'Search Results' });
};

const searchByKeyword = async (req, res) => {
    const keyword = req.query.keyword || '';
    const books = await BookService.searchByKeyword(keyword);
    res.render('guest/results', { books, searchTerm: keyword, searchType: 'keyword', title: 'Search Results' });
};

const getAllBooks = async (req, res) => {
    const books = await BookService.getAllBooks();
    res.render('admin/dashboard', { books, title: 'Admin Dashboard' });
};

const createBookForm = (req, res) => {
    res.render('admin/bookForm', { book: null, title: 'Create Book' }); // Додано title
};

const createBook = async (req, res) => {
    const { title, author, keywords } = req.body;
    await BookService.createBook({ id: Date.now(), title, author, keywords: keywords.split(',').map(k => k.trim()) });
    res.redirect('/admin');
};

const editBookForm = async (req, res) => {
    const book = await BookService.getBookById(parseInt(req.params.id));
    res.render('admin/bookForm', { book, title: 'Edit Book' });
};

const updateBook = async (req, res) => {
    const { title, author, keywords } = req.body;
    await BookService.updateBook(parseInt(req.params.id), { title, author, keywords: keywords.split(',').map(k => k.trim()) });
    res.redirect('/admin');
};

const confirmDelete = async (req, res) => {
    const book = await BookService.getBookById(parseInt(req.params.id));
    res.render('admin/confirmDelete', { book, title: 'Confirm Delete' });
};

const deleteBook = async (req, res) => {
    await BookService.deleteBook(parseInt(req.params.id));
    res.redirect('/admin');
};

module.exports = {
    searchByTitle,
    searchByKeyword,
    getAllBooks,
    createBookForm,
    createBook,
    editBookForm,
    updateBook,
    confirmDelete,
    deleteBook
};