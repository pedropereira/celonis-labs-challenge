import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {AddTenantComponent} from "../add-tenant/add-tenant.component";

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsComponent {
  public tenants: any
  private http = inject(HttpClient)

  constructor(
    http: HttpClient,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.loadTenants();
  }

  loadTenants() {
    this.http.get("http://localhost:3000/show-tenants").subscribe((tenants) => {
      this.tenants = tenants;
      this.cd.detectChanges();
    });
  }

  addTenant() {
    const dialogRef = this.dialog.open(AddTenantComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadTenants();
      }
    });
  }

  deleteTenant(tenant: any) {
    this.http.post("http://localhost:3000/delete-tenant?name=" + tenant.name, {}).subscribe((res) => {
      const tenants = [...this.tenants];
      tenants.splice(tenants.indexOf(tenant), 1);
      this.tenants = tenants;
      this.cd.detectChanges();
    });
  }
}
