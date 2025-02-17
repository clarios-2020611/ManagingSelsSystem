import { model, Schema } from "mongoose";

const cartSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User id is required']
        },
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product id is required']
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }],
        subtotal: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: '7d' //Se elimina luego de una semana
        }
    }
);

export default model('Cart', cartSchema);