import { Feature } from '@vpriem/geojson';
import {
    Bounds,
    BoundsNeSwResponses,
    CountResponse,
    HashesResponse,
    IdsResponse,
    LatLon,
    ObjectsResponse,
    PointsResponse,
    Tile38,
} from '..';

describe('scan', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');
    const feature: Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [33.5123, -112.2693],
        },
    };

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    beforeAll(async () => {
        await tile38.flushDb();
        await tile38.set('fleet', 'truck1').object(feature).exec();
        await tile38
            .set('fleet', 'truck2')
            .fields({ maxSpeed: 120 })
            .object(feature)
            .exec();
        await tile38
            .set('fleet', 'truck3')
            .fields({ maxSpeed: 100, maxWeight: 1000 })
            .object(feature)
            .exec();
    });

    it('should return objects considering the where query', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [],
            count: 0,
            cursor: 0,
        };

        await expect(
            tile38
                .scan('fleet')
                .noFields()
                .where('maxSpeed', 100, 120)
                .asObjects()
        ).resolves.toEqual({
            ...expected,
            count: 2,
            objects: [
                { id: 'truck2', object: feature },
                { id: 'truck3', object: feature },
            ],
        });

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'WHERE',
            'maxSpeed',
            100,
            120,
        ]);

        await expect(
            tile38
                .scan('fleet')
                .noFields()
                .where('maxSpeed', 100, 120)
                .where('maxWeight', 1000, 1000)
                .asObjects()
        ).resolves.toEqual({
            ...expected,
            objects: [{ id: 'truck3', object: feature }],
            count: 1,
        });

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'WHERE',
            'maxSpeed',
            100,
            120,
            'WHERE',
            'maxWeight',
            1000,
            1000,
        ]);
    });

    it('should return objects', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                { id: 'truck1', object: feature },
                { id: 'truck2', object: feature },
                { id: 'truck3', object: feature },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SCAN', ['fleet', 'NOFIELDS']);
    });

    it('should return all objects in 2 requests', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                { id: 'truck1', object: feature },
                { id: 'truck2', object: feature },
                { id: 'truck3', object: feature },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').all().noFields().limit(1).asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            2,
        ]);
    });

    it('should return ids', async () => {
        const expected: IdsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ids: ['truck1', 'truck2', 'truck3'],
            count: 3,
            cursor: 0,
        };

        await expect(tile38.scan('fleet').noFields().asIds()).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'IDS',
        ]);
    });

    it('should return all ids in 3 requests', async () => {
        const expected: IdsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ids: ['truck1', 'truck2', 'truck3'],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().all().limit(1).asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'IDS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'IDS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'IDS',
        ]);
    });

    it('should return count', async () => {
        const expected: CountResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().asCount()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'COUNT',
        ]);
    });

    it('should return hashes', async () => {
        const expected: HashesResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hashes: [
                { id: 'truck1', hash: expect.any(String) as string },
                { id: 'truck2', hash: expect.any(String) as string },
                { id: 'truck3', hash: expect.any(String) as string },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'HASHES',
            5,
        ]);
    });

    it('should return all hashes in 3 requests', async () => {
        const expected: HashesResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hashes: [
                { id: 'truck1', hash: expect.any(String) as string },
                { id: 'truck2', hash: expect.any(String) as string },
                { id: 'truck3', hash: expect.any(String) as string },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').all().noFields().limit(1).asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'HASHES',
            5,
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'HASHES',
            5,
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'HASHES',
            5,
        ]);
    });

    it('should return points', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            points: [
                {
                    id: 'truck1',
                    point: {
                        lat: expect.any(Number) as number,
                        lon: expect.any(Number) as number,
                    },
                },
                {
                    id: 'truck2',
                    point: {
                        lat: expect.any(Number) as number,
                        lon: expect.any(Number) as number,
                    },
                },
                {
                    id: 'truck3',
                    point: {
                        lat: expect.any(Number) as number,
                        lon: expect.any(Number) as number,
                    },
                },
            ],
            ok: true,
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'POINTS',
        ]);
    });

    it('should return all points in 3 requests', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            points: [
                { id: 'truck1', point: expect.any(Object) as LatLon },
                { id: 'truck2', point: expect.any(Object) as LatLon },
                { id: 'truck3', point: expect.any(Object) as LatLon },
            ],
            ok: true,
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().all().limit(1).asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'POINTS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'POINTS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'POINTS',
        ]);
    });

    it('should return bounds', async () => {
        const expected: BoundsNeSwResponses = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: [
                {
                    id: 'truck1',
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
                },
                {
                    id: 'truck2',
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
                },
                {
                    id: 'truck3',
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
                },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').noFields().asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'BOUNDS',
        ]);
    });

    it('should return all bounds in 3 requests', async () => {
        const expected: BoundsNeSwResponses = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: [
                { id: 'truck1', bounds: expect.any(Object) as Bounds },
                { id: 'truck2', bounds: expect.any(Object) as Bounds },
                { id: 'truck3', bounds: expect.any(Object) as Bounds },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.scan('fleet').all().noFields().limit(1).asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'BOUNDS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'BOUNDS',
        ]);
        expect(command).toHaveBeenCalledWith('SCAN', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'BOUNDS',
        ]);
    });
});
