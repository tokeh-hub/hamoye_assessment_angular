import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import { SigninComponent } from './components/signin/signin.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { PromptComponent } from './components/prompt/prompt.component'

const routes: Routes = [
  {path:'',component: LoginComponent},
  // {path:'login',component: LoginComponent},
  {path:'signin',component: SigninComponent},
  {path:'dashboard',component: DashboardComponent},
  {path:'prompt',component: PromptComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
