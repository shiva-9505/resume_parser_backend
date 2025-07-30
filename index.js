const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
// const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const resumeRoutes=require('./routes/resumeRoutes')
// const userRoutes = require('./routes/userRoutes');
const bodyParser=require('body-parser');

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume',resumeRoutes);
// app.use('/api/user', userRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));