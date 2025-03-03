import Category from '../src/models/category/category.model.js';
import Product from '../src/models/product/product.model.js';
import { isValidObjectId } from 'mongoose';
import User from '../src/models/user/user.model.js'

export const availableCategory = async (id) => {
    const category = await Category.findById(id, {
        status: true
    });
    if (!category) {
        console.error(`Category with id ${id} is not available`);
        throw new Error(`Category with id ${id} is not available`);
    }
}

export const defaultCategory = async (deletedCategory) => {
    const newCategory = '67af48caf59d000d5a66fdad';
    const products = await Product.updateMany({ category: deletedCategory }, { $set: { category: newCategory } });
    console.log(`${products.modifiedCount} products were moved to the default category`);
    if (products === 0) {
        console.error(`Product not found`);
        throw new Error(`Product not found`);
    }
}

export const existUsername = async (username) => {
    const alreadyUsername = await User.findOne({ username });
    if (alreadyUsername) {
        console.error(`Username ${username} is already taken`);
        throw new Error(`Username ${username} is already taken`);
    }
}

export const existCategory = async (name) => {
    const alreadyCategory = await Category.findOne({ name });
    if (alreadyCategory) {
        console.error(`Category ${name} already exist`);
        throw new Error(`Category ${name} already exist`);
    }
}

export const objectIdValid = async (objectId) => {
    if (!isValidObjectId(objectId)) {
        throw new Error(`Id is not objectId valid`);
    }
}

export const existProduct = async (name) => {
    const alreadyProduct = await Product.findOne({ name });
    if (alreadyProduct) {
        console.error(`Product ${name} already exist`);
        throw new Error(`Product ${name} already exist`);
    }
}

export const findUser = async (id) => {
    try {
        const userExist = await User.findById(id)
        if (!userExist) return false
        return userExist
    } catch (e) {
        console.error(e)
        return false
    }
}

export const availableStock = async (id, stock) => {
    try {
        const product = Product.findOne({ _id: id });
        if (product.stock < stock) {
            console.error(`Only have ${product.stock} available stock`);
            throw new Error(`Only have ${product.stock} available stock`);
        }
    } catch (e) {
        console.error(e)
        return false
    }
}