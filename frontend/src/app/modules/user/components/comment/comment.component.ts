import { Component, Input } from '@angular/core';
import { Comment } from '../../../../shared/models/comment';
import { NgIf,NgFor,CommonModule } from '@angular/common';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
// <app-review-component [assetId]="assetSelected?.id || ''"></app-review-component>
export class CommentComponent {
  @Input() comment!: Comment; 

  // toggleReadMore(): void {
  //   this.comment.expanded = !this.comment.expanded;
  // }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

}
