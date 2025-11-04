import { Routes } from '@angular/router';
import { DesignProcessFlowComponent } from './pages/design-process-flow/design-process-flow.component';
import { AvailableWorkflowsComponent } from './pages/available-workflows/available-workflows.component';
import { ProcessFlowInfoComponent } from './pages/process-flow-info/process-flow-info.component';
import { WorkspaceWizardComponent } from './pages/workspace-wizard/workspace-wizard.component';
import { TemplateBuilderComponent } from './pages/template-builder/template-builder.component';
import { WorkflowCompletionComponent } from './pages/workflow-completion/workflow-completion.component';
import { TestRunnerComponent } from './pages/test-runner/test-runner.component';
import { TestSummaryComponent } from './pages/test-summary/test-summary.component';
import { TemplateLibraryComponent } from './pages/template-library/template-library.component';
import { ImportWorkflowComponent } from './pages/import-workflow/import-workflow.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'design-process-flow', component: DesignProcessFlowComponent, canActivate: [authGuard] },
  { path: 'available-workflows', component: AvailableWorkflowsComponent, canActivate: [authGuard] },
  { path: 'process-flow-info', component: ProcessFlowInfoComponent, canActivate: [authGuard] },
  { path: 'workspace-wizard', component: WorkspaceWizardComponent, canActivate: [authGuard] },
  { path: 'template-builder', component: TemplateBuilderComponent, canActivate: [authGuard] },
  { path: 'workflow-completion', component: WorkflowCompletionComponent, canActivate: [authGuard] },
  { path: 'test-runner/:templateId', component: TestRunnerComponent, canActivate: [authGuard] },
  { path: 'test-summary/:testRunId', component: TestSummaryComponent, canActivate: [authGuard] },
  { path: 'template-library', component: TemplateLibraryComponent, canActivate: [authGuard] },
  { path: 'import-workflow', component: ImportWorkflowComponent, canActivate: [authGuard] }
];
