import { model, Schema } from "mongoose";

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [255, 'Description is too long']
        },
        prace: {
            type: Number,
            required: [true, 'Prace is required']
        },
        movements: [{
            type: String,
            quantity: Number,
            enum: ['ENTRY', 'EGRESS'],
            date: {
                type: Date,
                default: Date.now()
            }
        }],
        salesCount: {
            type: Number,
            default: 0
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: 5
        },
        category: {
            type: [Schema.Types.ObjectId],
            ref: 'Category',
            required: [true, 'Category is required']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
);

productSchema.methods.toJSON = function () {
    const { __v, status, ...product } = this.toObject();
    return product;
}

export default model('Product', productSchema);