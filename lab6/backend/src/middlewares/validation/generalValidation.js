const { param, query } = require('express-validator');
const DateModel = require('../../models/Date.js');

const idValidation = param('id').isInt().withMessage('Wrong id format');

const paginationQueryValidation = [
  query('page')
    .optional()
    .default(1)
    .toInt()
    .isInt({ min: 1 }).withMessage('Page number must be positive number'),
  query('limit')
    .optional()
    .default(8)
    .toInt()
    .isInt({ min: 1 }).withMessage('Page limit must be positive number'),
  query('filter')
    .optional()
    .isIn(Object.values(DateModel)).withMessage('Wrong status value'),
];

module.exports = {
  idValidation,
  paginationQueryValidation
}