import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownPipe } from '../pipes/markdown.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MarkdownPipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  prompt = '';
  messages: { content: string, isBot: boolean, timestamp: Date, error?: boolean }[] = [];
  isLoading = false;
  private chatSub?: Subscription;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

  sendPrompt(): void {
    const text = this.prompt.trim();
    if (!text || this.isLoading) return;


    this.messages.push({
      content: text,
      isBot: false,
      timestamp: new Date()
    });

    this.isLoading = true;
    this.prompt = '';

    const botMessageIndex = this.messages.push({
      content: '...',
      isBot: true,
      timestamp: new Date()
    }) - 1;

    this.chatSub = this.chatService.generateText(text).subscribe({
      next: (resp: string) => {
        this.messages[botMessageIndex] = {
          content: resp,
          isBot: true,
          timestamp: new Date()
        };
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erro na requisição', err);
        this.messages[botMessageIndex] = {
          content: 'Erro ao conectar com o serviço. Por favor, tente novamente.',
          isBot: true,
          timestamp: new Date(),
          error: true
        };
      },
      complete: () => {
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) {  }
    }, 100);
  }

  retryLastMessage(): void {
    const lastError = [...this.messages].reverse().find(m => m.error);

    if (lastError) {
      this.prompt = lastError.content.toString();
      this.sendPrompt();
    }
  }

  ngOnDestroy() {
    this.chatSub?.unsubscribe();
  }
}
