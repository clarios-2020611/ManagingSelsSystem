import { objectIdValid } from "../../../helpers/db.validator.js";
import Invoice from '../../models/invoice/invoice.model.js';

export const getPurchaseHistory = async (req, res) => {
    try {
        const { id } = req.body;
        const { limit = 15, skip = 0 } = req.query;
        objectIdValid(id);
        let user = findOne({ _id: id });
        if (!user) return res.status(404).send({ success: false, message: 'User not found' });
        const filters = { user: id };
        const invoices = await Invoice.find(filters)
            .populate({ path: 'items.productId', select: 'name description price category' })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        return res.send({})
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}