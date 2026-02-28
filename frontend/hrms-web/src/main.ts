import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="layout">
      <h1>HRMS Platform</h1>
      <p>Production scaffold for Angular + NestJS microservices.</p>
    </main>
  `
})
class AppComponent {}

const routes: Routes = [];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch((err: unknown) => console.error(err));
