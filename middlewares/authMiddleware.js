const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv=require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.WhatIsYourName);

        if (decoded.role === 'admin') {
            if (decoded.email !== process.env.AdminEmail) {
                return res.status(401).json({ message: 'Invalid admin token' });
            }
            req.user = { email: decoded.email, role: decoded.role };
            return next();
        }
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
