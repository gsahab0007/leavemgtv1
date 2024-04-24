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
        if (isVerified) {
            const userData = await userModel.findOne({ email: isVerified.email }).select({ password: 0 });

            req.token = token;
            req.user = userData;
            req.userId = userData._id
            next();
        }

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            // Handle expired token scenario
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        } else {
            // Handle other JWT verification errors
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
    }


}

export default authMiddleware;