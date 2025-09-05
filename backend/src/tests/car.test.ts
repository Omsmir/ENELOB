import supertest from 'supertest';

import App from '../app';
import CarRoute from '../routes/car.route';

beforeAll(async () => {
    jest.setTimeout(10000);
});
afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe('car', () => {
    const MockedCar = {
        _id: 'car-123',
        name: 'car1',
        type: 'mercedes',
        color: 'red',
        used: false,
        price: 16000,
        seats: '6',
    };

    describe('get car route', () => {
        describe('car does not exists ', () => {
            it('it should return code 404 and message', async () => {
                const carId = 'car-1';


            });
        });

        describe(`car do exists`, () => {
            it('it should return 200 and the car', async () => {
                const carId = 'car_123';

                const carRoutes = new CarRoute();

                const cars = await carRoutes.carController

                expect(cars).toEqual(MockedCar);
            });
        });
    });
});
