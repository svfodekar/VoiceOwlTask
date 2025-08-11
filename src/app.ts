import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './config/db';
import injectMongoSession from './middlewares/mongoSession';
import jwtAuth from './middlewares/auth';
import routes from './routes'; 
//import publicRoutes from './publicRoutes'; // e.g., login, signup

dotenv.config();

const app = express();
app.use(express.json());
//app.use('/auth', publicRoutes);
app.use("/api", jwtAuth, injectMongoSession, routes);

connectToDB();

export default app;
