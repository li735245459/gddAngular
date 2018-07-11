import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * 父组件和它的子组件共享同一个服务，利用该服务在家庭内部实现双向通讯
 * 该服务实例的作用域被限制在父组件和其子组件内。这个组件子树之外的组件将无法访问该服务或者与它们通讯
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Subject是一类特殊的Observable可观察对象,它可以向多个Observer观察者多路推送消息
  private adminTitleSubject = new Subject<string>();
  private msgSubject = new Subject<Msg>();
  // 获取订阅者
  public adminTitleSubscription = this.adminTitleSubject.asObservable();
  public msgSubscription = this.msgSubject.asObservable();
  // 推送消息
  public modifyAdminTitle(adminTitle: string) {
    this.adminTitleSubject.next(adminTitle);
  }
  public modifyMsg(msg: Msg) {
    this.msgSubject.next(msg);
  }
}

export interface Msg {
  id: string;
  msg: string;
}

