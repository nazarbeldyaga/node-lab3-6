import { validationResult } from 'express-validator';

export const validationMiddleware = (
  request,
  response,
  next,
) => {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    response.status(400).json({
      messages: errors.array().map((error) => error.msg),
    });
  } else {
    next();
  }
};