import { Feature } from '@vpriem/geojson';
import {
    BoundsNeSwResponses,
    CountResponse,
    HashesResponse,
    ObjectsResponse,
    PointsResponse,
    Tile38,
} from '..';

describe('intersects', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');
    const feature: Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 0],
                    [0, 0],
                ],
            ],
        },
    };

    afterAll(() => tile38.quit());

    beforeAll(async () => {
        await tile38.flushDb();
        await tile38.set('fleet', 'truck1').object(feature).exec();
        await tile38
            .set('devices', 'scooter1')
            .fields({ maxSpeed: 120 })
            .object(feature)
            .exec();
        await tile38
            .set('devices', 'scooter2')
            .fields({ maxSpeed: 110, maxWeight: 1000 })
            .object(feature)
            .exec();
    });

    it('should return objects considering where statement', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'scooter1',
                    object: feature,
                },
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38
                .intersects('devices')
                .circle(0, 0, 100)
                .where('maxSpeed', 10, 10)
                .where('maxWeight', 1000, 1000)
                .noFields()
                .asObjects()
        ).resolves.toEqual({ ...expected, count: 0, objects: [] });

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'devices',
            'NOFIELDS',
            'WHERE',
            'maxSpeed',
            10,
            10,
            'WHERE',
            'maxWeight',
            1000,
            1000,
            'CIRCLE',
            0,
            0,
            100,
        ]);

        await expect(
            tile38
                .intersects('devices')
                .circle(0, 0, 100)
                .where('maxSpeed', 120, 120)
                .noFields()
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'devices',
            'NOFIELDS',
            'WHERE',
            'maxSpeed',
            120,
            120,
            'CIRCLE',
            0,
            0,
            100,
        ]);

        await expect(
            tile38
                .intersects('devices')
                .circle(0, 0, 100)
                .where('maxSpeed', 100, 130)
                .where('maxWeight', 1000, 1000)
                .noFields()
                .asObjects()
        ).resolves.toEqual({
            ...expected,
            objects: [{ id: 'scooter2', object: feature }],
        });
    });

    it('should return objects', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'truck1',
                    object: feature,
                },
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return hashes', async () => {
        const expected: HashesResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hashes: [{ id: 'truck1', hash: expect.any(String) as string }],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'HASHES',
            5,
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return points', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            points: [{ id: 'truck1', point: { lat: 0.5, lon: 0.5 } }], // center point of feature
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'POINTS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return bounds', async () => {
        const expected: BoundsNeSwResponses = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: [
                {
                    bounds: {
                        sw: {
                            lat: expect.any(Number) as number,
                            lon: expect.any(Number) as number,
                        },
                        ne: {
                            lat: expect.any(Number) as number,
                            lon: expect.any(Number) as number,
                        },
                    },
                    id: 'truck1',
                },
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'BOUNDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return objects in a sector', async () => {
        const truck = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [13.37, 52.25] },
            properties: { id: 'baguette' },
        } as Feature;

        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'truck1',
                    object: truck,
                },
            ],
            count: 1,
            cursor: 0,
        };

        await tile38.set('fleet', 'truck1').object(truck).exec();

        await expect(
            tile38
                .intersects('fleet')
                .sector(52.25191, 13.3723, 1000, 180, 270)
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'SECTOR',
            52.25191,
            13.3723,
            1000,
            180,
            270,
        ]);
    });

    it('should return count in a buffer', async () => {
        const truck = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [13.37, 52.25] },
            properties: { id: 'baguette' },
        } as Feature;

        const area = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [13.37009847164154, 52.2498254610514],
                        [13.370516896247862, 52.2498254610514],
                        [13.370516896247862, 52.25017851139772],
                        [13.37009847164154, 52.25017851139772],
                        [13.37009847164154, 52.2498254610514],
                    ],
                ],
            },
        } as Feature;

        const expected: CountResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            count: 1,
            cursor: 0,
        };

        await tile38.set('fleet', 'truck1').object(truck).exec();

        await expect(
            tile38.intersects('fleet').object(area).asCount()
        ).resolves.toEqual({ ...expected, count: 0 });

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'COUNT',
            'OBJECT',
            '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[13.37009847164154,52.2498254610514],[13.370516896247862,52.2498254610514],[13.370516896247862,52.25017851139772],[13.37009847164154,52.25017851139772],[13.37009847164154,52.2498254610514]]]}}',
        ]);

        await expect(
            tile38.intersects('fleet').buffer(10).object(area).asCount()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'BUFFER',
            10,
            'COUNT',
            'OBJECT',
            '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[13.37009847164154,52.2498254610514],[13.370516896247862,52.2498254610514],[13.370516896247862,52.25017851139772],[13.37009847164154,52.25017851139772],[13.37009847164154,52.2498254610514]]]}}',
        ]);
    });
});
