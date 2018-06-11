import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';

import {LogService} from '../service/log.service';

/**
 * 全局路由卫士
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalRoutingGuard implements CanActivate {

  constructor(
    private router: Router,
    private logService: LogService) {
  }

  /**
   * true:跳转到当前路由
   * false:不跳转到当前路由
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const routePath = route.routeConfig.path;
    this.logService.print(`全局路由卫士访问页面: ${routePath}`);
    if (routePath.includes('register') || routePath.includes('login')
      || routePath.includes('email/send') || routePath.includes('email/checkEmailCode')
      || routePath.includes('modifyPassword') || routePath.includes('error')) {
      // console.log(`无需校验本地jwt`);
      return true;
    } else {
      // console.log(`需要校验本地jwt`);
      const jwt = sessionStorage.getItem('jwt');
      if (jwt) {
        return true;
      } else {
        this.router.navigateByUrl('login');
      }
    }
  }
}
