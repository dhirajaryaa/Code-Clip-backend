import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    snippetId: {
      type: mongoose.Types.ObjectId,
      ref: 'Snippet',
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
