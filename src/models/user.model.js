import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      toLowerCase: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    avatar: {
      //cloudinary url
      type: String,
      required: true,
    },
    coverImage: {
      //cloudinary url
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      //user set status
      type: String,
    },
    score: {
      type: Number,
      default: 0,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    knowLanguages: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Language',
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
