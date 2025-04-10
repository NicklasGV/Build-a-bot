import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadComponent: () => 
    import('./components/home/home.component').then(it => it.HomeComponent)
  },
  {
    path: 'script-library', loadComponent: () =>
    import('./components/script-library/script-library.component').then(it => it.ScriptLibraryComponent)
  },
  {
    path: 'bot-library', loadComponent: () =>
    import('./components/bot-library/bot-library.component').then(it => it.BotLibraryComponent)
  },
  {
    path: 'bot-compiler', loadComponent: () =>
    import('./components/bot-compiler/bot-compiler.component').then(it => it.BotCompilerComponent)
  },
  {
    path: 'terms-and-conditions', loadComponent: () =>
    import('./components/terms-and-conditions/terms-and-conditions.component').then(it => it.TermsAndConditionsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
