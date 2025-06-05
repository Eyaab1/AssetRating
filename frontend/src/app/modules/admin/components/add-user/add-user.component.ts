import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅
import { AdminUserService } from '../../../../shared/services/adminServices/admin-user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports: [ReactiveFormsModule] 
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: AdminUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      enabled: [true, Validators.required]
    });
  }

  submitUser(): void {
    if (this.userForm.invalid) return;

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        Swal.fire({
          title: 'User Created!',
          text: 'Login credentials have been sent via email.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        this.router.navigate(['/admin/users']);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add user.',
          icon: 'error'
        });
      }
    });
  }
}
