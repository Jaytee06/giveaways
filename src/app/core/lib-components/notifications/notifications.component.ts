import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {AngularFirestore} from "@angular/fire/firestore";

import * as moment from 'moment';
import * as firebase from 'firebase/app';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [UserService]
})
export class NotificationsComponent implements OnInit {

  user: any = {};
  notifications: any[] = [];
  pendingIds = [];
  notSeenIds = [];

  constructor(
      private userService: UserService,
      private fs: AngularFirestore,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((d) => {
      this.user = d;

      this.fs.collection('notifications').doc(this.user._id).valueChanges().subscribe((userNotis: any) => {

        if (userNotis) {
          this.pendingIds = userNotis.pending;
          this.notSeenIds = userNotis.notSeen;

          this.notifications = userNotis.notis.map((noti) => {
            noti.createdDisplay = this.userService.formatDate(noti.created, true, true);
            return noti;
          }).sort((a, b) => {
            if( moment(a).isBefore(moment(b)) )
              return 1;

            return -1;
          }).filter((x, i) => userNotis.pending.indexOf(x._id) > -1 || i < 5);
        }
      });
    });
  }

  openedNotifications() {
    const seenNotis = this.notifications.map(x => x._id);
    setTimeout(() => {
      seenNotis.forEach((id) => {
        this.fs.collection('notifications').doc(this.user._id).update({
          pending: firebase.firestore.FieldValue.arrayRemove(id)
        });
      });
    }, 2500);
  }

  notiClicked(noti) {
    let nav = [];
    if( noti.refType === 'triviaQuiz' )
      nav = ['/trivia-quiz', noti.ref];

    this.fs.collection('notifications').doc(this.user._id).update({
      notSeen: firebase.firestore.FieldValue.arrayRemove(noti._id)
    });
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
}
