const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roleMiddleware = require('./middleware/roleMiddleware');


require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/admin', roleMiddleware(['Admin']), (req, res) => res.send('Admin Access'));
app.get('/moderator', roleMiddleware(['Admin', 'Moderator']), (req, res) => res.send('Moderator Access'));
app.get('/user', roleMiddleware(['User', 'Admin', 'Moderator']), (req, res) => res.send('User Access'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
