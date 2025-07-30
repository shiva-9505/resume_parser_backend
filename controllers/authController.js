const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv=require('dotenv');

dotenv.config();

const ADMIN_EMAIL = process.env.AdminEmail;
let otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendOTP = async (req, res) => {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[ADMIN_EMAIL] = { otp, expiresAt };

    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user: process.env.SenderEmail,
            pass: process.env.PassKey
        }
    });

    const mailOptions = {
        from: process.env.SenderEmail,
        to: ADMIN_EMAIL,
        subject: 'Your Admin OTP',
        text: `Your OTP is ${otp}. Valid for 5 minutes.`
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to admin email',otp });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
};

const verifyAdminOTP = (req, res) => {
    const { otp } = req.body;
    try {
        const record = otpStore[ADMIN_EMAIL];
    if (!record)
         return res.status(400).json({ message: 'OTP not generated' });

    if (record.otp !== otp) 
        return res.status(401).json({ message: 'Invalid OTP' });

    if (Date.now() > record.expiresAt) 
        return res.status(403).json({ message: 'OTP expired' });
    const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, process.env.WhatIsYourName, { expiresIn: '1h' });
    delete otpStore[ADMIN_EMAIL];

    res.status(200).json({ message: 'OTP verified', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error or otp not verified"})
    }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) 
        return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) 
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: existingUser._id, email: existingUser.email, role: existingUser.role },process.env.WhatIsYourName,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


const createUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) 
        return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'User creation failed', error: err.message });
  }
};


module.exports = { sendOTP, verifyAdminOTP,createUser, loginUser };
