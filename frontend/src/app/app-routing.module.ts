import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {TenantsComponent} from "./tenants/tenants.component";

const routes: Routes = [
  {path: 'users', component: UsersComponent},
  {path: 'tenants', component: TenantsComponent},
  {path: 'user/:id', loadComponent: () => import('./show-user/show-user.component').then(m => m.ShowUserComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
