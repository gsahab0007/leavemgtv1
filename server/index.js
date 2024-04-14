import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import leaveRoute from './routes/leaveRoute.js'
import userRoute from './routes/userRoute.js'
import connectDB from './config/db.js';
import cors from 'cors';



const port = process.env.PORT || 5000;
connectDB();
const app = express();

app.use(cors({
    origin: ['https://leavemgtv1v1.vercel.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/api/v1/leave', leaveRoute);
app.use('/api/v1/user', userRoute);


app.listen(port, () => {
    console.log('Server is listning at port ', port);
});
