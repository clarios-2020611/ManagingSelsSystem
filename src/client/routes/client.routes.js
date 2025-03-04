import { Router } from "express";
import { validateJwt } from "../../../middlewares/validate.jwt";
import { addProductToCart, getCart, removeProductFromCart } from "../controllers/cart.controller";
import { moreSales } from "../../admin/controllers/inventory.controller";
import { generateInvoiceFromCart } from "../../admin/controllers/invoice.controller";
import { getPurchaseHistory } from "../controllers/user.controller";

const api = Router();

//Carrito
api.put('/addToCart', [validateJwt], addProductToCart);
api.put('/removeToCart', [validateJwt], removeProductFromCart);
api.get('/getCart', [validateJwt], getCart);

//Product
api.get('/moreSales', [validateJwt], moreSales);

//Finalizar compra
api.post('/sel', [validateJwt], generateInvoiceFromCart);

//Usuarios
api.get('/history', [validateJwt], getPurchaseHistory);

export default api;