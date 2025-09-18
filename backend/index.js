const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./utils/db');

const app = express();

// Logging for debugging
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Headers:', req.headers);
  next();
});

// CORS fully open
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));

app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('PetBnB backend is working!'));

// Other routes...
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
  console.log('DB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
