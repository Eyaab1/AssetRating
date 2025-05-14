import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);

      const decoded: any = jwtDecode(response.token);
      const role = decoded.role; 
        console.log('role', role);
      localStorage.setItem('role', role);    
      if (role === 'CONTRIBUTOR') {
        console.log('Navigating to /contributorLayout');
        this.router.navigate(['/contributorLayout']);
      }else if (role === 'ADMIN') {
        console.log('Navigating to /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('Navigating to /marketplace');
        this.router.navigate(['/marketplace']);
      }
      
  

      },
      error: (error) => {
        console.error('Full error:', error);

        const rawError = error?.error;
        console.log('error.error:', error.error);

        if (typeof rawError === 'string' && rawError.includes('deactivated')) {
          this.errorMessage = 'Your account is deactivated. Please contact admin.';
        } else if (
          typeof rawError === 'object' &&
          rawError?.message?.includes('deactivated')
        ) {
          this.errorMessage = 'Your account is deactivated. Please contact admin.';
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      }

    });
  }

}
