import { consumer } from './kafkaClient.js';
import { sendEmail } from '../Send_Notification/Email.js';
import { sendSMS } from '../Send_Notification/SMS.js';
import { sendWhatsApp } from '../Send_Notification/WhatsApp.js';
import { pool } from '../DB_Config/db.js';

export const startNotificationWorker = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notifications', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      try {
        const { userName, message, notificationType, action } = data;

        if (notificationType === 'Email') {
          await sendEmail({
            to: "22053660@kiit.ac.in",
            subject: "Notification",
            html: `<p>Dear <b>${userName}</b>,<br>${message}</p>`
          });
        } else if (notificationType === 'SMS') {
          await sendSMS({ to: '+919547256351', userName, message });
        } else if (notificationType === 'Whats_App') {
          await sendWhatsApp({ to: '+919547256351', userName, body: message });
        }

        await pool.query(
          'INSERT INTO notifications (user_name, message, notification_type, action) VALUES ($1, $2, $3, $4)',
          [userName, message, notificationType, action]
        );

      } catch (err) {
        console.error("Failed to process notification:", err);
      }
    }
  });
};