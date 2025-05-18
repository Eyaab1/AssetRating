import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chatbot.component.html',
  styleUrl: './admin-chatbot.component.css'
})
export class AdminChatbotComponent implements AfterViewInit {
  message = '';
  loading = false;
  chatHistory: { role: 'user' | 'bot', text: string | SafeHtml }[] = [];

  suggestedPrompts: string[] = [
    'Who are the top contributors this month?',
    'What is the average rating distribution?',
    'How many new users joined this month?',
    'Which asset has the most downloads?',
    'Show the asset upload trend'
  ];

  @ViewChild('chatHistoryRef') chatHistoryRef!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

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
  }

  sendMessage(): void {
    if (!this.message.trim()) return;

    const userInput = this.message;
    this.chatHistory.push({ role: 'user', text: userInput });
    this.message = '';
    this.loading = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<any>('http://localhost:5000/api/chat/global', { question: userInput }, { headers }).subscribe({
      next: (res) => {
        this.loading = false;
        this.animateBotResponse(res.answer);
      },
      error: () => {
        this.chatHistory.push({ role: 'bot', text: '⚠️ Failed to get a response from the server.' });
        this.loading = false;
        this.scrollToBottom();
      }
    });
  }

  animateBotResponse(fullText: string): void {
    let display = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        display += fullText[index++];
        const formatted = this.sanitizer.bypassSecurityTrustHtml(display.replace(/\n/g, '<br>'));
        if (this.chatHistory.length > 0 && this.chatHistory[this.chatHistory.length - 1].role === 'bot') {
          this.chatHistory[this.chatHistory.length - 1].text = formatted;
        } else {
          this.chatHistory.push({ role: 'bot', text: formatted });
        }
        this.scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 10); // typing speed per character
  }
}
