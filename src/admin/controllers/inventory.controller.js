//MANEJO DEL INVENTARIO
import { objectIdValid } from '../../../helpers/db.validator.js';
import Product from '../../models/product/product.model.js';


//AGREGAR STOCK A UN PRODUCTO
export const addProduct = async (req, res) => {
    try {
        let { stock, id } = req.body;
        let movement = [stock, 'ENTRY'];
        objectIdValid(id);
        if (stock === 0) return res.status(404).send({success: false, message: 'Stock cannot be 0'});
        const product = await Product.findByIdAndUpdate(id, { $inc: { stock: stock }, $push: {movements: movement} }, {new: true});
        return res.send({success: true, message: 'Stock has been added successfully'});
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

//RESTAR STOCK A UN PRODUCTO
export const restProduct = async (req, res) => {
    try {
        let { id, quantity } = req.body;
        let movement = [stock, 'EGRESS'];
        objectIdValid(id);
        if (quantity === 0) return res.status(404).send({success: false, message: 'Stock cannot be 0'});
        const product = Product.findById(id);
        if (!product) return res.status(404).send({success: false, message: 'Product not found'});
        if (product.stock < quantity) return res.status(401).send({ success: false, message: 'Insufficient stock'});
        const productUpdated = await Product.findByIdAndUpdate(id, { $inc: { stock: -quantity }, $push: {movements: movement},}, {new: true});
        return res.send({succes: true, message: `Thank you for your purchase!`});
    } catch (e) {
        console.error(e);
        return res.status(500).send({success: false, message: 'General error', e});
    }
}