const cron = require('node-cron');
const Message = require('../models/Message');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Schedule job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    console.log('Current server time:', now); 
    
    const messagesToDeliver = await Message.find({
      deliveryDate: { $lte: now },
      isDelivered: false,
    }).populate('sender', ['name', 'email']);

    for (const message of messagesToDeliver) {
      // Mark message as delivered
      message.isDelivered = true;
      message.deliveredAt = new Date();
      await message.save();

      // Check if recipient has an account
      const recipient = await User.findOne({ email: message.recipientEmail });

      // Send email
      const mailOptions = {
        from: `"Time Capsule" <${process.env.EMAIL_USER}>`,
        to: message.recipientEmail,
        subject: `Time Capsule: ${message.subject}`,
        html: `
          <h1>${message.subject}</h1>
          <p>${message.body}</p>
          <p>This message was sent to you by ${message.sender.name} (${message.sender.email}) on ${message.createdAt.toDateString()}</p>
          ${recipient ? `<p>View this message in your Time Capsule inbox: <a href="${process.env.FRONTEND_URL}/inbox">Click here</a></p>` : ''}
        `,
      };

      await transporter.sendMail(mailOptions);

      // Log this activity
      const log = new ActivityLog({
        user: message.sender._id,
        action: 'message_delivered',
        details: `Delivered message ${message._id} to ${message.recipientEmail}`,
      });
      await log.save();
    }
  } catch (err) {
    console.error('Error in message scheduler:', err.message);
  }
});

console.log('Message scheduler initialized');