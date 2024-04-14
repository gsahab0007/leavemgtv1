import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({ message: "All Fields required !!" });
    }
    try {
        const response = await userModel.findOne({ email, password }).select({ password: 0 });
        if (!response) {
            return res.status(400).json({ message: "Invalid User !" });
        }

        const token = jwt.sign({ email, _id: response._id }, process.env.JWT_SECKEY, { expiresIn: '1h' });
        // res.setcookie('jwttoken', token, { maxAge: 6000000, httpOnly: true })

        res.status(200).json({ token, message: "Login Successful !", response });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error in Login" });
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successfully !" });
}
export { userLogin, logout }