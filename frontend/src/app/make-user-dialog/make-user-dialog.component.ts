import {ChangeDetectionStrategy, Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialogRef} from '@angular/material/dialog';

interface Tenant {
  id: string;
  name: string;
}

@Component({
  selector: 'app-make-user-dialog',
  templateUrl: './make-user-dialog.component.html',
  styleUrls: ['./make-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeUserDialogComponent implements OnInit {
  name = '';
  email = '';
  selectedTenantId = '';
  tenants: Tenant[] = [];
  userCreated = false;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<MakeUserDialogComponent>,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.http.get<Tenant[]>('http://localhost:3000/show-tenants').subscribe(
      (tenants) => {
        this.tenants = tenants;
      },
      (error) => {
        console.error('Error loading tenants:', error);
      }
    );
  }

  createUser() {
    this.isLoading = true;

    this.http.get(`http://localhost:3000/make-user/${this.email}`, {
      params: {
        name: this.name,
        tenantId: this.selectedTenantId
      }
    }).subscribe(
      () => {
        this.userCreated = true;
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      (error) => {
        console.error('Error creating user:', error);
        this.isLoading = false;
      }
    );
  }
}
