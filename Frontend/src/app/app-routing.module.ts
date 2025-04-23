import { DiscordCallbackComponent } from './components/discord-callback/discord-callback.component';
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
    path: 'signup', loadComponent: () =>
    import('./components/logon/signup/signup.component').then(it => it.SignupComponent)
  },
  {
    path: 'login', loadComponent: () =>
    import('./components/logon/login/login.component').then(it => it.LoginComponent)
  },
  {
    path: 'terms-and-conditions', loadComponent: () =>
    import('./components/terms-and-conditions/terms-and-conditions.component').then(it => it.TermsAndConditionsComponent)
  },
  {
    path: 'auth/callback', loadComponent: () =>
    import('./components/discord-callback/discord-callback.component').then(it => it.DiscordCallbackComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
