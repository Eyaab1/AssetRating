import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contributor-chat-bot',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contributor-chat-bot.component.html',
  styleUrl: './contributor-chat-bot.component.css'
})
export class ContributorChatBotComponent implements OnInit {
  @Input() assetId!: string;

  message = '';
  loading = false;
  chatHistory: { role: 'user' | 'bot', text: string }[] = [];
showPrompts = true; // New flag to control prompt visibility
  // 👇 Suggested prompts
  suggestedPrompts: string[] = [
    'What do users like most about this asset?',
    'Are there any negative trends in recent reviews?',
    'What is the average rating of this asset?',
    'Show me some common keywords in reviews'
  ];

  @ViewChild('chatHistoryRef') chatHistoryRef!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatHistoryRef) {
        const container = this.chatHistoryRef.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
  setInput(prompt: string): void {
    this.message = prompt;
    this.showPrompts = false; // Hide prompts when a prompt is selected
  }
  onInputChange(): void {
    // Hide prompts if the user starts typing
    this.showPrompts = this.message.trim() === '' && this.chatHistory.length === 0;
  }
  sendMessage(): void {
    if (!this.message.trim()) return;

    const question = this.message;
    this.chatHistory.push({ role: 'user', text: question });
    this.message = '';
    this.showPrompts = false; // Ensure prompts stay hidden after sending
    this.loading = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<any>(`http://localhost:8081/api/chatbot/asset/${this.assetId}`, { question }, { headers })
      .subscribe({
        next: res => {
          this.chatHistory.push({ role: 'bot', text: res.answer });
          this.loading = false;
          this.scrollToBottom();
        },
        error: err => {
          this.chatHistory.push({ role: 'bot', text: '⚠️ Failed to contact the chatbot service.' });
          this.loading = false;
          this.scrollToBottom();
        }
      });
  }

}
