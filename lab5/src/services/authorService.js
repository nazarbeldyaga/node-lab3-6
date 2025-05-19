const BookRepository = require('../repositories/bookRepository.async');

const searchByAuthor = async (authorName) => {
    const books = await BookRepository.getBooks();
    return books.filter(book => book.author.toLowerCase().includes(authorName.toLowerCase()));
};

module.exports = { searchByAuthor };