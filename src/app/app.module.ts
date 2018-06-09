import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';

import {InMemoryDb} from './data/dataSource';
import {AppComponent} from './app.component';
import {LogComponent} from './component/log/log.component';
import {LoginComponent} from './component/user/login/login.component';
import {RegisterComponent} from './component/user/register/register.component';
import {ForgetPasswordComponent} from './component/user/forget-password/forget-password.component';
import {ModifyPasswordComponent} from './component/user/modify-password/modify-password.component';
import {UserComponent} from './component/user/user.component';
import {ErrorComponent} from './component/error/error.component';
import {HomeComponent} from './component/home/home.component';
import {RoutingService} from './service/routing.service';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  {path: 'modifyPassword/:id', component: ModifyPasswordComponent},
  {path: 'home', component: HomeComponent, canActivate: [RoutingService]},
  {path: 'error/:msg', component: ErrorComponent, canActivate: [RoutingService]},
  // URL为空时就会访问这里因此它通常会作为起点.这个默认路由会重定向到/login并显示LoginComponent
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  // 当所请求的URL不匹配前面定义的路由表中的任何路径时路由器就会选择此路由
  {path: '**', component: ErrorComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ModifyPasswordComponent,
    UserComponent,
    ErrorComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    // 路由模块
    RouterModule.forRoot(appRoutes),
    // 表单模块
    FormsModule,
    // 模型表单模块
    // Support for using the ngModel input property and ngModelChange
    // event with reactive form directives has been deprecated in Angular v6 and will be removed in Angular v7
    // ReactiveFormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    // HttpClient模块
    HttpClientModule,
    // 模拟内存数据,生产环境需要关闭
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDb, { dataEncapsulation: false }
    // ),
    // bootstrap模块
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
