import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  profileImage: {
    data: Buffer, // Binary data of the image
    contentType: String, // MIME type of the image
  },
  role:{
    type: String,
    enum:["user","admin"],
    default: "user"
  }
});

const User = mongoose.model('User', userSchema);

export default User;

