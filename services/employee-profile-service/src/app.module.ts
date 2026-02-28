import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { UnleashService } from './feature-flags/unleash.service';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeGrpcController } from './grpc/employee.grpc.controller';
import { EmployeeEventsProducer } from './kafka/employee-events.producer';
import { EmployeeEventsConsumer } from './kafka/employee-events.consumer';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitMqModule],
  controllers: [EmployeeController, EmployeeGrpcController],
  providers: [EmployeeService, EmployeeEventsProducer, EmployeeEventsConsumer, UnleashService]
})
export class AppModule {}

