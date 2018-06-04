import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';
import {UserService} from './service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppRoutingGuardService implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  /**
   * 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const notGuardRouteStr = 'login;register;forgetPassword;';
    const path = route.routeConfig.path;
    if (notGuardRouteStr.indexOf(path)) {
      return true;
    } else {

      return false;
    }

    // if (notGuardRoute.indexOf(path) >= 0) {
    //   /**
    //    * 登录、注册、忘记密码无需拦截
    //    */
    //   return true;
    // } else {
    //   /**
    //    * 其他页面需要拦截,判断jwt是否有效,有效放行,无效拦截跳转到登录页面
    //    */
    //   this.userService.checkJWT().subscribe(result => {
    //     if (result.code === 0) {
    //       return true;
    //     } else {
    //       this.router.navigateByUrl('error/登录超时!');
    //       return false;
    //     }
    //   });
    // }
  }
}
