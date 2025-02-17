import { Router } from "express";
import { addCatogry, deleteCategory, getAllCategory, getOneCategory, updateCategory } from "../controllers/category.controller.js";
import { addProduct, deleteProduct, getCatalogue, getProduct, updateProduct } from "../controllers/prod.controller.js";
import { needId, saveCategoryValidator, saveProductsValidator, updateCategoryValidator } from "../../../helpers/validators.js";
import { validateJwt } from "../../../middlewares/validate.jwt.js";

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
api.put('/deleteProduct', [validateJwt], [needId], deleteProduct);

export default api;