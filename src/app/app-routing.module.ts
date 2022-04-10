import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent, canActivate: [AnonymousGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AnonymousGuard] },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
  {
    path: '', redirectTo: '/game', pathMatch: 'full'
  },

  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
