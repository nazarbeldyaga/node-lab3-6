const AuthorService = require('../services/authorService');

const searchByAuthor = async (req, res) => {
    const authorName = req.query.name || '';
    const books = await AuthorService.searchByAuthor(authorName);
    res.render('guest/results', { books, searchTerm: authorName, searchType: 'author' });
};

module.exports = { searchByAuthor };