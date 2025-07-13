import { AuthorizationUserGuard } from './authorization-user-guard.guard';

describe('AuthorizationUserGuard', () => {
  it('should create an instance', () => {
    expect(new AuthorizationUserGuard()).toBeTruthy();
  });
});
