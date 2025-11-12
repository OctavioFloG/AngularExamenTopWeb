import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { Auth } from '../auth/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<Auth>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('Auth', ['isAuthenticated']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Auth, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate({} as any, {} as any)).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to root and deny access when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate({} as any, {} as any)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
