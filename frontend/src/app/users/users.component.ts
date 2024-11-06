import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {MakeUserDialogComponent} from "../make-user-dialog/make-user-dialog.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  public users: any
  private dialog = inject(MatDialog)

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {

  }

  async ngOnInit() {
    this.http.get("http://localhost:3000/list-users").subscribe((users) => {
      this.users = users;
      this.users.forEach((user: any) => {
        this.http.get("http://localhost:3000/send-user-tenant/" + user.email).subscribe((tenant) => {
          user.tenant = tenant;
          this.cd.detectChanges();
        })
      });
    })
  }

  makeUser() {
    this.dialog.open(MakeUserDialogComponent)
  }

  deleteUser(user: any) {
    this.http.post("http://localhost:3000/delete-user?email=" + user.email, null).subscribe(() => {
      const users = this.users;
      users.splice(users.indexOf(user), 1);
      this.users = users;
    })
  }
}
