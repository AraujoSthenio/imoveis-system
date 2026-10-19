import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../core/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" class="back">← Voltar</a>

    @if (loading()) {
      <p class="status">Carregando...</p>
    } @else if (error()) {
      <p class="status error">{{ error() }}</p>
    } @else if (property(); as p) {
      <article class="detail">
        <h1>{{ p.title }}</h1>
        <p class="price">{{ p.price | currency:'BRL' }}</p>

        <div class="badges">
          <span class="badge">{{ p.transactionType === 'SALE' ? 'Venda' : 'Aluguel' }}</span>
          <span class="badge">{{ p.propertyType }}</span>
        </div>

        @if (p.description) {
          <p class="description">{{ p.description }}</p>
        }

        <dl class="info">
          @if (p.areaM2) { <dt>Área</dt><dd>{{ p.areaM2 }} m²</dd> }
          @if (p.bedrooms) { <dt>Quartos</dt><dd>{{ p.bedrooms }}</dd> }
          @if (p.bathrooms) { <dt>Banheiros</dt><dd>{{ p.bathrooms }}</dd> }
          @if (p.parkingSpaces) { <dt>Vagas</dt><dd>{{ p.parkingSpaces }}</dd> }
          @if (p.city) {
            <dt>Localização</dt>
            <dd>
              {{ p.street }}{{ p.number ? ', ' + p.number : '' }}
              @if (p.neighborhood) { — {{ p.neighborhood }} }
              <br>{{ p.city }}@if (p.state) { / {{ p.state }} }
            </dd>
          }
        </dl>

        <footer class="audit">
          Criado em {{ p.createdAt | date:'dd/MM/yyyy HH:mm' }}
          · Atualizado em {{ p.updatedAt | date:'dd/MM/yyyy HH:mm' }}
          · Versão {{ p.version }}
        </footer>
      </article>
    }
  `,
  styles: [`
    .back {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: #0f766e;
      text-decoration: none;
    }
    h1 { margin: 0 0 0.5rem; }
    .price {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f766e;
      margin: 0 0 1rem;
    }
    .badges { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .badge {
      background: #e2e8f0;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
    }
    .description {
      line-height: 1.6;
      color: #334155;
      margin-bottom: 1.5rem;
    }
    .info {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 0.5rem 1rem;
      margin-bottom: 2rem;
    }
    dt { font-weight: 600; color: #64748b; }
    dd { margin: 0; }
    .audit {
      font-size: 0.8rem;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
    }
    .status { text-align: center; color: #64748b; padding: 2rem; }
    .status.error { color: #dc2626; }
  `]
})
export class PropertyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);

  property = signal<Property | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID inválido');
      this.loading.set(false);
      return;
    }

    this.propertyService.findById(id).subscribe({
      next: (p) => {
        this.property.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Imóvel não encontrado');
        this.loading.set(false);
      }
    });
  }
}
