import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../../../shared/models/comment';
@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})
export class CommentFormComponent {
  @Output() commentAdded = new EventEmitter<Comment>();
  commentForm: FormGroup;
  ratings = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      idComment:['' ,Validators.required], 
      author: ['', Validators.required],
      date: ['', Validators.required],
      fullDescription: ['', Validators.required],
      rating: [5, Validators.required],
      expanded: [false]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        ...this.commentForm.value,
        date: new Date().toLocaleDateString(),
        expanded: false
      };
      this.commentAdded.emit(newComment);
      this.commentForm.reset({ rating: 5 });
    }
  }
}
