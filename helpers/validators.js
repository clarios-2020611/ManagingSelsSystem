import { body } from "express-validator";
import { validateErrorWithoutImg, validateErros } from "../middlewares/validate.errors.js";
import { existCategory, existProduct, existUsername, objectIdValid } from "./db.validator.js";

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only'),
    body('username', 'Username is required').notEmpty().toLowerCase().custom(existUsername),
    body('lastname', 'Lastname cannot be empty').notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only'),
    body('email', 'Email cannot be empty').notEmpty().isEmail().withMessage('Email is not valid'),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password need be strong'),
    body('role').optional().isIn(['ADMIN', 'CLIENTE']).withMessage('The field needs to contain ADMIN or CLIENT only'),
    body('status').optional().isBoolean().withMessage('The field needs to contain true or false only'),
    validateErrorWithoutImg
];

export const loginValidator = [
    body('username').optional().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only'),
    body('email').optional(),
    body('password', 'Password is required').notEmpty(),
    validateErrorWithoutImg
];

export const saveCategoryValidator = [
    body('name', 'Name is required').notEmpty().custom(existCategory),
    body('description', 'Description is required').notEmpty(),
    validateErrorWithoutImg
];

export const needId = [
    body('id', 'Id is required').notEmpty().custom(objectIdValid),
    validateErrorWithoutImg
];

export const updateCategoryValidator = [
    body('id', 'Id is required').notEmpty().custom(objectIdValid),
    body('name').optional().notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only').custom(existCategory),
    body('description').optional().notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only'),
    validateErrorWithoutImg
];

export const saveProductsValidator = [
    body('name', 'Name is required').notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only')
        .custom(existProduct),
    body('description', 'Description is required')
        .notEmpty().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only')
        .isLength({ max: 255 }).withMessage('Description too long'),
    body('prace', 'Prace is required').notEmpty().isNumeric().withMessage('The field needs to contain numbers only'),
    body('stock', 'Stock is required').notEmpty().isNumeric().withMessage('The field needs to contain numbers only'),
    body('category').notEmpty().custom(objectIdValid),
    body('salesCount').optional().isNumeric().withMessage('The field needs to contain numbers only'),
    validateErrorWithoutImg
];

export const updateProduct = [
    body('id', 'Id is required').notEmpty().custom(objectIdValid),
    body('name').optional().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only')
        .custom(existProduct),
    body('description').optional().matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('The field needs to contain letters only')
        .isLength({ max: 255 }).withMessage('Description too long'),
    body('prace').optional().isNumeric().withMessage('The field needs to contain numbers only'),
    body('stock').optional().isNumeric().withMessage('The field needs to contain numbers only'),
    body('category').optional().custom(objectIdValid),
    body('salesCount').optional().isNumeric().withMessage('The field needs to contain numbers only'),
    validateErrorWithoutImg
];