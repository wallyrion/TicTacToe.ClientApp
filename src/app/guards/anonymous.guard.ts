import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.userService.isUserLoading) {
        return this.userService.user$
          .pipe(switchMap(user => {
            if (!user) {
              return of(true);
            }
            return of (this.router.parseUrl('/'))
          }))
      }

      if (!this.userService.currentUser) {
        return true;
      }

      return this.router.parseUrl('/');
  }
  
}
