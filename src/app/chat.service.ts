import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8080/generate';

  constructor(private http: HttpClient) {}

  generateText(prompt: string): Observable<string> {
    return this.http
      .post<{ response: string }>(this.apiUrl, { prompt })
      .pipe(map(r => r.response));
  }
}
