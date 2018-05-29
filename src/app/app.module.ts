import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { InMemoryDb } from './dataSource';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HeroesComponent } from './component/hero/heroes/heroes.component';
import { HeroComponent } from './component/hero/hero.component';
import { LogComponent } from './component/log/log.component';
import { DashboardComponent } from './component/hero/dashboard/dashboard.component';
import { SearchComponent } from './component/hero/search/search.component';
import { Page404Component } from './component/page404/page404.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { ForgetPasswordComponent } from './component/user/forget-password/forget-password.component';
import { ModifyPasswordComponent } from './component/user/modify-password/modify-password.component';
import { UserComponent } from './component/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroComponent,
    LogComponent,
    DashboardComponent,
    SearchComponent,
    Page404Component,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ModifyPasswordComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
export class AppModule { }
