import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';
import { Tag } from '../../../../shared/models/tag';
import { Category } from '../../../../shared/models/category';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-tag-category',
  templateUrl: './list-tag-category.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./list-tag-category.component.css']
})
export class ListTagCategoryComponent implements OnInit {
  type: 'tag' | 'category' = 'tag';
  items: (Tag | Category)[] = [];

  creating: boolean = false;
  newName: string = '';

  constructor(
    private route: ActivatedRoute,
    private tagCatService: TagAndcategoryService
  ) {}


  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.type = data['type'] || 'tag';
      this.loadData();
    });
  }

  loadData(): void {
    if (this.type === 'tag') {
      this.tagCatService.getAllTags().subscribe(data => {
        this.items = data || [];
      });
    } else {
      this.tagCatService.getAllCategories().subscribe(data => {
        this.items = data || [];
      });
    }
  }

  toggleCreate(): void {
    this.creating = !this.creating;
    this.newName = '';
  }

  create(): void {
    const name = this.newName.trim();
    if (!name) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to create a new ${this.type}: "${name}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { name };

        const request = this.type === 'tag'
          ? this.tagCatService.createTag(payload)
          : this.tagCatService.addCategory(payload);

        request.subscribe({
          next: (created) => {
            this.items.push(created);
            this.creating = false;
            this.newName = '';
            Swal.fire('Created!', `${this.type} created successfully.`, 'success');
          },
          error: () => {
            Swal.fire('Error', `Failed to create ${this.type}.`, 'error');
          }
        });
      }
    });
  }
}