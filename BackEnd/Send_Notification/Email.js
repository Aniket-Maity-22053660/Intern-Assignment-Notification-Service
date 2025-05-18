import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
});

export const sendEmail = async ({to, subject, text, html})=>{
    try{
        const info = await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject,
            text,
            html
        });
        console.log("Email sent: ", info.response);
    }
    catch(err){
        console.log("Error sending email: ",err);
    }
}
