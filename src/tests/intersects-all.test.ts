import { Feature } from '@vpriem/geojson';
import {
    Bounds,
    BoundsBase,
    BoundsNeSwResponses,
    HashBase,
    HashesResponse,
    IdsResponse,
    LatLon,
    ObjectBase,
    ObjectsResponse,
    PointBase,
    PointsResponse,
    Tile38,
} from '..';

describe('intersects all', () => {
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
        await tile38.set('fleet', 'truck2').object(feature).exec();
        await tile38.set('fleet', 'truck3').object(feature).exec();
    });

    it('should return all objects in 3 requests', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: expect.arrayContaining([
                { id: 'truck1', object: feature },
                { id: 'truck2', object: feature },
                { id: 'truck3', object: feature },
            ]) as ObjectBase[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38
                .intersects('fleet')
                .circle(0, 0, 100)
                .all()
                .limit(1)
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return all objects in 1 request', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: expect.arrayContaining([
                { id: 'truck1', object: feature },
                { id: 'truck2', object: feature },
                { id: 'truck3', object: feature },
            ]) as ObjectBase[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).all().asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(2);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'LIMIT',
            100,
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return all hashes in 3 requests', async () => {
        const expected: HashesResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hashes: expect.arrayContaining([
                { id: 'truck1', hash: expect.any(String) as string },
                { id: 'truck2', hash: expect.any(String) as string },
                { id: 'truck3', hash: expect.any(String) as string },
            ]) as HashBase[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38
                .intersects('fleet')
                .circle(0, 0, 100)
                .all()
                .limit(1)
                .asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'HASHES',
            5,
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'HASHES',
            5,
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'HASHES',
            5,
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return all points in 3 requests', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            points: expect.arrayContaining([
                { id: 'truck1', point: expect.any(Object) as LatLon },
                { id: 'truck2', point: expect.any(Object) as LatLon },
                { id: 'truck3', point: expect.any(Object) as LatLon },
            ]) as PointBase[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38
                .intersects('fleet')
                .circle(0, 0, 100)
                .all()
                .limit(1)
                .asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'POINTS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'POINTS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'POINTS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return all bounds in 3 requests', async () => {
        const expected: BoundsNeSwResponses = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: expect.arrayContaining([
                { id: 'truck1', bounds: expect.any(Object) as Bounds },
                { id: 'truck2', bounds: expect.any(Object) as Bounds },
                { id: 'truck3', bounds: expect.any(Object) as Bounds },
            ]) as BoundsBase[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38
                .intersects('fleet')
                .circle(0, 0, 100)
                .all()
                .limit(1)
                .asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'BOUNDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'BOUNDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'BOUNDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });

    it('should return all ids in 3 requests', async () => {
        const expected: IdsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ids: expect.arrayContaining([
                'truck1',
                'truck2',
                'truck3',
            ]) as string[],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.intersects('fleet').circle(0, 0, 100).all().limit(1).asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'CURSOR',
            0,
            'COUNT',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'IDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'IDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
        expect(command).toHaveBeenCalledWith('INTERSECTS', [
            'fleet',
            'LIMIT',
            1,
            'CURSOR',
            2,
            'IDS',
            'CIRCLE',
            0,
            0,
            100,
        ]);
    });
});
