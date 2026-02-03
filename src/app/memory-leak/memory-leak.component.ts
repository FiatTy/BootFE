import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-memory-leak',
  template: `
    <div class="p-2">
      <h4>Memory Leak Test</h4>
      <p>This component subscribes to an interval every second and intentionally does not unsubscribe.</p>
    </div>
  `,
  styles: [
    `
    .p-2 { padding: .5rem; }
    `
  ]
})
export class MemoryLeakComponent implements OnInit, OnDestroy {
  private sub: Subscription | undefined;

  ngOnInit(): void {
    // Intentionally subscribe and never unsubscribe to simulate a memory leak
    this.sub = interval(1000).subscribe(cnt => console.log('MemoryLeak tick', cnt));
  }

  // ngOnDestroy intentionally left without unsubscribing
  ngOnDestroy(): void {
    // Intentionally omitted: this.sub?.unsubscribe();
  }
}
