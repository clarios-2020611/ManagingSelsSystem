import { defaultCategory, existCategory } from '../../../helpers/db.validator.js';
import Category from '../../models/category/category.model.js';

export const createDefaultCategory = async () => {
    try {
        let data = { name: 'Uncategorized', description: 'Items without specific categorization' };
        if (await Category.findOne({ name: data.name })) return console.log('Default category already exist');
        let category = new Category(data);
        await category.save();
        return console.log('Default category created successfully');
    } catch (e) {
        console.error(e);
    }
}

export const addCatogry = async (req, res) => {
    try {
        const data = req.body;
        existCategory(data.name);
        const category = new Category(data);
        await category.save();
        return res.send({ success: true, message: 'Category saved successfully', category });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const { limit = 5, skip = 0 } = req.query;
        const categorys = await Category.find().limit(limit).skip(skip).where({ status: true });
        if (categorys.length === 0) return res.status(404).send({ success: false, message: 'Category not found' });
        return res.send({ success: true, message: 'Categorys found', categorys });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const getOneCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const category = await Category.findById(id).where({ status: true });
        if (!category) return res.status(404).send({ success: false, message: 'Category not found' });
        return res.send({ success: true, message: 'Category found', category });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const data = req.body;
        const id = data.id;
        const category = await Category.findByIdAndUpdate(id, data, { new: true }).where({ status: true });
        if (!category) return res.status(404).send({ success: false, message: 'Category not found' });
        return res.send({ success: true, message: 'Category updated successfully', category });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const category = await Category.findById(id).where({ status: true });
        if (!category) return res.status(404).send({ success: false, message: 'Category not found' });
        if (category.name.toLowerCase() === 'uncategorized') return res.status(403).send({ success: false, message: 'Category uncategorized cannot be deleted' });
        defaultCategory(id);
        await Category.findByIdAndUpdate(id, { status: false }, { new: true });
        return res.send({ success: true, message: 'Category deleted successfully' });
    } catch (e) {
        console.error('Error completo:', e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}