import Product from '../../models/product/product.model.js';

export const findByCategory = async (req, res) => {
    try {
        let { category } = req.body;
        let products = Product.find({ category }).populate('category', '-_id -description -__v -status');
        if (!products) return res.status(404).send({ success: false, message: 'Products not found' });
        return res.send({ success: true, message: 'Products found', products });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}