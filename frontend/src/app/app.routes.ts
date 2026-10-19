import { Routes } from '@angular/router';
import { PropertyListComponent } from './features/properties/property-list.component';
import { PropertyDetailComponent } from './features/properties/property-detail.component';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
  { path: '**', redirectTo: '' }
];
