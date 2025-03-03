//MANEJO DEL INVENTARIO
import { objectIdValid } from '../../../helpers/db.validator.js';
import Product from '../../models/product/product.model.js';


//AGREGAR STOCK A UN PRODUCTO
export const addStock = async (req, res) => {
    try {
        let { stock, name } = req.body;
        let movement = [stock, 'ENTRY'];
        if (stock === 0) return res.send({ success: false, message: 'Stock cannot be 0' });
        const product = await Product.findOneAndUpdate({ name }, { $inc: { stock: stock }, $push: { movements: movement } }, { new: true });
        if (!product) return res.status(404).send({ succes: false, message: 'Product not found' });
        return res.send({ success: true, message: 'Stock has been added successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

//RESTAR STOCK A UN PRODUCTO
export const restProduct = async (req, res) => {
    try {
        let { name, quantity } = req.body;
        let movement = [quantity, 'EGRESS'];
        if (quantity === 0) return res.status(404).send({ success: false, message: 'Stock cannot be 0' });
        const product = Product.findOne({ name });
        if (!product) return res.status(404).send({ success: false, message: 'Product not found' });
        if (product.stock < quantity) return res.send({ succes: false, message: `We only have ${product.stock} units of this product in stock.` });
        const productUpdated = await Product.findOneAndUpdate({ name }, { $inc: { stock: -quantity }, $push: { movements: movement }, }, { new: true });
        return res.send({ succes: true, message: `Thank you for your purchase!` });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

//MÁS VENDIDOS
export const moreSales = async (req, res) => {
    try {
        let product = await Product.findOne().sort({ salesCount: -1 });
        res.send({ succes: true, message: `Product with more sales: ${product}` });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}