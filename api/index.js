import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import roleRoute from './routes/role.js'
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use('/', (req, res)=>{
//     return res.send("<h1>Authentication Project</h1> <h3>Don't forget to delete these lines from index.js</h3>");
// })
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

// Response handling Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong...";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    })
});

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('open', () => console.log('DB is connected!'))



app.listen(3000, ()=>{ 
    console.log('Server is listening on port 3000');
});