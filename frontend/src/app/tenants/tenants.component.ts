import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { AddTenantComponent } from "../add-tenant/add-tenant.component";

@Component({
  selector: "app-tenants",
  templateUrl: "./tenants.component.html",
  styleUrls: ["./tenants.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantsComponent {
  public tenants: any;
  private http = inject(HttpClient);

  constructor(http: HttpClient, public dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.listTenants();
  }

  listTenants() {
    this.http.get("http://localhost:3000/v1/tenants").subscribe((tenants) => {
      this.tenants = tenants;
      this.cd.detectChanges();
    });
  }

  createTenant() {
    const dialogRef = this.dialog.open(AddTenantComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.listTenants();
      }
    });
  }

  deleteTenant(tenant: any) {
    this.http.delete(`http://localhost:3000/v1/tenants/${tenant.id}`).subscribe(() => {
      const tenants = [...this.tenants];
      tenants.splice(tenants.indexOf(tenant), 1);
      this.tenants = tenants;
      this.cd.detectChanges();
    });
  }
}
