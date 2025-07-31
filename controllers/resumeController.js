const Resume = require('../models/Resume');
const { create } = require('../models/User');
const { parseResume } = require('../utils/parseResume');
const path = require('path');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const filePath = req.file.path;
    const parsedData = await parseResume(filePath);

    const newResume = new Resume({
      user: req.user._id,
      filePath,
      ...parsedData,
    });

    await newResume.save();

    res.status(201).json({ message: 'Resume uploaded and parsed successfully', resume: newResume });
  } catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
};

const viewAllResumes = async (req, res) => {
  try {
    
    const resumes = await Resume.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'failed to fetch resumes', error: error.message });
  }
}

module.exports = { uploadResume, viewAllResumes };
