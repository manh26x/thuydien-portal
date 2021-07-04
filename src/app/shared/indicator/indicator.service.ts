import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoading$ = this.loading.asObservable();

  showActivityIndicator() {
    this.loading.next(true);
  }

  hideActivityIndicator() {
    this.loading.next(false);
  }
}
