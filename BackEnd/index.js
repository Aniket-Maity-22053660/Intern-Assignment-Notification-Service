import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./DB_Config/db.js";
import { sendEmail } from "./Send_Notification/Email.js";
import { sendSMS } from "./Send_Notification/SMS.js";
import { sendWhatsApp } from "./Send_Notification/WhatsApp.js";
import { sendNotificationMessage } from './kafka/producer.js';
import { startNotificationWorker } from './kafka/consumer.js';
import { producer } from './kafka/kafkaClient.js';

(async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected.");
  } catch (err) {
    console.error("Producer connection error:", err);
  }
})();

dotenv.config();

const app = express();
const PORT = process.env.PORT||5000;

app.use(cors(
    {
        origin:"http://localhost:5173"
    }
));
app.use(express.json());
app.use(express.urlencoded({extended:true})); // Parses incoming JSON requests
app.use(express.static("public"));

app.post("/notifications", async (req, res) => {
  const { userName, message, notificationType, action } = req.body;

  try{
  await sendNotificationMessage({ userName, message, notificationType, action });
  }catch(err){
    console.log(err);
  }
  res.json({ msg: "Notification enqueued successfully!" });
});

app.get("/users/:username/notifications", async (req, res) => {
  const userName = decodeURIComponent(req.params.username);

  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_name = $1 ORDER BY sent_at DESC`,
      [userName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No notifications found for user: ${userName}`,
      });
    }

    res.json({
      status: "success",
      array: result.rows,
    });

  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/test-api/:name", (req, res)=>{
    const {name} = req.params;
    console.log(`Name:${name}`);
    res.json({msg:"received successsfully!"});
})

app.get("/", (req, res)=>{
    res.send("BackEnd is running successfully!");
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startNotificationWorker();
});
