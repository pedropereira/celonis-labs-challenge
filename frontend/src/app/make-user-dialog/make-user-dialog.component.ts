import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-make-user-dialog',
  templateUrl: './make-user-dialog.component.html',
  styleUrls: ['./make-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeUserDialogComponent {
  public name: any
  public email: any
  public userCreated = false
  @ViewChild('createButton') createButton: any
  private http = inject(HttpClient)

  createUser() {
    this.createButton._elementRef.nativeElement.disabled = true;
    this.http.get("http://localhost:3000/make-user/" + this.email + "?name=" + this.name).subscribe((users) => {
      this.userCreated = true;
    })
  }
}
