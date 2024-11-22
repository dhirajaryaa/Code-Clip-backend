import mongoose from 'mongoose';

const tagColors = Object.freeze([
  { name: 'primaryBlue', color: '#007BFF' },
  { name: 'successGreen', color: '#28A745' },
  { name: 'warningYellow', color: '#FFC107' },
  { name: 'dangerRed', color: '#DC3545' },
  { name: 'infoCyan', color: '#17A2B8' },
  { name: 'purpleViolet', color: '#6F42C1' },
  { name: 'orange', color: '#FD7E14' },
  { name: 'tealGreen', color: '#20C997' },
  { name: 'gray', color: '#6C757D' },
  { name: 'pinkRose', color: '#E83E8C' },
]);

const tag = mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    toLowerCase: true,
    trim: true,
    index: true,
  },
  tagColor: {
    type: String,
    enum: tagColors.map((t) => t.name),
    default: 'gray',
    required: true,
  },
  description: {
    type: String,
    trim: true,
    toLowerCase: true,
  },
});

export const Tag = mongoose.model('Tag', tag);
