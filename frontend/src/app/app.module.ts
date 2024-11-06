import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UsersComponent } from './users/users.component';
import {HttpClientModule} from "@angular/common/http";
import { MakeUserDialogComponent } from './make-user-dialog/make-user-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatLineModule} from "@angular/material/core";
import { TenantsComponent } from './tenants/tenants.component';
import { AddTenantComponent } from './add-tenant/add-tenant.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    UsersComponent,
    MakeUserDialogComponent,
    TenantsComponent,
    AddTenantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatLineModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
