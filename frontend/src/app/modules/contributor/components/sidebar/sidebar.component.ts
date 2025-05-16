import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  firstNameInitial: string = '';
  fullName: string = '';
  showProfileMenu: boolean = false;

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
    location.href = '/login'; // or use router.navigate(['/login'])
  }


}
