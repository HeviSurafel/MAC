const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../Model/User.model');
const redis = require('../Middleware/Redis');
const transporter = require('../config/nodemailer');
const Contact=require("../Model/ContactUs.model")
// Generate tokens
const generateToken = async (userId) => {
  const accessToken = jwt.sign({ userId }, "accessTokenSecret", {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, "refreshTokenSecret", {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
};

// Store tokens in cookies
const storeCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Signup
const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ firstName, lastName, email, password });
    const { accessToken, refreshToken } = await generateToken(user._id);
    storeCookies(res, accessToken, refreshToken);
    await storeRefreshToken(user._id, refreshToken);
    res.status(201).json({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Something went wrong',error });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const { accessToken, refreshToken } = await generateToken(user._id);
    storeCookies(res, accessToken, refreshToken);
    await storeRefreshToken(user._id, refreshToken);
    res.status(200).json({
      id: user._id,
      name: user.firstName,
      lastName: user.lastName,
      phone: user.phoneNumber,
      email: user.email,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Logout
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) {
      const decode = jwt.verify(refreshToken, "refreshTokenSecret");
      await redis.del(`refresh_token:${decode.userId}`);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.status(401).json({ message: 'No token found' });
    }
    const decoded = jwt.verify(refreshToken, "refreshTokenSecret");
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (refreshToken !== storedToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const { accessToken } = await generateToken(decoded.userId);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get All Users (Admin Only)
const getAllUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin only' });
    }
    const users = await User.find({ _id: { $ne: req.user._id }, role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: "surafelwondu47@gmail.com",
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested a password reset for your account.\n\n
        Please click on the following link, or paste it into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Request Password Reset Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const updatePassword = async (req, res) => {
  const {oldPassword,newpassword,email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch){
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    user.password = newpassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update Password Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const updateProfile = async (req, res) => {
  const {email}=req.user
  const { address, phone } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.address =user.address;
    user.phone = phone;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const ContactUs = async (req, res) => {
  const {name,subject, email, message } = req.body;
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error. Try again later." });
  }
}
module.exports = {
  signup,
  login,
  ContactUs,
  logout,
  updateProfile,
  refreshToken,
  getProfile,
  getAllUser,
  requestPasswordReset,
  resetPassword,updatePassword
};