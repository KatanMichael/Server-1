
const request = require('supertest');
const http = require('http');
const path = require('path');
const oas3Tools = require('oas3-tools');

const serverPort = 8090;

// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(__dirname, '../controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, '../api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

describe('GET /login', () => {
    let server;

    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(serverPort, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should respond with a valid token', async () => {
        const response = await request(server)
            .get('/login')
            .send(); 
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('token_type', 'Bearer');
        expect(response.body).toHaveProperty('expires_in', 15);
    });
});
