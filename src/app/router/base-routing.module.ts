import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageErrors } from '@/ts/enum';
import { AuthRouterModule } from './auth-router.module';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/layouts/default/default.component').then(
        (m) => m.DefaultComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('@/pages/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('@/pages/products/products-list/products-list.component').then(
            (m) => m.ProductsListComponent
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('@/pages/cart/cart.component').then((m) => m.CartComponent),
      },
      {
        path: 'errors/not-found',
        loadComponent: () =>
          import('@/pages/errors/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: PageErrors.NotFound,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" }),
    AuthRouterModule,
  ],
})
export class BaseRoutingModule {}
