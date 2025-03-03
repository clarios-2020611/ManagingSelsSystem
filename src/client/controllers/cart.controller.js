import { objectIdValid } from "../../../helpers/db.validator";
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
        if (!user || !productToAdd) return res.status(404).send({ success: false, message: 'User or product not found' });
        let cart = await Cart.findOne({ user: client });
        if (!cart) {
            cart = new Cart({
                user: client,
                items: [{
                    product: product,
                    quantity: quantity
                }],
                subtotal: productToAdd.price * quantity
            });
            await cart.save();
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === product.toString()
            );
            if (existingItemIndex >= 0) cart.items[existingItemIndex].quantity += quantity;
            cart.items.push({ product: product, quantity: quantity });

            // Recalcular el subtotal
            let subtotal = 0;
            for (const item of cart.items) {
                const productInfo = await Product.findById(item.product);
                subtotal += productInfo.price * item.quantity;
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

// Nueva función para eliminar productos del carrito por nombre
export const removeProductFromCart = async (req, res) => {
    try {
        let { productName, client, quantity } = req.body;
        objectIdValid(client);

        // Validar que el usuario exista
        let user = await User.findOne({ _id: client, status: true });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Buscar el producto por nombre
        let product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: client });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        // Buscar el índice del producto en el carrito
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === product._id.toString()
        );

        if (existingItemIndex === -1) {
            return res.status(404).send({ success: false, message: 'Product not in cart' });
        }

        // Si no se especifica la cantidad o es mayor a la existente, eliminar el producto
        if (!quantity || quantity >= cart.items[existingItemIndex].quantity) {
            cart.items.splice(existingItemIndex, 1);
        } else {
            // Disminuir la cantidad
            cart.items[existingItemIndex].quantity -= quantity;
        }

        // Recalcular el subtotal
        let subtotal = 0;
        for (const item of cart.items) {
            const productInfo = await Product.findById(item.product);
            subtotal += productInfo.price * item.quantity;
        }

        cart.subtotal = subtotal;
        await cart.save();

        return res.send({ success: true, message: 'Product removed from cart successfully', cart });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};