import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class EmployeeEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmployeeEventsConsumer.name);
  private readonly enabled = (process.env.KAFKA_ENABLED ?? 'false') === 'true';
  private readonly kafka = new Kafka({
    clientId: 'employee-profile-service-consumer',
    brokers: (process.env.KAFKA_BROKERS ?? 'kafka:9092').split(',')
  });
  private consumer?: Consumer;

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('Kafka consumer disabled via KAFKA_ENABLED=false');
      return;
    }
    this.consumer = this.kafka.consumer({ groupId: 'employee-profile-audit-v1' });
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: process.env.EMPLOYEE_AUDIT_TOPIC ?? 'hrms.employee.audit.v1' });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log(
            `Consumed from ${topic}/${partition}: ${message.key?.toString() ?? 'n/a'} ${message.value?.toString() ?? ''}`
          );
        }
      });
    } catch (error) {
      this.logger.warn(`Kafka consumer unavailable: ${(error as Error).message}`);
      this.consumer = undefined;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
