import mongoose from 'mongoose';

const leaderboardSchema = mongoose.Schema(
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
    score:{
        type:Number,
        default:0
    }
  },
  
);

export const Comment = mongoose.model('Comment', leaderboardSchema);
 