import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';

/**
 * 全局路由请求拦截
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalRoutingGuard implements CanActivate {

  constructor(
    private router: Router) {
  }

  /**
   * true: 放行
   * false: 拦截路由请求
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const routePath = route.routeConfig.path;
    if (
      routePath.includes('register') || // 注册页面路由请求
      routePath.includes('login') || // 登陆页面路由请求
      routePath.includes('forgetPassword') || // 忘记密码页面路由请求
      routePath.includes('modifyPassword') || // 修改密码页面路由请求
      routePath.includes('index') // 门户网站首页路由请求
    ) {
      // 无需登陆即可访问---------------------------------------------------------->
      return true;
    } else {
      // 登陆后才可以访问---------------------------------------------------------->
      const jwt = sessionStorage.getItem('jwt');
      if (jwt) {
        return true;
      } else {
        this.router.navigateByUrl('login');
        return false;
      }
    }
  }
}
