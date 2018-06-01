import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';

import {InMemoryDb} from './dataSource';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {HeroesComponent} from './component/hero/heroes/heroes.component';
import {HeroComponent} from './component/hero/hero.component';
import {LogComponent} from './component/log/log.component';
import {DashboardComponent} from './component/hero/dashboard/dashboard.component';
import {SearchComponent} from './component/hero/search/search.component';
import {LoginComponent} from './component/user/login/login.component';
import {RegisterComponent} from './component/user/register/register.component';
import {ForgetPasswordComponent} from './component/user/forget-password/forget-password.component';
import {ModifyPasswordComponent} from './component/user/modify-password/modify-password.component';
import {UserComponent} from './component/user/user.component';
import {ErrorComponent} from './component/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroComponent,
    LogComponent,
    DashboardComponent,
    SearchComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ModifyPasswordComponent,
    UserComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // ReactiveFormsModule,
    // Support for using the ngModel input property and ngModelChange
    // event with reactive form directives has been deprecated in Angular v6 and will be removed in Angular v7
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    // 模拟内存数据,生产环境需要关闭
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDb, { dataEncapsulation: false }
    // ),
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
