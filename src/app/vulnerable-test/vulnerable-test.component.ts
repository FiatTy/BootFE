import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-vulnerable-test',
  templateUrl: './vulnerable-test.component.html',
  styleUrls: ['./vulnerable-test.component.css']
})
export class VulnerableTestComponent {
  userInput = '';
  trustedHtml: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  show() {
    // Intentionally bypass Angular sanitization for testing scanners
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.userInput);
  }
}
