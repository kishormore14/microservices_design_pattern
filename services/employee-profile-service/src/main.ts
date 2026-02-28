import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Employee Profile Service')
    .setDescription('REST API for employee profile management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDoc);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hrms.employee.v1',
      protoPath: join(process.cwd(), 'proto', 'employee_service.proto'),
      url: process.env.GRPC_BIND_ADDRESS ?? '0.0.0.0:50051'
    }
  });

  await app.startAllMicroservices();
  const server = await app.listen(parseInt(process.env.PORT ?? '3000', 10));

  // Tune Node HTTP server defaults for high-throughput ingress.
  server.keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT_MS ?? '65000', 10);
  server.headersTimeout = parseInt(process.env.HEADERS_TIMEOUT_MS ?? '66000', 10);
  server.requestTimeout = parseInt(process.env.REQUEST_TIMEOUT_MS ?? '15000', 10);
}

void bootstrap();
