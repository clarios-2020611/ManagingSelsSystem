import { Schema } from "mongoose";

const invoiceSchema = Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User id is required']
        },
        items: [{
            productId: {
                type: [Schema.Types.ObjectId],
                ref: 'Product',
                required: [true, 'Products is required']
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true
            }
        }],
        subtotal: {
            type: Number
        },
        total: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required'],
            enum: ['credit_card', 'debit_card', 'cash', 'transfer']
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED'],
            default: 'PENDING'
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }
);

export default model('Invoice', invoiceSchema);