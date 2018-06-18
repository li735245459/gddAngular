import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EasyUIModule} from 'ng-easyui/components/easyui/easyui.module';
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
import {HomeComponent} from './component/index/home/home.component';
import {AdminComponent} from './component/admin/admin.component';
import {GoodsComponent} from './component/admin/goods/goods.component';

/**
 * 全局路由配置
 */
const appRoutes: Routes = [
  {
    path: 'index', component: IndexComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'home', component: HomeComponent},
      {path: 'pets', component: PetsComponent}
    ]
  },
  {
    path: 'admin', component: AdminComponent, children: [
      {path: '', component: GoodsComponent},
      {path: 'goods', component: GoodsComponent}
    ]
  },
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
    GoodsComponent,
    AdminComponent,
    HomeComponent,
    ForgetPasswordComponent,
    ModifyPasswordComponent,
    UserComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    // easyui模块
    EasyUIModule
  ],
  providers: [httpInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule {
}
