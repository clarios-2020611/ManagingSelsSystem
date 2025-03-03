import { objectIdValid } from "../../../helpers/db.validator.js";
import User from '../../models/user/user.model.js';
import Product from '../../models/product/product.model.js';
import Cart from '../../models/cart/cart.model.js';

export const addProductToCart = async (req, res) => {
    try {
        let { product, client, quantity } = req.body;
        objectIdValid(product);
        objectIdValid(client);
        let user = await User.findOne({ _id: client, status: true });
        let productToAdd = await Product.findOne({ _id: product });
        console.log(productToAdd);
        if (!user || !productToAdd) return res.status(404).send({ success: false, message: 'User or product not found' });
        let cart = await Cart.findOne({ user: client });
        if (!cart) {
            cart = new Cart({
                user: client,
                items: [{
                    product: product,
                    quantity: quantity
                }],
                subtotal: productToAdd.prace * quantity
            });
            await cart.save();
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === product.toString()
            );
            if (existingItemIndex >= 0) cart.items[existingItemIndex].quantity += quantity;
            cart.items.push({ product: product, quantity: quantity });

            let subtotal = 0;
            for (const item of cart.items) {
                const productInfo = await Product.findById(item.product);
                subtotal += productInfo.prace * item.quantity;
            }

            cart.subtotal = subtotal;
            await cart.save();
        }

        return res.send({ success: true, message: 'Product added to cart successfully', cart });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        let { productId, client, quantity } = req.body;
        objectIdValid(client);
        let user = await User.findOne({ _id: client, status: true });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        let product = await Product.findOne({ _id: productId });
        if (!product) return res.status(404).send({ success: false, message: 'Product not found' });
        let cart = await Cart.findOne({ user: client });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === product._id.toString()
        );
        if (existingItemIndex === -1) {
            return res.status(404).send({ success: false, message: 'Product not in cart' });
        }
        if (!quantity || quantity >= cart.items[existingItemIndex].quantity) {
            cart.items.splice(existingItemIndex, 1);
        } else {
            cart.items[existingItemIndex].quantity -= quantity;
        }
        let subtotal = 0;
        for (const item of cart.items) {
            const productInfo = await Product.findById(item.product);
            subtotal += productInfo.prace * item.quantity;
        }
        cart.subtotal = subtotal;
        await cart.save();
        return res.send({ success: true, message: 'Product removed from cart successfully', cart });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};

export const getCart = async (req, res) => {
    try {
        let { client } = req.body;
        objectIdValid(client);
        let cart = await Cart.findOne({ user: client }).populate('items.product', 'name -_id').populate('user', 'username -_id');
        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found' });
        return res.send({ success: true, message: 'Cart found', cart });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
}