import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Employee } from '../employee.service';

@Injectable()
export class EmployeeEventsProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmployeeEventsProducer.name);
  private readonly enabled = (process.env.KAFKA_ENABLED ?? 'false') === 'true';
  private readonly kafka = new Kafka({
    clientId: 'employee-profile-service',
    brokers: (process.env.KAFKA_BROKERS ?? 'kafka:9092').split(',')
  });
  private producer?: Producer;

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('Kafka producer disabled via KAFKA_ENABLED=false');
      return;
    }
    this.producer = this.kafka.producer();
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.warn(`Kafka producer unavailable: ${(error as Error).message}`);
      this.producer = undefined;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publishEmployeeCreated(employee: Employee): Promise<void> {
    if (!this.producer) {
      this.logger.warn('Kafka producer not ready, skipping event publish');
      return;
    }

    await this.producer.send({
      topic: process.env.EMPLOYEE_EVENTS_TOPIC ?? 'hrms.employee.events.v1',
      messages: [
        {
          key: employee.id,
          value: JSON.stringify({
            eventType: 'EMPLOYEE_CREATED',
            schemaVersion: '1.0.0',
            occurredAt: new Date().toISOString(),
            payload: employee
          })
        }
      ]
    });
  }
}
