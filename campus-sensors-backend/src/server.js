import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import areasRouter from './routes/areas.js';
import sensorsRouter from './routes/sensors.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/areas', areasRouter);
app.use('/api/sensors', sensorsRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.sqlMessage) console.error('SQL:', err.sqlMessage);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
