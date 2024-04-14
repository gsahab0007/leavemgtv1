import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorize http, token not provided !" });
    }
    const jwtToken = token.replace("Bearer", "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECKEY);

        const userData = await userModel.findOne({ email: isVerified.email }).select({ password: 0 });

        req.token = token;
        req.user = userData;
        req.userId = userData._id

        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorize http, token not provided !" });
    }


}

export default authMiddleware;