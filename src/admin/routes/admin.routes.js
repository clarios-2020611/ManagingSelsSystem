import { Router } from "express";
import { addCatogry, deleteCategory, getAllCategory, getOneCategory, updateCategory } from "../controllers/category.controller.js";
import { addProduct, deleteProduct, getCatalogue, getProduct, updateProduct } from "../controllers/prod.controller.js";
import { needId, saveCategoryValidator, saveProductsValidator, updateCategoryValidator } from "../../../helpers/validators.js";
import { validateJwt } from "../../../middlewares/validate.jwt.js";
import { addStock, moreSales, restProduct } from "../controllers/inventory.controller.js";
import { createUser, deleteUser, getAll, update, updateRol } from "../controllers/user.controller.js";
import { generateInvoiceFromCart, getInvoice, updateInvoice } from "../controllers/invoice.controller.js";

const api = Router();

//Categorias
api.post('/addCategory', [validateJwt], [saveCategoryValidator], addCatogry);
api.get('/getAll', [validateJwt], getAllCategory);
api.get('/getCategory', [validateJwt], [needId], getOneCategory);
api.put('/updateCategory', [validateJwt], [updateCategoryValidator], updateCategory);
api.put('/deleteCategory', [validateJwt], [needId], deleteCategory);

//Productos
api.post('/CreateProduct', [validateJwt], [saveProductsValidator], addProduct);
api.get('/getCatalogue', getCatalogue);
api.get('/getProduct', [needId], getProduct);
api.put('/updateProduct', [validateJwt], [updateCategoryValidator], updateProduct);
api.delete('/deleteProduct', [validateJwt], [needId], deleteProduct);
api.put('/addProduct', [validateJwt], addStock);
api.put('/restProduct', [validateJwt], restProduct);
api.put('/moreSels', [validateJwt], moreSales);

//Usuarios
api.post('/createUser', [validateJwt], createUser);
api.get('/getUsers', [validateJwt], getAll);
api.put('/updateRol', [validateJwt], updateRol);
api.put('/updateUser', [validateJwt], update);
api.put('/deleteUser', [validateJwt], deleteUser);

//Facturas
api.get('/getInvoice', [validateJwt], getInvoice);
api.post('/generateInvoice', [validateJwt], generateInvoiceFromCart);
api.put('/updateInvoice', [validateJwt], updateInvoice);

export default api;