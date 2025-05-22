import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/common/components/navbar/navbar.component';
import { UserHomeComponent } from './modules/user/components/user-home/user-home.component';
import { CommonModule } from '@angular/common';
import { DetailAssetComponent } from "./modules/user/components/detail-asset/detail-asset.component";
import { ReviewPopupComponent } from "./modules/user/components/review-popup/review-popup.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, UserHomeComponent, CommonModule, DetailAssetComponent, ReviewPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Veggo MarketPlace';
  constructor(private router: Router) {}
  shouldShowNavbar(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    return decoded?.role === 'USER' || decoded?.role === 'ADMIN' || decoded?.role === 'CONTRIBUTOR';
  }

}
