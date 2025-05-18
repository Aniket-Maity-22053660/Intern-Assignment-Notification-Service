import twilio from "twilio"
import dotenv from "dotenv"

dotenv.config();

export const sendSMS = ({to, userName, message})=>{
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);
try{
client.messages
    .create({
        body:`Dear ${userName}\n\n${message}`,
        from:'+19135657839',
        to
    })
    .then(message => console.log(message.sid));
}
catch(err){
    console.log("Error sending SMS: ", err);
}
}