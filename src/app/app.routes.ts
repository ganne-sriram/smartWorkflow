import { Routes } from '@angular/router';
import { DesignProcessFlowComponent } from './pages/design-process-flow/design-process-flow.component';
import { AvailableWorkflowsComponent } from './pages/available-workflows/available-workflows.component';

export const routes: Routes = [
  { path: '', redirectTo: '/design-process-flow', pathMatch: 'full' },
  { path: 'design-process-flow', component: DesignProcessFlowComponent },
  { path: 'available-workflows', component: AvailableWorkflowsComponent }
];
