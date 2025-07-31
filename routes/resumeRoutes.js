const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload-resume', verifyToken, upload.single('file'), resumeController.uploadResume);
router.get('/all',resumeController.viewAllResumes);

module.exports = router;
