import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/common/components/navbar/navbar.component';
import { UserHomeComponent } from './modules/user/components/user-home/user-home.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,UserHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Veggo MarketPlace';
  constructor(private router: Router) {}
  shouldShowNavbar(): boolean {
    // Add all routes where you want to HIDE the navbar
    const hiddenRoutes = ['/login', '/accessDenied'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
