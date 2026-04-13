import express from 'express';
import cors from 'cors';
import { vehicleRouter } from './routes/vehicle';

export const app = express();

app.use(cors());
app.use('/api/vehicle', vehicleRouter);
