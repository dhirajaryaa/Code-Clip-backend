import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

// adding middleware for encrypt my password 
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//create custom method to check password is right or not  
userSchema.model.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

// custom method to generate secure token for user 
userSchema.model.generateAccessToken = async () => {
  return jwt.sign({
    _id: this._id,
    fullName: this.password,
    username: this.username,
    email: this.email
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
};

userSchema.model.generateRefreshToken = async () => {
  return jwt.sign({
    _id: this._id
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
};



export const User = mongoose.model('User', userSchema);
