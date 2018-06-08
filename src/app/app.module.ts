import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';

import {InMemoryDb} from './data/dataSource';
import {AppComponent} from './app.component';
import {RoutingModule} from './routing/routing.module';
import {HeroesComponent} from './component/hero/heroes/heroes.component';
import {LogComponent} from './component/log/log.component';
import {DashboardComponent} from './component/hero/dashboard/dashboard.component';
import {SearchComponent} from './component/hero/search/search.component';
import {LoginComponent} from './component/user/login/login.component';
import {RegisterComponent} from './component/user/register/register.component';
import {ForgetPasswordComponent} from './component/user/forget-password/forget-password.component';
import {ModifyPasswordComponent} from './component/user/modify-password/modify-password.component';
import {UserComponent} from './component/user/user.component';
import {ErrorComponent} from './component/error/error.component';
import { HomeComponent } from './component/home/home.component';

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
    // 路由模块
    RoutingModule,
    // bootstrap模块
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
