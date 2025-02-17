const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

router.post('/forget-password', async (req, res) => {
  const { email } = req.body;
  try {
    console.log('Processing password reset for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(404).send('User not found');
    }
    console.log('User found:', user);

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated reset token:', resetToken);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    console.log('User updated with reset token:', user);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Created email transporter.');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click on this link to reset your password: http://localhost:5173/reset-password/${resetToken}`
    };
    console.log('Mail options:', mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent to:', email);
      res.send('Email sent');
    });
  } catch (error) {
    console.error('Error processing forget password request:', error);
    res.status(500).send('Error processing forget password request');
  }
});

router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      console.error('Invalid or expired token:', token);
      return res.status(400).send('Invalid or expired token');
    }
    res.send('Token is valid');
  } catch (error) {
    console.error('Error processing reset password token:', error);
    res.status(500).send('Error processing reset password token');
  }
});


router.post('/update-password', async (req, res) => {
  const { newPassword, token, email } = req.body;
  try {
    console.log('Received request to update password for email:', email);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      console.error('Invalid or expired token:', token);
      return res.status(400).send('Invalid or expired token');
    }

    console.log('User found:', user.email);
    user.password = bcrypt.hashSync(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password updated successfully for email:', email);
    res.send('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Error updating password');
  }
});

module.exports = router;