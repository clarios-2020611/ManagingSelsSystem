//FUNCIONALIDADES DE PRODUCTOS DEL LADO DEL ADMIN

import { availableCategory, existProduct } from '../../../helpers/db.validator.js';
import Product from '../../models/product/product.model.js';

export const getCatalogue = async (req, res) => {
    try {
        const { limit = 5, skip = 0 } = req.query;
        const products = await Product.find().skip(skip).limit(limit).where({ status: true }).populate('category', '-_id -description -__v -status');
        if (products.length === 0) return res.status(404).send({ message: 'Products not found', success: false });
        return res.send({ message: `Products: ${products}`, success: true, total: products.length });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id).where({ status: true }).populate('category', '-_id -description -__v -status');
        if (!product) return res.status(404).send({ message: 'Product not found', success: false });
        return res.send({ message: 'Product found', product, success: true });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const data = req.body;
        const id = data.id;
        console.log(id);
        const product = await Product.findByIdAndUpdate(id, data, { new: true }).where({ status: true });
        if (!product) return res.status(404).send({ message: 'Product not found', success: false });
        return res.send({ success: true, message: 'Product updated successfully', product });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).send({ message: 'Product not found', success: false });
        return res.send({ success: true, message: 'Product delete successfully', product });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const addProduct = async (req, res) => {
    try {
        const data = req.body;
        const category = data.category;
        availableCategory(category);
        existProduct(data.name);
        const product = new Product(data);
        await product.save();
        return res.send({ success: true, message: 'Product saved successfully', product });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}   