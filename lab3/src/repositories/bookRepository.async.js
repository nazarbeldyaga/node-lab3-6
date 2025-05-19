const fs = require('fs').promises;
const path = require('path');

const booksFile = path.join(__dirname, '../data/books.json');

const getBooks = async () => {
    const data = await fs.readFile(booksFile, 'utf8');
    return JSON.parse(data);
};

const saveBooks = async (books) => {
    await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
};

module.exports = { getBooks, saveBooks };