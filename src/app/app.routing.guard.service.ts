import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';
import {UserService} from './service/user.service';

@Injectable({
  providedIn: 'root'
})
/**
 * 全局路由卫士
 */
export class AppRoutingGuardService implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  /**
   * true:跳转到当前路由;false:不跳转到当前路由
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const path = route.routeConfig.path;
    return true;
  }
}
