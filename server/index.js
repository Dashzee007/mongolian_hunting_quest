require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const authRoutes     = require('./routes/auth');
const animalRoutes   = require('./routes/animals');
const bookingRoutes  = require('./routes/bookings');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Frontend статик файлуудыг үйлчилнэ (project root)
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth',     authRoutes);
app.use('/api/animals',  animalRoutes);
app.use('/api/bookings', bookingRoutes);

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅  Server: http://localhost:${PORT}`);
});
