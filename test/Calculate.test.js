const request = require('supertest');
const http = require('http');
const path = require('path');
const oas3Tools = require('oas3-tools');

const serverPort = 8081;

// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(__dirname, '../controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, '../api/openapi.yaml'), options);
const app = expressAppConfig.getApp();
let token;

describe('POST /calculate', () => {
    let server;

    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(serverPort, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    /*
        BASE CASE TEST
    */
    it('should calculate the sum of two numbers', async () => {
        // First, log in to get the token
        const loginResponse =  await request(server)
        .get('/login')
        .send();// Assuming no payload is required for this request

        token = loginResponse.body.access_token;

        // Then, use the token to call the /c   alculate endpoint
        const calculateResponse = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `+`)
            .send({ number1: 1, number2: 21 });

        expect(calculateResponse.status).toBe(200);
        expect(calculateResponse.body).toHaveProperty('result', 22);
    });

    /*
        Header Tests
    */

    it('should return 401 if the authorization header is missing', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('operation', `+`)
            .send({ number1: 0.5, number2: 0.5 });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
    });


    it('should return 401 if the operation header is missing', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .send({ number1: 1, number2: 2 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    /*
        Body Tests
    */

    it('should return 400 if body parameters are missing', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `+`)
            .send({ number1: 10 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 400 if body parameters are missing', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `+`)
            .send({ numbera: 1, numberb: 2 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    /*
        JWT Tests
    */
    
    it('should return 401 if the token is expired', async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJudW1iZXIiOjI5MDM1OCwiaWF0IjoxNzIyNjgwMzA0LCJleHAiOjE3MjI2ODAzNjR9.b119SZ6OyjyBmXVeNC1MqirhQrjSXPKFcWlWmGQ0Akk';

        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${expiredToken}`)
            .set('operation', `+`)
            .send({ number1: 1, number2: 2 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 403 if the user is unauthorized', async () => {
        const unauthorizedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJpYXQiOjE1MTYyMzkwMjJ9.4_ljsDqUhc9BGKQy5sDeTgyQ6W4QhsPzD_mH-8T3v0A'; // Some invalid token

        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${unauthorizedToken}`)
            .set('operation', `+`)
            .send({ number1: 1, number2: 2 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Forbidden');
    });


    /*
        Multiplication Tests
    */
    it('should calculate the multiplication of 2 negative numbers', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: -10, number2: -5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 50);
    });

    it('should calculate the multiplication of 1 negative number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 10, number2: -5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', -50);
    });

    it('should calculate the multiplication of 2 positive number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 10, number2: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 50);
    });

    it('should calculate the multiplication of 2 fractions positive number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 2, number2: 0.5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 1);
    });
    
    it('should calculate the multiplication of 2 fractions positive number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 0.5, number2: 0.5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 0.25);
    });

    it('should calculate the multiplication of 2 fractions negative number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: -0.5, number2: -0.5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 0.25);
    });

    it('should calculate the multiplication of 2 fractions positive number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 0.5, number2: -0.5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', -0.25);
    });

    it('should calculate the multiplication of 2 fractions positive number', async () => {
        const response = await request(server)
            .post('/calculate')
            .set('Authorization', `Bearer ${token}`)
            .set('operation', `*`)
            .send({ number1: 0.5, number2: -2 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', -1);
    });

    /*
        Addation Test
    */

        it('should calculate the sum of big two numbers', async () => {
            const response = await request(server)
                .post('/calculate')
                .set('Authorization', `Bearer ${token}`)
                .set('operation', `+`)
                .send({ number1: 100, number2: 200 });
    
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 300);
        });
    
    it('should calculate the sum of fractional numbers', async () => {
            const response = await request(server)
                .post('/calculate')
                .set('Authorization', `Bearer ${token}`)
                .set('operation', `+`)
                .send({ number1: 0.5, number2: 0.5 });
    
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 1);
        });
    
    it('should calculate the sum of negative numbers', async () => {
            const response = await request(server)
                .post('/calculate')
                .set('Authorization', `Bearer ${token}`)
                .set('operation', `+`)
                .send({ number1: -10, number2: -5 });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('result', -15);
        });

        it('should calculate the sum of 2 negative factorial numbers', async () => {
            const response = await request(server)
                .post('/calculate')
                .set('Authorization', `Bearer ${token}`)
                .set('operation', `+`)
                .send({ number1: -0.5, number2: -0.25 });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('result', -0.75);
        });

        it('should calculate the sum of 1 negative factorial numbers', async () => {
            const response = await request(server)
                .post('/calculate')
                .set('Authorization', `Bearer ${token}`)
                .set('operation', `+`)
                .send({ number1: -0.5, number2: 1 });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('result', 0.5);
        });

            it('should calculate the Division of zero', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: 5, number2: 0 });
        
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('error', 'Bad Request');
            });

            it('should calculate the Division of 2 positive number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: 10, number2: 2 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 5);
            });
            
            it('should calculate the Division of 2 positive factorial number2', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: 0.5, number2: 0.2 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 2.5);
            });

            it('should calculate the Division of 1 positive factorial number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: 2, number2: 0.2 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 10);
            });

            it('should calculate the Division of 2 negative factorial number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: -10, number2: -5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 2);
            });

            it('should calculate the Division of 2 negative factorial number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: -10, number2: -5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 2);
            });

            it('should calculate the Division of 1 negative and 1 factorial number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: -10, number2: 0.5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -20);
            });

            it('should calculate the Division of 1 negative and 1 factorial number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `/`)
                    .send({ number1: -10, number2: 0.5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -20);
            });

            /*
                Subtraction Test 
            */
           it('should calculate the Subtraction of 2 positive numbers', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: 10, number2: 7 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 3);
            })

            it('should calculate the Subtraction of 1 positive number (Addition)', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: 10, number2: -7 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 17);
            })

            it('should calculate the Subtraction of 1 positive number', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: -10, number2: 7 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -17);
            })

            it('should calculate the Subtraction of 2 negative numbers (Addition)', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: -10, number2: -7 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -3);
            })

            it('should calculate the Subtraction of 2 factorial numbers', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: 0.5, number2: 0.25 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 0.25);
            })

            it('should calculate the Subtraction of 2 factorial numbers', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: -0.5, number2: 0.25 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -0.75);
            })

            it('should calculate the Subtraction of 2 factorial numbers (Addition)', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: -0.5, number2: -0.25 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -0.25);
            })

            it('should calculate the Subtraction of 1 factorial numbers (Addition)', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: 41.5, number2: -0.5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', 42);
            })

            it('should calculate the Subtraction of 1 factorial numbers', async () => {
                const response = await request(server)
                    .post('/calculate')
                    .set('Authorization', `Bearer ${token}`)
                    .set('operation', `-`)
                    .send({ number1: -0.5, number2: 41.5 });
        
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('result', -42);
            })

        });