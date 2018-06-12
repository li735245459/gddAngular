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
import {GlobalRoutingGuard} from './router/global.routing.guard';
import {httpInterceptor} from './Interceptor/interpectors';
import {IndexComponent} from './component/index/index.component';
import {PetsComponent} from './component/index/pets/pets.component';
import {PetComponent} from './component/index/pets/pet/pet.component';
import {AboutComponent} from './component/index/about/about.component';
import {HomeComponent} from './component/index/home/home.component';

const appRoutes: Routes = [
  {
    path: 'index', component: IndexComponent, children: [
      {path: 'home', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'pets', component: PetsComponent},
      {path: '', component: HomeComponent}
    ]
  },
  {path: 'pet/:id', component: PetComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  {path: 'modifyPassword/:id', component: ModifyPasswordComponent},
  {path: 'error', component: ErrorComponent, canActivate: [GlobalRoutingGuard]},
  {path: '', redirectTo: '/index', pathMatch: 'full'}, // URL为空时就会访问这里因此它通常作为起点.这个默认路由会重定向到/login并显示LoginComponent
  {path: '**', component: ErrorComponent}, // 当所请求的URL不匹配前面定义的路由表中的任何路径时路由器就会选择此路由
];

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    PetsComponent,
    PetComponent,
    HomeComponent,
    AboutComponent,
    ForgetPasswordComponent,
    ModifyPasswordComponent,
    UserComponent,
    ErrorComponent
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
  providers: [httpInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule {
}
