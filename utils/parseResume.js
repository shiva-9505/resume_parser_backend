const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractInfo = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(?:\+91[-\s]?)?[6-9]\d{9}/;
  const skillKeywords = ['Java','JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'C++', 'HTML', 'CSS'];
  const educationKeywords = ['B.Tech', 'M.Tech', 'Bachelor', 'Master', 'Degree', 'Graduation', 'Intermediate','SSC','Inter','10th class'];
  const experienceRegex = /(experience|worked|company|years)[^\n]{0,150}/i;

  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  const skills = skillKeywords.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  const education = educationKeywords.find(edu => text.includes(edu)) || '';
  const experience = text.match(experienceRegex)?.[0] || '';

  return {
    email,
    phone,
    skills,
    education,
    experience
  };
};

const parseResume = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const text = data.text;

  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const name = lines[0] || 'Unknown';

  const extracted = extractInfo(text);

  return {
    name,
    ...extracted
  };
};

module.exports = { parseResume };
