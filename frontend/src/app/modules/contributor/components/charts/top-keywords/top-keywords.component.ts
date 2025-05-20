import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-keywords',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './top-keywords.component.html',
  styleUrl: './top-keywords.component.css'
})
export class TopKeywordsComponent implements OnChanges {
  @Input() keywordsMap: { [word: string]: number } = {};
  keywordsArray: { word: string; count: number }[] = [];

  ngOnChanges(): void {
    this.keywordsArray = Object.entries(this.keywordsMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }


}
