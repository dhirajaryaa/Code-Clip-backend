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
    refreshToken: {
      type: String,
    },
    // knowLanguages: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Language',
    //   },
    // ],
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
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

// custom method to generate secure token for user 
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
};

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign({
    _id: this._id
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
};



export const User = mongoose.model('User', userSchema);
