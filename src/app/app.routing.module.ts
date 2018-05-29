import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroesComponent } from './component/hero/heroes/heroes.component';
import { HeroComponent } from './component/hero/hero.component';
import { DashboardComponent} from './component/hero/dashboard/dashboard.component';
import { SearchComponent } from './component/hero/search/search.component';
import { Page404Component } from './component/page404/page404.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { ModifyPasswordComponent } from './component/user/modify-password/modify-password.component';
import { ForgetPasswordComponent } from './component/user/forget-password/forget-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:id', component: HeroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'modifyPassword', component: ModifyPasswordComponent },
  { path: '**', component: Page404Component },
];

/**
 * 路由模块
 * 让 Angular 知道 AppRoutingModule 是一个路由模块，
 * 而 forRoot() 表示这是一个根路由模块
 * 它会配置你传入的所有路由、让你能访问路由器指令并注册 RouterService
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
