import { DiscordCallbackComponent } from './components/discord-callback/discord-callback.component';
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { UserBotsComponent } from './components/profile/user-bots/user-bots.component';
import { UserPostsComponent } from './components/profile/user-posts/user-posts.component';
import { AuthGuard } from './services/Guard/auth.guard';

const routes: Routes = [
  {
    path: '', loadComponent: () => 
    import('./components/home/home.component').then(it => it.HomeComponent)
  },
  {
    path: 'libraries', loadComponent: () =>
    import('./components/libraries/libraries.component').then(it => it.LibrariesComponent)
  },
  {
    path: 'script-library', loadComponent: () =>
    import('./components/script-library/script-library.component').then(it => it.ScriptLibraryComponent)
  },
  {
    path: 'script-library/:id', loadComponent: () =>
    import('./components/script-detail/script-detail.component').then(it => it.ScriptDetailComponent)
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
    path: 'forum', loadComponent: () =>
    import('./components/forum/forum.component').then(it => it.ForumComponent)
  },
  {
    path: 'post/:id', loadComponent: () =>
    import('./components/post/post.component').then(it => it.PostComponent)
  },
  {
    path: 'auth/callback', loadComponent: () =>
    import('./components/discord-callback/discord-callback.component').then(it => it.DiscordCallbackComponent)
  },
  {
    path: 'user-profile/:userName', loadComponent: ()=> 
    import('./components/profile/dashboard/dashboard.component').then( it => it.DashboardComponent),
    children: [
      { path: '',       redirectTo: 'bots', pathMatch: 'full' },
      { path: 'bots',   component: UserBotsComponent },
      { path: 'posts',  component: UserPostsComponent },
    ]
  },
  {
    path: 'admin/admin-dashboard', loadComponent: () =>
    import('./components/admin/admin-dashboard/admin-dashboard.component').then(it => it.AdminDashboardComponent), canActivate: [AuthGuard]
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
