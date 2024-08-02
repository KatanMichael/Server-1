import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index'; // Ensure the path is correct to import your app

describe('POST /login', () => {
  it('should return a valid access token', async () => {
    const response = await request(app)
      .post('/login')
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('token_type', 'Bearer');
    expect(response.body).toHaveProperty('expires_in', 15);
  });
});