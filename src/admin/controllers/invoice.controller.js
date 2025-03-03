import Invoice from '../../models/invoice/invoice.model.js';
import Cart from '../../models/cart/cart.model.js';
import User from '../../models/user/user.model.js';
import Product from '../../models/product/product.model.js';
import { availableStock, objectIdValid } from "../../../helpers/db.validator";


export const getInvoiceByCliente = async (req, res) => {
    try {
        let { client } = req.body;
        objectIdValid(client);
        let invoices = await Invoice.find({ user: client });
        if (!invoices) return res.status(404).send({ success: false, message: 'Invoices no found' });
        return res.send({ success: true, message: `We have found the following invoices associated with your account` });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const getInvoice = async (req, res) => {
    try {
        let { id } = req.body;
        objectIdValid(id);
        let invoice = findOne({ _id: id });
        if (!invoice) return res.status(404).send({ success: false, message: 'Invoice not found' });
        return res.send({ success: true, message: 'Invoice found', invoice });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const generateInvoiceFromCart = async (req, res) => {
    try {
        const { client, paymentMethod } = req.body;
        objectIdValid(client);
        const user = await User.findOne({ _id: client, status: true });
        if (!user) return res.status(404).send({ success: false, message: 'User not found' });
        const cart = await Cart.findOne({ user: client }).populate('items.product');
        if (!cart || cart.items.length === 0) return res.status(404).send({ success: false, message: 'Cart not found or empty' });
        if (!['credit_card', 'debit_card', 'cash', 'transfer'].includes(paymentMethod)) return res.status(400).send({ success: false, message: 'Invalid payment method' });
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const invoiceItems = [];
        let subtotal = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Product with ID ${item.product._id} no longer exists`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Not enough stock for product ${product.name}. Available: ${product.stock}`
                });
            }
            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;
            invoiceItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price,
                subtotal: itemSubtotal
            });
            await Product.findByIdAndUpdate(product._id, {
                $inc: { stock: -item.quantity }
            });
        }
        const taxes = subtotal * 0.12;
        const total = subtotal + taxes;
        const invoice = new Invoice({
            invoiceNumber,
            user: client,
            items: invoiceItems,
            subtotal,
            total,
            paymentMethod,
            date: new Date()
        });
        await invoice.save();
        await Cart.findByIdAndUpdate(cart._id, { $set: { items: [], subtotal: 0 } });
        return res.status(200).send({ success: true, message: 'Invoice generated successfully', invoice });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { paymentStatus, paymentMethod, items } = req.body;
        if (!invoiceId) {
            return res.status(400).send({ success: false, message: 'Invoice ID is required' });
        }
        objectIdValid(invoiceId);
        const invoice = await Invoice.findById(invoiceId).populate('user');
        if (!invoice) {
            return res.status(404).send({ success: false, message: 'Invoice not found' });
        }
        const updateFields = {};
        if (paymentStatus && ['PENDING', 'COMPLETED', 'FAILED'].includes(paymentStatus)) {
            updateFields.paymentStatus = paymentStatus;
        }

        if (paymentMethod && ['credit_card', 'debit_card', 'cash', 'transfer'].includes(paymentMethod)) {
            updateFields.paymentMethod = paymentMethod;
        }

        if (items && Array.isArray(items)) {
            for (const item of items) {
                if (!item.productId || !item.quantity || !item.price) {
                    return res.status(400).send({
                        success: false,
                        message: 'Each item must have productId, quantity, and price'
                    });
                }

                objectIdValid(item.productId);

                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).send({
                        success: false,
                        message: `Product with ID ${item.productId} not found`
                    });
                }

                const existingItem = invoice.items.find(i =>
                    i.productId.toString() === item.productId.toString()
                );

                const quantityDifference = existingItem
                    ? item.quantity - existingItem.quantity
                    : item.quantity;

                if (quantityDifference > 0 && product.stock < quantityDifference) {
                    return res.status(400).send({
                        success: false,
                        message: `Not enough stock for product ${product.name}. Available: ${product.stock}`
                    });
                }


                if (quantityDifference !== 0) {
                    await Product.findByIdAndUpdate(product._id, {
                        $inc: { stock: -quantityDifference }
                    });
                }
            }
            const newItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price
            }));
            updateFields.items = newItems;
            const subtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
            const taxes = subtotal * 0.12;
            const total = subtotal + taxes;

            updateFields.subtotal = subtotal;
            updateFields.total = total;
        }
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { $set: updateFields },
            { new: true }
        ).populate('user items.productId');

        return res.status(200).send({
            success: true,
            message: 'Invoice updated successfully',
            invoice: updatedInvoice
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};