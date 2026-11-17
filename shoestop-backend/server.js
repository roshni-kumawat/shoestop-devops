const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/connectDB');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
dotenv.config();

const port = process.env.port || process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
        status: 'UP',
        service: 'shoestop-backend',
        uptime: ${Math.floor(process.uptime())}s,
        memoryRSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB,
        database: dbState,
        timestamp: new Date().toISOString()
    });
});

app.use('/', userRoutes);
app.use('/api', productRoutes);

const startServer = async () => {
    try {
        await connectDB(process.env.mongoURI);
        console.log('connected to db');
        app.listen(port, () => {
            console.log(server started at );
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();