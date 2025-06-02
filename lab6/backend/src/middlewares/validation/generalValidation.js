import { param, query } from 'express-validator';
import DateModel from '../../models/Date';

export const idValidation = param('id').isInt().withMessage('Wrong id format');

export const paginationQueryValidation = [
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