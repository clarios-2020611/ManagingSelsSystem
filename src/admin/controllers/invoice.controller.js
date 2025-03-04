import Invoice from '../../models/invoice/invoice.model.js';
import Cart from '../../models/cart/cart.model.js';
import User from '../../models/user/user.model.js';
import Product from '../../models/product/product.model.js';
import { objectIdValid } from "../../../helpers/db.validator.js";


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

export const updateInvoicePaymentStatus = async (req, res) => {
    try {
        const { invoiceId, paymentStatus } = req.body;
        objectIdValid(invoiceId);
        const invoice = await Invoice.findById(invoiceId).populate('items.productId');
        if (!invoice) return res.status(404).send({ success: false, message: 'Invoice not found' });
        if (invoice.paymentStatus === paymentStatus) return res.status(200).send({ success: true, message: 'No change in payment status', invoice });
        if (paymentStatus === 'FAILED') {
            for (const item of invoice.items) {
                if (item.productId) {
                    await Product.findByIdAndUpdate(item.productId._id, {
                        $inc: { stock: item.quantity } // Devolver la cantidad al stock
                    });
                }
            }
        }
        invoice.paymentStatus = paymentStatus;
        await invoice.save();
        return res.status(200).send({
            success: true,
            message: `Invoice payment status updated to ${paymentStatus}`,
            invoice
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', error: e.message });
    }
};