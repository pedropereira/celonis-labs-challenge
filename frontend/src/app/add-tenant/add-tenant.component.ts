import { Component, inject, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-tenant",
  templateUrl: "./add-tenant.component.html",
  styleUrls: ["./add-tenant.component.scss"],
})
export class AddTenantComponent {
  public name: any;
  public tenantCreated = false;
  @ViewChild("createButton") createButton: any;
  private http = inject(HttpClient);

  constructor(private dialogRef: MatDialogRef<AddTenantComponent>) {}

  createTenant() {
    this.createButton._elementRef.nativeElement.disabled = true;
    this.http.post("http://localhost:3000/v1/tenants", { name: this.name }).subscribe(() => {
      this.tenantCreated = true;
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 300);
    });
  }
}
