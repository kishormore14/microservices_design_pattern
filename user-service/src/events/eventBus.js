const amqp = require("amqplib");

let channel = null;
let connection = null;

async function connectRabbitMQ(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      connection.on("error", (err) => {
        console.error("[RabbitMQ] Connection error:", err.message);
        channel = null;
      });
      connection.on("close", () => {
        console.warn("[RabbitMQ] Connection closed. Reconnecting...");
        channel = null;
        setTimeout(() => connectRabbitMQ(retries), 5000);
      });

      console.log("[RabbitMQ] Connected successfully");
      return channel;
    } catch (err) {
      console.warn(
        `[RabbitMQ] Connection attempt ${i + 1}/${retries} failed: ${err.message}`
      );
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error("[RabbitMQ] Failed to connect after retries");
}

async function publishEvent(exchange, routingKey, data) {
  if (!channel) {
    console.error("[RabbitMQ] Channel not available. Cannot publish.");
    return;
  }
  await channel.assertExchange(exchange, "topic", { durable: true });
  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
  console.log(`[RabbitMQ] Published to ${exchange}/${routingKey}`);
}

async function subscribeToEvent(exchange, routingKey, queueName, handler) {
  if (!channel) {
    console.error("[RabbitMQ] Channel not available. Cannot subscribe.");
    return;
  }
  await channel.assertExchange(exchange, "topic", { durable: true });
  const q = await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(q.queue, exchange, routingKey);

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        await handler(data);
        channel.ack(msg);
      } catch (err) {
        console.error(`[RabbitMQ] Error processing message:`, err.message);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(`[RabbitMQ] Subscribed to ${exchange}/${routingKey} via ${queueName}`);
}

function getChannel() {
  return channel;
}

module.exports = { connectRabbitMQ, publishEvent, subscribeToEvent, getChannel };
