import { describe, it, expect } from 'vitest';
import { SchemaGenerator } from '../../../utils/validation/SchemaGenerator';
import { LoginFormSchema } from './LoginSchema';

describe('LoginFormSchema validation', () => {
  const schema = new SchemaGenerator(LoginFormSchema);
  const rules = schema.getRules();

  it('fails when both username and password are empty', async () => {
    await expect(rules.validate({ userName: '', password: '' })).rejects.toThrow();
  });

  it('fails when username is missing', async () => {
    await expect(rules.validate({ userName: '', password: 'password123' })).rejects.toThrow(
      /Username or Email is required/i
    );
  });

  it('fails when password is missing', async () => {
    await expect(rules.validate({ userName: 'validUser', password: '' })).rejects.toThrow(
      /Password is required/i
    );
  });

  it('fails when username has invalid format/characters', async () => {
    await expect(
      rules.validate({ userName: 'user with spaces!', password: 'password123' })
    ).rejects.toThrow(/Invalid Email or Username/i);
  });

  it('passes when valid username and password are provided', async () => {
    const validData = { userName: 'test_user-123', password: 'secretPassword' };
    const result = await rules.validate(validData);
    expect(result).toMatchObject(validData);
  });

  it('passes when valid email and password are provided', async () => {
    const validData = { userName: 'test@example.com', password: 'secretPassword' };
    const result = await rules.validate(validData);
    expect(result).toMatchObject(validData);
  });
});
