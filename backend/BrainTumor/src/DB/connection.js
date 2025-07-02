import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI).then(res => {
        console.log(`DB connected`);
    }).catch(err => {
        console.error(`Fail to connect on DB`, err);
    });
};

export default connectDB;