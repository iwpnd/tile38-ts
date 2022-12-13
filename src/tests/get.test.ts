import { Point } from '@vpriem/geojson';
import {
    BoundsNeSwResponse,
    HashResponse,
    ObjectResponse,
    PointResponse,
    StringObjectResponse,
    Tile38,
} from '..';

describe('get', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(() => tile38.quit());

    beforeAll(() =>
        expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        })
    );

    it('should get as object', async () => {
        const expected: ObjectResponse<Point> = {
            elapsed: expect.any(String) as string,
            ok: true,
            object: {
                type: 'Point',
                coordinates: [
                    expect.any(Number) as number,
                    expect.any(Number) as number,
                ],
            },
        };

        await expect(tile38.get('fleet', 'truck1').asObject()).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('GET', ['fleet', 'truck1']);
    });

    it.each([{ test: 'test' }, { test: 1 }, { test: { test: 1 } }])(
        'should get as object with fields',
        async (fields) => {
            await expect(
                tile38
                    .set('fleet', 'truck2')
                    .fields(fields)
                    .point(33.5123, -112.2693)
                    .exec()
            ).resolves.toEqual({
                elapsed: expect.any(String) as string,
                ok: true,
            });

            const expected: ObjectResponse<Point> = {
                elapsed: expect.any(String) as string,
                ok: true,
                object: {
                    type: 'Point',
                    coordinates: [
                        expect.any(Number) as number,
                        expect.any(Number) as number,
                    ],
                },
                fields,
            };

            await expect(
                tile38.get('fleet', 'truck2').withFields().asObject()
            ).resolves.toEqual(expected);

            expect(command).toHaveBeenNthCalledWith(2, 'GET', [
                'fleet',
                'truck2',
                'WITHFIELDS',
            ]);
        }
    );

    it('should get as string object', async () => {
        const expected: StringObjectResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            object: 'John',
        };

        await tile38.set('fleet', 'truck1:driver').string('John').exec();

        await expect(
            tile38.get('fleet', 'truck1:driver').asString()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('GET', ['fleet', 'truck1:driver']);
    });

    it('should get as point', async () => {
        const expected: PointResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            point: {
                lat: expect.any(Number) as number,
                lon: expect.any(Number) as number,
            },
        };

        await expect(tile38.get('fleet', 'truck1').asPoint()).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('GET', [
            'fleet',
            'truck1',
            'POINT',
        ]);
    });

    it('should get as hash', async () => {
        const expected: HashResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hash: expect.any(String) as string,
        };

        await expect(tile38.get('fleet', 'truck1').asHash(5)).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('GET', [
            'fleet',
            'truck1',
            'HASH',
            5,
        ]);
    });

    it('should get as bounds', async () => {
        const expected: BoundsNeSwResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: {
                ne: {
                    lat: expect.any(Number) as number,
                    lon: expect.any(Number) as number,
                },
                sw: {
                    lat: expect.any(Number) as number,
                    lon: expect.any(Number) as number,
                },
            },
        };

        await expect(tile38.get('fleet', 'truck1').asBounds()).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('GET', [
            'fleet',
            'truck1',
            'BOUNDS',
        ]);
    });
});
