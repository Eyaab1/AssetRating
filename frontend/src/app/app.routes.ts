import { Routes } from '@angular/router';
import { UserHomeComponent } from './modules/user/components/user-home/user-home.component';
import { DetailAssetComponent } from './modules/user/components/detail-asset/detail-asset.component';
import { AddAssetFormComponent } from './modules/contributor/components/add-asset-form/add-asset-form.component';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './modules/contributor/components/dashboard/dashboard.component';
import { authGuardGuard } from './core/auth/guard/auth-guard.guard';
import { contributorGuardGuard } from './core/auth/guard/contributor-guard.guard';
import { AccessDeniedComponent } from './modules/common/components/access-denied/access-denied.component';
import { ContributerLayoutComponent } from './modules/contributor/components/contributer-layout/contributer-layout.component';
import { onlyGuardGuard } from './core/auth/guard/only-guard.guard';
import { EditAssetComponent } from './modules/contributor/components/edit-asset/edit-asset.component';
import path from 'path';
import { FullAssetListComponent } from './modules/contributor/components/full-asset-list/full-asset-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  
    // Public login page with guard
    { path: 'login', component: LoginComponent, canActivate: [authGuardGuard] },
  
    // USER-only routes
    { path: 'marketplace', component: UserHomeComponent, canActivate: [onlyGuardGuard] },
    { path: 'detail/:id', component: DetailAssetComponent, canActivate: [onlyGuardGuard] },
  
    {
      path: 'contributorLayout',
      component: ContributerLayoutComponent,
      canActivate: [contributorGuardGuard],
      children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'marketplace', component: UserHomeComponent},
        { path: 'dashboard', component: DashboardComponent },
        { path: 'contributorLayout', component: AddAssetFormComponent },
        { path: 'detail/:id', component: DetailAssetComponent},
        {path:'edit/:id',component:EditAssetComponent},
        {path: 'full-assets',component:FullAssetListComponent}
        

      ]
    },
    
  
    // Access denied fallback
    { path: 'accessDenied', component: AccessDeniedComponent }
  ];
  