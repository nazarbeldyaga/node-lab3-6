import { body } from 'express-validator';

export const createOrUpdateForecastValidation = [
    body('location_id')
        .notEmpty().withMessage('Location id is required')
        .isInt().withMessage('Wrong location id format'),
    body('date_id')
        .notEmpty().withMessage('Date id is required')
        .isInt().withMessage('Wrong date id format'),
    body('hour')
        .notEmpty().withMessage('Hour is required')
        .isInt().withMessage('Wrong hour format'),
    body('temperature')
        .notEmpty().withMessage('Temperature is required')
        .isInt().withMessage('Wrong temperature format'),
    body('cloud_type')
        .isIn(['сонячно', 'частково хмарно', 'хмарно']).withMessage('Wrong cloud type value')
        .default('сонячно'),
    body('wind_direction')
        .isIn(['Зх', 'Сх', 'Пн', 'Пд', 'ПнЗх', 'ПнСх', 'ПдЗх', 'ПдСх']).withMessage('Wrong wind direction value')
        .default('Пн'),
    body('wind_speed')
        .isInt().withMessage('Wrong wind speed format')
        .default(0),
    body('precipitation')
        .isInt().withMessage('Wrong precipitation format')
        .default(0),
    body('is_rain')
        .isBoolean().withMessage('Wrong rain format')
        .default(false),
    body('is_thunderstorm')
        .isBoolean().withMessage('Wrong thunderstorm format')
        .default(false),
    body('is_snow')
        .isBoolean().withMessage('Wrong snow format')
        .default(false),
    body('is_hail')
        .isBoolean().withMessage('Wrong hail format')
        .default(false),
]