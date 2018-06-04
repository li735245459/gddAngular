import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppRoutingGuardService implements CanActivate {

  constructor(
    private router: Router) {
  }

  /**
   * 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean}
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const path = route.routeConfig.path; // 当前路由
    const notGuardRoute = ['login', 'register', 'forgetPassword']; // 不需要路由守卫的路由
    if (notGuardRoute.indexOf(path) >= 0) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
    // if (!isLogin) {
    //   // 未登录，跳转到login
    //   this.router.navigate(['login']);
    //   return false;
    // } else {
    //   // 已登录，跳转到当前路由
    //   return true;
    // }

    // 当前路由是login时
    // if (path === 'login') {
    //   if (!isLogin) {
    //     // 未登录，跳转到当前路由
    //     return true;
    //   } else {
    //     // 已登录，跳转到home
    //     this.router.navigate(['home']);
    //     return false;
    //   }
    // }

    // }
  }
}
