import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { initialize, isEnabled, destroy } from 'unleash-client';

@Injectable()
export class UnleashService implements OnModuleInit, OnModuleDestroy {
  onModuleInit(): void {
    initialize({
      url: process.env.UNLEASH_URL ?? 'http://unleash.unleash.svc.cluster.local:4242/api',
      appName: 'employee-profile-service',
      customHeaders: {
        Authorization: process.env.UNLEASH_API_TOKEN ?? ''
      }
    });
  }

  isFeatureEnabled(flagName: string, userId: string): boolean {
    return isEnabled(flagName, { userId });
  }

  onModuleDestroy(): void {
    destroy();
  }
}
