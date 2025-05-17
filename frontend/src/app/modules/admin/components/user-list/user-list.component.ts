import { Component, OnInit } from '@angular/core';
import { AdminUserService } from '../../../../shared/services/adminServices/admin-user.service'; 
import { UserDTO } from '../../../../shared/models/user-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  usersPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  paginatedUsers: UserDTO[] = [];

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

loadUsers(): void {
  this.adminUserService.getAllUsers().subscribe(data => {
    this.users = data;
    this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
    this.updatePaginatedUsers();
  });
}

updatePaginatedUsers(): void {
  const start = (this.currentPage - 1) * this.usersPerPage;
  const end = start + this.usersPerPage;
  this.paginatedUsers = this.users.slice(start, end);
}

onPageChange(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }
}

  changeUserRole(id: number, role: string): void {
  Swal.fire({
    title: 'Confirm Role Change',
    text: `Are you sure you want to change the role to "${role}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminUserService.updateUserRole(id, role).subscribe(() => {
        Swal.fire({
          title: 'Role Updated',
          text: `User role has been changed to "${role}".`,
          icon: 'success',
          width: '350px',
          timer: 2000,
          showConfirmButton: true
        });
      });
    }
  });
}


  toggleUserActivation(id: number, enabled: boolean): void {
  Swal.fire({
    title: enabled ? 'Activate user?' : 'Deactivate user?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminUserService.toggleActivation(id, enabled).subscribe(() => {
        const user = this.users.find(u => u.id === id);
        if (user) user.enabled = enabled;
        Swal.fire({
          title: 'User updated',
          text: `User is now ${enabled ? 'enabled' : 'disabled'}`,
          icon: 'success',
          width: '350px',           // Optional: smaller popup
          confirmButtonText: 'OK',  // Show a single "OK" button
          timer: 2000,              // Auto close after 2 sec (optional)
          showConfirmButton: true,
          position: 'center'        // Default, but you can remove if you want
        });
      });
    }
  });
}

deleteUser(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This user will be deleted permanently.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminUserService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          width: '350px',
          confirmButtonText: 'OK',
          timer: 2000,
          showConfirmButton: true
        });
      });
    }
  });
}

}
