import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppNotification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private readonly notificationSubject = new Subject<AppNotification>();

  readonly notifications$ = this.notificationSubject.asObservable();

  show(
    message: string,
    type: AppNotification['type'] = 'info'
  ): void {
    this.notificationSubject.next({ message, type });
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }
}