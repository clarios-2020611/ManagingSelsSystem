import { Schema, model } from "mongoose";

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        lastname: {
            type: String,
            required: [true, 'Lastname is required']
        },
        username:{
            type: String,
            required: [true, 'Username is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be 8 charactres'],
            maxlength: [100, `Can't be overcome 100 characteres`],
            match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm]
        },
        role: {
            type: String,
            enum: ['ADMIN', 'CLIENT'],
            default: 'CLIENT'
        },
        status: {
            type: Boolean,
            default: true
        }
    }
);

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    return user;
}

export default model('User', userSchema);