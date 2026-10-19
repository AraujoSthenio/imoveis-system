import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/property.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters">
      <input
        type="text"
        placeholder="Cidade..."
        [ngModel]="cityFilter()"
        (ngModelChange)="cityFilter.set($event); load()"
      />
      <select [ngModel]="transactionFilter()" (ngModelChange)="transactionFilter.set($event); load()">
        <option value="">Tipo de negócio</option>
        <option value="SALE">Venda</option>
        <option value="RENT">Aluguel</option>
      </select>
    </div>

    @if (loading()) {
      <p class="status">Carregando imóveis...</p>
    } @else if (error()) {
      <p class="status error">{{ error() }}</p>
    } @else if (properties().length === 0) {
      <p class="status">Nenhum imóvel encontrado.</p>
    } @else {
      <div class="grid">
        @for (p of properties(); track p.id) {
          <a [routerLink]="['/properties', p.id]" class="card">
            <div class="card-body">
              <h3>{{ p.title }}</h3>
              <p class="price">{{ p.price | currency:'BRL' }}</p>
              <p class="meta">
                {{ p.transactionType === 'SALE' ? 'Venda' : 'Aluguel' }}
                · {{ p.propertyType }}
                @if (p.city) { · {{ p.city }} }
              </p>
              @if (p.bedrooms || p.areaM2) {
                <p class="details">
                  @if (p.bedrooms) { {{ p.bedrooms }} quartos }
                  @if (p.areaM2) { · {{ p.areaM2 }} m² }
                </p>
              }
            </div>
          </a>
        }
      </div>
    }
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    input, select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.95rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.15s, transform 0.15s;
      background: white;
    }
    .card:hover {
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .card-body {
      padding: 1.25rem;
    }
    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }
    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f766e;
      margin: 0 0 0.4rem;
    }
    .meta, .details {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
    }
    .status {
      text-align: center;
      color: #64748b;
      padding: 2rem;
    }
    .status.error {
      color: #dc2626;
    }
  `]
})
export class PropertyListComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  properties = signal<Property[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  cityFilter = signal('');
  transactionFilter = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.propertyService.search({
      city: this.cityFilter() || undefined,
      transactionType: this.transactionFilter() || undefined,
      size: 24
    }).subscribe({
      next: (page) => {
        this.properties.set(page.content);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar imóveis. Verifique se o backend está rodando.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}
