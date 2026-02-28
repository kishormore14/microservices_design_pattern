import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import amqp, { Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private readonly enabled = (process.env.RABBITMQ_ENABLED ?? 'false') === 'true';
  private connection?: Connection;
  private channel?: Channel;

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('RabbitMQ disabled via RABBITMQ_ENABLED=false');
      return;
    }
    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('hrms.commands', 'direct', { durable: true });
      await this.channel.assertQueue('hrms.email.retry', {
        durable: true,
        deadLetterExchange: 'hrms.dlx'
      });
      await this.channel.assertExchange('hrms.dlx', 'fanout', { durable: true });
      await this.channel.assertQueue('hrms.dlq', { durable: true });
      await this.channel.bindQueue('hrms.dlq', 'hrms.dlx', '');

      this.logger.log('RabbitMQ connected');
    } catch (error) {
      this.logger.warn(`RabbitMQ unavailable: ${(error as Error).message}`);
      this.channel = undefined;
      this.connection = undefined;
    }
  }

  async publishCommand(routingKey: string, payload: Record<string, unknown>): Promise<void> {
    if (!this.channel) return;
    this.channel.publish('hrms.commands', routingKey, Buffer.from(JSON.stringify(payload)), {
      contentType: 'application/json',
      persistent: true,
      messageId: String(payload['commandId'] ?? Date.now())
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
