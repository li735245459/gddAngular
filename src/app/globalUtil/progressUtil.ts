import {interval, Subscription} from 'rxjs';

export class Progress {

  /**
   * 动态加载进度条
   * @param frequency 执行频率
   * @param progressSize 进度条每次加载大小
   * @param progressValue 当前进度条大小
   * @param cycle 是否循环加载
   * @returns {Object}
   */
  dynLoadProgress(frequency: number, progressSize: number, progressValue: number, cycle: boolean): Subscription {
    const progressSubscribe = interval(frequency).subscribe(() => {
      progressValue += Math.floor(Math.random() * progressSize);
      if (cycle) {
        progressValue = progressValue > 100 ? 10 : progressValue;
      } else {
        progressValue = progressValue >= 100 ? 100 : progressValue;
        if (progressValue === 100) {
          progressSubscribe.unsubscribe();
        }
      }
    });
    return progressSubscribe;
  }
}

