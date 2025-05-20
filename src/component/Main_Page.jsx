import React, {useState}from "react";
import axios from "axios";
import { toast } from 'react-toastify';

import "./Main_page.css";
export const Main_page = ()=>{


  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [seeNotifications, setSeeNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // <- new state for radio buttons
  
  const handleBack = () => {
    setSeeNotifications(false);
  };


  const handleSubmit = async (e) => {
  e.preventDefault(); // prevent page reload
  const action = e.nativeEvent.submitter.value; // Get clicked button

  console.log("Clicked button:", action);

  if(action === 'Send'){
  try {
    if(userName && message && notificationType && action){
    const response = await axios.post("http://localhost:5000/notifications", {
      userName,
      message,
      notificationType,
      action, // send action if needed
    });
    console.log("Server response:", response.data);
    toast.success("Notification sent successfully!");
    setUserName("");
    setMessage("");
    setNotificationType("");
  }
  else if(!userName){
    toast.error("Please enter the valid user name!");
  }
  else if(!message){
    toast.error("Please enter the valid message!");
  }
  else if(!notificationType){
    toast.error("Please select a valid notification type!");
  }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
  }
  

};





    return(

        <>
        <div id="main">
            {!seeNotifications?
            <form onSubmit={handleSubmit} className="my_form">
                
                <div className="div-msg">
                <label htmlFor="user_name">User Name</label>
                <input type="text" id="user_name" name="user_name" value={userName} onChange={(e)=>setUserName(e.target.value)}/> 
                
                <label htmlFor="message">Message</label>
                <input type="text" id="message" name="message" value={message} onChange={(e)=>setMessage(e.target.value)}/> 
                </div>
                <div className="radio-group">
                <label>Notification Type</label>
                <label htmlFor="SMS">
                <input type="radio" id="SMS" name="notificationType" value="SMS" checked={notificationType === "SMS"} onChange={(e)=>setNotificationType(e.target.value)} />
                SMS</label>
                
                <label htmlFor="Whats_App">
                <input type="radio" id="Whats_App" name="notificationType" value="Whats_App" checked={notificationType === "Whats_App"} onChange={(e)=>setNotificationType(e.target.value)} />
                WhatsApp</label>
                
                <label htmlFor="Email">
                <input type="radio" id="Email" name="notificationType" value="Email" checked={notificationType === "Email"} onChange={(e)=>setNotificationType(e.target.value)} />
                Email</label>
                
                <label htmlFor="In_App">
                <input type="radio" id="In_App" name="notificationType" value="In_App" checked={notificationType === "In_App"} onChange={(e)=>setNotificationType(e.target.value)} />
                In App</label>
                 
                </div>
                <div className="Buttons">
                <input type="submit" value="Send" name="action"/>
                <button type="button" className="notify-button" onClick={async () => {
                try {
                  if(userName){
                const response = await axios.get(`http://localhost:5000/users/${encodeURIComponent(userName)}/notifications`);
                if (response.data.status === "success") {
                setUserInfo(response.data.array);
                setSeeNotifications(true);
                console.log(response.data.array);
                } else if(response.data.status === "fail"){
                setUserInfo(null);
                toast.error(response.data.message);
                }
              }else{
                toast.error("Please enter the valid user name!");
              }
                }catch (error) {
                console.error("Error fetching notifications:", error);
                alert("Error fetching notifications!");
                }
              
                }}>Notifications</button>
                </div>
                </form>:<div className="notification-container">
                <h2 className="notification-title">Notification Center</h2>
               <ul className="notification-list">
               {userInfo.map((item) => (
               <li key={item.id} className="notification-item">
               <p><strong>To:</strong> {item.user_name}</p>
               <p><strong>Message:</strong> {item.message}</p>
               <p><strong>Type:</strong> {item.notification_type}</p>
               <p><strong>Action:</strong> {item.action}</p>
               <p><strong>Sent At:</strong> {new Date(item.sent_at).toLocaleString()}</p>
               </li>
            ))}
        </ul>
     <button className="back-button" onClick={handleBack}>Back</button>
</div>
}
</div>
</>
)
}