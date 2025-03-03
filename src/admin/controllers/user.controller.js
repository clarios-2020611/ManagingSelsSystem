import { objectIdValid } from '../../../helpers/db.validator.js';
import { encrypt } from '../../../utils/encrypt.js';
import User from '../../models/user/user.model.js';

export const createAdmin = async () => {
    try {
        let data = {
            name: process.env.NAME,
            lastname: process.env.LASTNAME,
            username: process.env.USER_NAME,
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            role: process.env.ROLE
        };
        data.password = await encrypt(data.password);
        if (await User.findOne({ name: process.env.NAME })) return console.log('Admin already exist');
        let user = new User(data);
        await user.save();
        return console.log('Admin created successfully');
    } catch (e) {
        console.log(e);
    }
}

export const createUser = async (req, res) => {
    try {
        let data = req.body;
        let user = new User(data);
        user.password = await encrypt(user.password);
        await user.save();
        return res.send({ success: true, message: `User create successfully, can be logged with username: ${user.username}` });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const updateRol = async (req, res) => {
    try {
        let { id, role } = req.body;
        objectIdValid(id);
        let user = await User.findOneAndUpdate({ _id: id, status: true }, { role }, { new: true });
        if (!user) return res.status(404).send({ success: false, message: 'User not found' });
        return res.send({ success: true, message: 'User updated successfully', user });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const update = async (req, res) => {
    try {
        let { id, data } = req.body;
        objectIdValid(id);
        let user = await User.findOneAndUpdate({ _id: id, status: true }, data, { new: true });
        if (!user) return res.status(404).send({ success: false, message: 'User not found' });
        return res.send({ success: true, message: 'User upadted successfully', user });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const deleteUser = async (req, res) => {
    try {
        let { id } = req.body;
        let status = false;
        objectIdValid(id);
        let user = await User.findOneAndUpdate({ _id: id, status: true }, { status }, { new: true });
        return res.send({ success: true, message: 'User deleted successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}

export const getAll = async (req, res) => {
    try {
        let { limit = 15, skip = 0 } = req.query;
        let users = await User.find().limit(limit).skip(skip).where({ status: true });
        if (!users) return res.status(404).send({ success: true, message: 'Users not found' });
        return res.send({ success: true, message: `Users found ${users}` });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success: false, message: 'General error', e });
    }
}