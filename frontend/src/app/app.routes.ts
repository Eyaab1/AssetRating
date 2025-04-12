import { Routes } from '@angular/router';
import { UserHomeComponent } from './modules/user/components/user-home/user-home.component';
import { DetailAssetComponent } from './modules/user/components/detail-asset/detail-asset.component';
import { AddAssetFormComponent } from './modules/contributor/components/add-asset-form/add-asset-form.component';

export const routes: Routes = [
    { path: 'marketplace', component: UserHomeComponent },
    {path:'detail/:id',component: DetailAssetComponent},
    { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
    {path:'addAssetForm',component:AddAssetFormComponent}
];
