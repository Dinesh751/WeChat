import dotenv from "dotenv"
import { createClient } from 'redis';

dotenv.config()

// Create a Redis client
const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected Successfully'));

await client.connect();

// Create duplicate clients for Pub/Sub
const subscriber = client.duplicate();
const publisher = client.duplicate();

await subscriber.connect();
await publisher.connect();

// Function to subscribe to a Redis channel
export function subscribe(channel, callback) {
  subscriber.subscribe(channel, (message) => {
    console.log(`Received message on ${channel}: ${message}`);
    callback(message);
  });
}

// Function to unsubscribe from a Redis channel
export function unsubscribe(channel) {
  subscriber.unsubscribe(channel, (err) => {
    if (err) {
      console.error('Error unsubscribing from channel:', err);
      return;
    }
    console.log(`Unsubscribed from ${channel}`);
  });
}

// Function to publish a message to a Redis channel
export async function publish(channel, message) {
  try {
    await publisher.publish(channel, message);
    console.log(`Published message to ${channel}: ${message}`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}
