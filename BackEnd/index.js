import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./DB_Config/db.js";
import { sendEmail } from "./Send_Notification/Email.js";
import { sendSMS } from "./Send_Notification/SMS.js";
import { sendWhatsApp } from "./Send_Notification/WhatsApp.js";

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

app.post("/notifications", async(req, res)=>{
    console.log(req.body);
    const {userName, message, notificationType, action} = req.body;
    if(req.body.notificationType ===  'Email'){
        await sendEmail({
            to:"22053660@kiit.ac.in",
            subject:"Notification",
            html:`
        <p>Dear <strong>${req.body.userName}</strong>,</p>
        <p>${req.body.message}</p>
        <br />
        <hr />
        <p>Sent from <b><i>Automatic Notification Service System</i></b></p>
        `
        });
        await pool.query(
        'INSERT INTO notifications (user_name, message, notification_type, action) VALUES ($1, $2, $3, $4)',
        [userName, message, notificationType, action]
        );
    }
    else if(req.body.notificationType === 'SMS'){
        await sendSMS({to:'+91 95472 56351', userName:req.body.userName,message:req.body.message});
        await pool.query(
        'INSERT INTO notifications (user_name, message, notification_type, action) VALUES ($1, $2, $3, $4)',
        [userName, message, notificationType, action]
        );
    }
    else if(req.body.notificationType === 'Whats_App'){
        await sendWhatsApp({to:'+919547256351', body: req.body.message, userName:req.body.userName});
        await pool.query(
        'INSERT INTO notifications (user_name, message, notification_type, action) VALUES ($1, $2, $3, $4)',
        [userName, message, notificationType, action]
        );
    }
    else if(req.body.notificationType === 'In_App'){
        await pool.query(
        'INSERT INTO notifications (user_name, message, notification_type, action) VALUES ($1, $2, $3, $4)',
        [userName, message, notificationType, action]
    );


    }
    res.json({msg:"Received Successfully !"});
})

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
});
