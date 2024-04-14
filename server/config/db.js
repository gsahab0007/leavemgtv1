import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const mongoDB = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDB);
        console.log('MongoDB connected !');
    } catch (error) {
        console.log('Error in connect MongoDB', error);
        process.exit(1);
    }
}

export default connectDB;
