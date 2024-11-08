import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MakeUserDialogComponent } from "../make-user-dialog/make-user-dialog.component";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  public users: any;
  private dialog = inject(MatDialog);

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  listUsers() {
    this.http.get("http://localhost:3000/v1/users").subscribe((users) => {
      this.users = users;
      this.users.forEach((user: any) => {
        this.http.get(`http://localhost:3000/v1/tenants/${user.tenantId}`).subscribe((tenant) => {
          user.tenant = tenant;
          this.cd.detectChanges();
        });
      });
    });
  }

  ngOnInit() {
    this.listUsers();
  }

  createUser() {
    const dialogRef = this.dialog.open(MakeUserDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.listUsers();
      }
    });
  }

  deleteUser(user: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.http.delete(`http://localhost:3000/v1/users/${user.id}`).subscribe(() => {
      const users = [...this.users];
      users.splice(users.indexOf(user), 1);
      this.users = users;
      this.cd.detectChanges();
    });
  }
}
