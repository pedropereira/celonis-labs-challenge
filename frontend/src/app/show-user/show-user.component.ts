import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-show-user",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: "./show-user.component.html",
  styleUrls: ["./show-user.component.scss"],
})
export class ShowUserComponent {
  public user: any;
  @Input() id: any;
  public editMode: boolean = false;
  public name: any;
  private http = inject(HttpClient);

  constructor(http: HttpClient) {
    setTimeout(() => {
      http.get(`http://localhost:3000/v1/users/${this.id}`).subscribe((user: any) => {
        this.user = user;
        this.name = user.name;
      });
    }, 300);
  }

  save() {
    this.editMode = false;
    this.http
      .patch(`http://localhost:3000/v1/users/${this.id}`, { name: this.name })
      .subscribe((user: any) => {
        this.user = user;
        this.name = user.name;
      });
    this.http.get(`http://localhost:3000/v1/users/${this.id}`).subscribe((user: any) => {
      this.user = user;
      this.name = user.name;
    });
  }
}
