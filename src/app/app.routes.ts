import { Routes } from '@angular/router';
import { DesignProcessFlowComponent } from './pages/design-process-flow/design-process-flow.component';
import { AvailableWorkflowsComponent } from './pages/available-workflows/available-workflows.component';
import { ProcessFlowInfoComponent } from './pages/process-flow-info/process-flow-info.component';
import { WorkspaceWizardComponent } from './pages/workspace-wizard/workspace-wizard.component';
import { WorkflowCompletionComponent } from './pages/workflow-completion/workflow-completion.component';
import { TestRunnerComponent } from './pages/test-runner/test-runner.component';
import { TestSummaryComponent } from './pages/test-summary/test-summary.component';
import { TemplateLibraryComponent } from './pages/template-library/template-library.component';

export const routes: Routes = [
  { path: '', redirectTo: '/design-process-flow', pathMatch: 'full' },
  { path: 'design-process-flow', component: DesignProcessFlowComponent },
  { path: 'available-workflows', component: AvailableWorkflowsComponent },
  { path: 'process-flow-info', component: ProcessFlowInfoComponent },
  { path: 'workspace-wizard', component: WorkspaceWizardComponent },
  { path: 'workflow-completion', component: WorkflowCompletionComponent },
  { path: 'test-runner/:templateId', component: TestRunnerComponent },
  { path: 'test-summary', component: TestSummaryComponent },
  { path: 'template-library', component: TemplateLibraryComponent }
];
