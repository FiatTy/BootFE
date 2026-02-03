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
  lastToken: string | null = null;
  storedSecret: string | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  show() {
    // Intentionally bypass Angular sanitization for testing scanners
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.userInput);
  }

  // Dangerous: directly evaluates user input
  unsafeEval() {
    // eslint-disable-next-line no-eval
    eval(this.userInput);
  }

  // Dangerous: direct DOM assignment to innerHTML
  unsafeDOMAssign() {
    const el = document.getElementById('unsafe-dom-target');
    if (el) {
      // Bypass Angular templating and assign raw HTML
      // This pattern is commonly flagged by static scanners as XSS
      el.innerHTML = this.userInput;
    }
  }

  // Dangerous: create a new function from user input
  unsafeNewFunction() {
    // eslint-disable-next-line no-new-func
    const fn = new Function(this.userInput);
    fn();
  }

  // Dangerous: write directly to the document
  unsafeDocumentWrite() {
    // Document.write with user input is insecure and flagged by scanners
    document.write(this.userInput);
  }

  // Dangerous: store a hardcoded secret and user-provided secret in localStorage
  storeSecretInLocalStorage() {
    // Hardcoded secret value
    localStorage.setItem('hardcoded_api_key', 'HARDCODED-API-KEY-987654');
    // Also store user input directly (insecure)
    localStorage.setItem('user_provided_secret', this.userInput);
    this.storedSecret = localStorage.getItem('hardcoded_api_key');
  }

  // Dangerous: generate a predictable token using Math.random()
  generatePredictableToken() {
    const token = Math.random().toString(36).substring(2);
    this.lastToken = token;
    return token;
  }

  // Dangerous: open a user-provided URL without validation
  openUnvalidatedUrl() {
    // This can be used for open-redirect or phishing vectors
    window.open(this.userInput, '_blank');
  }

  // Dangerous: send sensitive data in query string
  fetchWithCredentialsInUrl() {
    // Put user input directly into a query param (sensitive data in URL)
    fetch('/api/mock-login?token=' + encodeURIComponent(this.userInput))
      .then(() => {
        // noop
      })
      .catch(() => {
        // noop
      });
  }
}
