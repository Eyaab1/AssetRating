import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

@Component({
  selector: 'app-side-bar-admin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './side-bar-admin.component.html',
  styleUrl: './side-bar-admin.component.css',
  animations: [
    trigger('slideSidebar', [
      state('default', style({ transform: 'translateX(0)', opacity: 1 })),
      state('asset', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('default => asset', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('asset => default', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out')
      ])
    ])
  ]

})
export class SideBarAdminComponent {
  firstNameInitial: string = '';
  fullName: string = '';
  showProfileMenu: boolean = false;
  isAssetView: boolean = false;


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const first = decoded.firstName || '';
      const last = decoded.lastName || '';
      this.firstNameInitial = first.charAt(0).toUpperCase();
      this.fullName = `${first} ${last}`;
    }
  }

  toggleProfileDropdown(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    localStorage.removeItem('token');
    location.href = '/login'; 
  }
  toggleAssetView(): void {
    this.isAssetView = !this.isAssetView;
  }


}
