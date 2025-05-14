import { Component } from '@angular/core';
import { SideBarAdminComponent } from '../side-bar-admin/side-bar-admin.component'; 

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SideBarAdminComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
