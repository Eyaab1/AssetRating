import { Routes } from '@angular/router';
import { UserHomeComponent } from './modules/user/components/user-home/user-home.component';
import { DetailAssetComponent } from './modules/user/components/detail-asset/detail-asset.component';
import { AddAssetFormComponent } from './modules/contributor/components/add-asset-form/add-asset-form.component';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './modules/contributor/components/dashboard/dashboard.component';
import { DashboardAComponent } from './modules/admin/components/dashboard-a/dashboard-a.component';
import { authGuardGuard } from './core/auth/guard/auth-guard.guard';
import { userGuardGuard } from './core/auth/guard/user-guard.guard';
import { adminGuardGuard } from './core/auth/guard/admin-guard.guard';
import { contributorGuardGuard } from './core/auth/guard/contributor-guard.guard';
import { AccessDeniedComponent } from './modules/common/components/access-denied/access-denied.component';
import { ContributerLayoutComponent } from './modules/contributor/components/contributer-layout/contributer-layout.component';
import { AdminLayoutComponent } from './modules/admin/components/admin-layout/admin-layout.component';
import { EditAssetComponent } from './modules/contributor/components/edit-asset/edit-asset.component';
import { onlyGuardGuard } from './core/auth/guard/only-guard.guard';
import { FullAssetListComponent } from './modules/contributor/components/full-asset-list/full-asset-list.component';
import { NotificationSeeAllComponent } from './modules/common/components/notification-see-all/notification-see-all.component';
import { ReportComponent } from './modules/contributor/components/reports/report.component';
import { ReportAComponent } from './modules/admin/components/report-a/report-a.component';
import { UserListComponent } from './modules/admin/components/user-list/user-list.component';
import { AddUserComponent } from './modules/admin/components/add-user/add-user.component';
import { AssetListAdminComponent } from './modules/admin/components/asset-list-admin/asset-list-admin.component';
import { ListTagCategoryComponent } from './modules/admin/components/list-tag-category/list-tag-category.component';
import { AssetDetailComponent } from './modules/admin/components/asset-detail/asset-detail.component';
import { AddAssetAdminComponent } from './modules/admin/components/add-asset-admin/add-asset-admin.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  
    // Public login page with guard
    { path: 'login', component: LoginComponent, canActivate: [authGuardGuard] },

    { path: 'marketplace', component: UserHomeComponent, canActivate: [onlyGuardGuard] },
    { path: 'detail/:id', component: DetailAssetComponent, canActivate: [onlyGuardGuard] },
    {path: 'notificationAll',component:NotificationSeeAllComponent,canActivate:[onlyGuardGuard]},
    {
      path: 'contributorLayout',
      component: ContributerLayoutComponent,
      canActivate: [contributorGuardGuard],
      children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'marketplace', component: UserHomeComponent},
        { path: 'dashboard', component: DashboardComponent },
        { path: 'addAsset', component: AddAssetFormComponent },
        { path: 'detail/:id', component: DetailAssetComponent},
        {path:'edit/:id',component:EditAssetComponent},
        {path: 'full-assets',component:FullAssetListComponent},
        {path: 'notificationAll',component:NotificationSeeAllComponent},
        { path: 'reports', component: ReportComponent },
        

      ]
    },
    {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate : [adminGuardGuard],
      children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardAComponent },
        {path : 'reports', component: ReportAComponent},
        { path: 'users', component: UserListComponent },
        { path: 'users/add', component: AddUserComponent },
        { path: 'assets/search/:type',component: AssetListAdminComponent},
        { path: 'tags', component: ListTagCategoryComponent, data: { type: 'tag' } },
        { path: 'categories', component: ListTagCategoryComponent, data: { type: 'category' } },
        {path :'assets/view/:id', component:AssetDetailComponent},
        {path:'assets/add', component: AddAssetAdminComponent}
      ] 
    },
  
    // Access denied fallback
    { path: 'accessDenied', component: AccessDeniedComponent }
  ];
  