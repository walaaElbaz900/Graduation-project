import userModel from "../../../DB/model/User.model.js";
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import joi from 'joi';

const signupValidationSchema = joi.object({
    firstname: joi.string().min(2).max(20).required(),
    lastname: joi.string().min(2).max(20).required(),
    email: joi.string()
        .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } })
        .required(),
    password: joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#&<>@"~;$^%{}?])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
    confirmationPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string()
        .pattern(/^(002|\+2)?01[0125][0-9]{8}$/)
        .required(),
    userType: joi.string().valid("patient", "doctor").required()
});

const loginValidationSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } })
        .required(),
    password: joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#&<>@"~;$^%{}?])(?=.*[a-zA-Z]).{8,}$/)
        .required()
});

export const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password, confirmationPassword, phone, userType } = req.body;

        const validationResult = signupValidationSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({ message: "Validation Error", validationResult: validationResult.error.details });
        }

        const checkUser = await userModel.findOne({ email });
        if (checkUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
        const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.PHONE_ENC).toString();

        const user = await userModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
            phone: encryptPhone,
            userType
        });

        return res.status(201).json({ message: "Done", user });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error, msg: error.message, stack: error.stack });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationResult = loginValidationSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({ message: "Validation Error", validationResult: validationResult.error.details });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid login data" });
        }

        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(404).json({ message: "Invalid login data" });
        }

        user.phone = CryptoJS.AES.decrypt(user.phone, process.env.PHONE_ENC).toString(CryptoJS.enc.Utf8);
        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.TOKEN_SIGNATURE);

        return res.status(200).json({ message: "Done", token });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error, msg: error.message, stack: error.stack });
    }
};
