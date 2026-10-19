import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <div class="container">
        <a routerLink="/" class="logo">Imóveis Online</a>
        <nav>
          <a routerLink="/" routerLinkActive="active">Listagem</a>
        </nav>
      </div>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .header {
      background: #1e293b;
      color: white;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    nav a {
      color: #cbd5e1;
      text-decoration: none;
      margin-left: 1.5rem;
    }
    nav a:hover, nav a.active {
      color: white;
    }
  `]
})
export class AppComponent {}
