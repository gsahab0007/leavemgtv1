import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const dev_db_url = "mongodb://127.0.0.1:27017/leavemgt";
const mongoDB = process.env.MONGODB_URL || dev_db_url;

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
