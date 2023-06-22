import nodemailer from 'nodemailer';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from "lib/mongodb";
import { nanoid } from 'nanoid';

export default async (req, res) => {

  const { email } = req.body;
  console.log('req.body',req.body)
 console.log('email',email)
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ email });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const token = nanoid(32);

  const tokensCollection = db.collection('tokens');
  await tokensCollection.insertOne({
    token,
    type: 'passwordReset',
    userId: user._id.toString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  const transporter = nodemailer.createTransport({
    /* host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    }, */
    service: "gmail",
    auth: {
      user: "kleanvetapp@gmail.com",
      pass: "sepxytdrdffhotwq",
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/re?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    html: `En el siguiente link podras actualizar tu contraseña ${resetUrl}`
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'Password reset email sent' });


};