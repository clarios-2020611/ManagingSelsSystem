import { Router } from "express";
import { addCatogry, deleteCategory, getAllCategory, getOneCategory, updateCategory } from "../controllers/category.controller.js";
import { addProduct, deleteProduct, getCatalogue, getProduct, updateProduct } from "../controllers/prod.controller.js";
import { needId, saveCategoryValidator, saveProductsValidator, updateCategoryValidator } from "../../../helpers/validators.js";
import { isAdmin, validateJwt } from "../../../middlewares/validate.jwt.js";
import { addStock, moreSales, restProduct } from "../controllers/inventory.controller.js";
import { createUser, deleteUser, getAll, update, updateRol } from "../controllers/user.controller.js";
import { generateInvoiceFromCart, getInvoice, updateInvoicePaymentStatus } from "../controllers/invoice.controller.js";

const api = Router();

//Categorias
api.post('/addCategory', [validateJwt, isAdmin], [saveCategoryValidator], addCatogry);
api.get('/getAll', [validateJwt, isAdmin], getAllCategory);
api.get('/getCategory', [validateJwt, isAdmin], [needId], getOneCategory);
api.put('/updateCategory', [validateJwt, isAdmin], [updateCategoryValidator], updateCategory);
api.put('/deleteCategory', [validateJwt, isAdmin], [needId], deleteCategory);

//Productos
api.post('/CreateProduct', [validateJwt, isAdmin], [saveProductsValidator], addProduct);
api.get('/getCatalogue', getCatalogue);
api.get('/getProduct', [needId], getProduct);
api.put('/updateProduct', [validateJwt, isAdmin], [updateCategoryValidator], updateProduct);
api.delete('/deleteProduct', [validateJwt, isAdmin], [needId], deleteProduct);
api.put('/addProduct', [validateJwt, isAdmin], addStock);
api.put('/restProduct', [validateJwt, isAdmin], restProduct);
api.put('/moreSels', [validateJwt, isAdmin], moreSales);

//Usuarios
api.post('/createUser', [validateJwt, isAdmin], createUser);
api.get('/getUsers', [validateJwt, isAdmin], getAll);
api.put('/updateRol', [validateJwt, isAdmin], updateRol);
api.put('/updateUser', [validateJwt, isAdmin], update);
api.put('/deleteUser', [validateJwt, isAdmin], deleteUser);

//Facturas
api.get('/getInvoice', [validateJwt, isAdmin], getInvoice);
api.post('/generateInvoice', [validateJwt, isAdmin], generateInvoiceFromCart);
api.put('/updateInvoice', [validateJwt, isAdmin], updateInvoicePaymentStatus);

export default api;