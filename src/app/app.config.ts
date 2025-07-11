import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

import { KanbanComponent } from './components/kanban/kanban.component';

 // asegúrate que este sea el path correcto

const routes: Routes = [
  { path: '', component: KanbanComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes) // Esto es lo que activa las rutas
  ]
};
