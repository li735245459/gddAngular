import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorComponent} from '../component/error/error.component';
import {LoginComponent} from '../component/user/login/login.component';
import {RegisterComponent} from '../component/user/register/register.component';
import {ModifyPasswordComponent} from '../component/user/modify-password/modify-password.component';
import {ForgetPasswordComponent} from '../component/user/forget-password/forget-password.component';
import {RoutingGuardService} from './routing.guard.service';
import {HomeComponent} from '../component/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  {path: 'modifyPassword/:id', component: ModifyPasswordComponent},
  {path: 'home', component: HomeComponent, canActivate: [RoutingGuardService]},
  {path: 'error/:msg', component: ErrorComponent, canActivate: [RoutingGuardService]},
  {path: '**', component: ErrorComponent},
];

/**
 * 路由模块
 * 让 Angular 知道 RoutingModule 是一个路由模块，
 * 而 forRoot() 表示这是一个根路由模块
 * 它会配置你传入的所有路由、让你能访问路由器指令并注册 RouterService
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
