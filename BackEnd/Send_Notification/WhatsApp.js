import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config();

export const sendWhatsApp = async ({to, body, userName})=>{

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

try{
    const message = await client.messages.create({
        from:'whatsapp:+14155238886',
        to: `whatsapp:${to}`,
        body: `*Dear ${userName},*\n\n${body}\n\n--------------------------------------------------------------\n_Sent via Automatic Notification Service System._`
    });
    console.log("Messgae SID: ", message.sid);
}
catch(err){
    console.log("Error sending message: ",err.message);
}
}