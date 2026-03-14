import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="min-h-screen bg-background text-text-primary">
      <router-outlet />
    </main>
  `,
})
export class App { }
