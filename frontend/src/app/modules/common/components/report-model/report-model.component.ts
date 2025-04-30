import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-model',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './report-model.component.html',
  styleUrl: './report-model.component.css'
})
export class ReportModelComponent {
  @Input() reviewId!: number;
  @Output() submitted = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  reportReason = '';

  submit() {
    this.submitted.emit(this.reportReason);
  }

  cancel() {
    this.cancelled.emit();
  }
}
