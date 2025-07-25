import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  updateUnreadCount(count: number): void {
    console.log('AppStateService - updating unread count to:', count);
    this.unreadCountSubject.next(count);
  }

  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }
}
