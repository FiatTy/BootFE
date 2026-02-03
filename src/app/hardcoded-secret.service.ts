import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HardcodedSecretService {
  constructor(private http: HttpClient) {}

  // Intentionally using a hardcoded API key for scanner testing
  callApi(): Observable<any> {
    const apiKey = 'XXXX-YYYY-ZZZZ-SECRET-KEY-12345';
    const headers = new HttpHeaders({ Authorization: `Bearer ${apiKey}` });
    // Simulated API call - replace '/api/mock' with a real endpoint when needed
    return this.http.get('/api/mock', { headers });
  }
}
