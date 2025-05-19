import { producer } from "./kafkaClient.js";

export const sendNotificationMessage = async (notification) => {
  
  await producer.send({
    topic: 'notifications',
    messages: [{ value: JSON.stringify(notification) }],
  });
};