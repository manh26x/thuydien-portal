import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {BaseService} from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingFirebaseService extends BaseService {

  currentMessage = new BehaviorSubject(null);


  constructor(private angularFireMessaging: AngularFireMessaging,
              private http: HttpClient) {
    super();
    this.angularFireMessaging.onMessage(
      // tslint:disable-next-line:variable-name
      (_messaging ) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }


  getHttp(): HttpClient {
    return this.http;
  }
  getServiceName(): string {
    return 'MessagingFirebaseService';
  }


  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.doPost('/admin/user/device', token).subscribe(() => console.log('register notification success'));
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
        // @ts-ignore
        this.currentMessage.next(payload);
      });
  }
}
