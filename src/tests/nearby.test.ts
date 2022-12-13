import {
    BoundsNeSwResponses,
    CountResponse,
    HashesResponse,
    IdsResponse,
    ObjectsResponse,
    PointsResponse,
    Tile38,
} from '..';

describe('nearby', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(() => tile38.quit());

    beforeAll(async () => {
        await tile38.flushDb();
        await tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec();
        await tile38.set('fleet', 'truck2').point(52.25, 13.37).exec();
    });

    it('should return object', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'truck1',
                    distance: expect.any(Number) as number,
                    object: {
                        type: 'Point',
                        coordinates: [-112.2693, 33.5123],
                    },
                },
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38
                .nearby('fleet')
                .distance()
                .point(33.5121, -112.2691, 100)
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'DISTANCE',
            'POINT',
            33.5121,
            -112.2691,
            100,
        ]);
    });

    it('should return objects', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'truck1',
                    distance: expect.any(Number) as number,
                    object: {
                        type: 'Point',
                        coordinates: [-112.2693, 33.5123],
                    },
                },
                {
                    id: 'truck2',
                    distance: expect.any(Number) as number,
                    object: {
                        type: 'Point',
                        coordinates: [13.37, 52.25],
                    },
                },
            ],
            count: 2,
            cursor: 0,
        };

        await expect(
            tile38
                .nearby('fleet')
                .distance()
                .point(33.5121, -112.2691)
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'DISTANCE',
            'POINT',
            33.5121,
            -112.2691,
        ]);
    });

    it('should return ids', async () => {
        const expected: IdsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ids: ['truck1'],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.nearby('fleet').point(33.5123, -112.2693, 100).asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'IDS',
            'POINT',
            33.5123,
            -112.2693,
            100,
        ]);
    });

    it('should return ids with distance', async () => {
        const expected: IdsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ids: [{ id: 'truck1', distance: expect.any(Number) as number }],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38
                .nearby('fleet')
                .distance()
                .point(33.5123, -112.2693, 100)
                .asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'DISTANCE',
            'IDS',
            'POINT',
            33.5123,
            -112.2693,
            100,
        ]);
    });

    it('should return count', async () => {
        const expected: CountResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.nearby('fleet').point(33.5123, -112.2693, 100).asCount()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'COUNT',
            'POINT',
            33.5123,
            -112.2693,
            100,
        ]);
    });

    it('should return hashes', async () => {
        const expected: HashesResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hashes: [
                {
                    id: 'truck1',
                    hash: expect.any(String) as string,
                },
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.nearby('fleet').point(33.5123, -112.2693, 100).asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'HASHES',
            5,
            'POINT',
            33.5123,
            -112.2693,
            100,
        ]);
    });

    it('should return points', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            points: [{ id: 'truck1', point: { lat: 33.5123, lon: -112.2693 } }],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.nearby('fleet').point(33.5123, -112.2693, 100).asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'POINTS',
            'POINT',
            33.5123,
            -112.2693,
            100,
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
            ],
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.nearby('fleet').point(33.5123, -112.2693, 100).asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('NEARBY', [
            'fleet',
            'BOUNDS',
            'POINT',
            33.5123,
            -112.2693,
            100,
        ]);
    });
});
