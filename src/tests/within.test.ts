import { Feature } from '@vpriem/geojson';
import {
    BoundsNeSwResponses,
    CountResponse,
    HashesResponse,
    IdsResponse,
    ObjectsResponse,
    PointsResponse,
    Tile38,
} from '..';

describe('within', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(() => tile38.quit());

    beforeAll(async () => {
        await tile38.flushDb();
        await tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec();
    });

    it('should return objects', async () => {
        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                {
                    id: 'truck1',
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
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'CIRCLE',
            33.5123,
            -112.2693,
            100,
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
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'IDS',
            'CIRCLE',
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
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asCount()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'COUNT',
            'CIRCLE',
            33.5123,
            -112.2693,
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
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asHashes(5)
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'HASHES',
            5,
            'CIRCLE',
            33.5123,
            -112.2693,
            100,
        ]);
    });

    it('should return points', async () => {
        const expected: PointsResponse = {
            elapsed: expect.any(String) as string,
            points: [{ id: 'truck1', point: { lat: 33.5123, lon: -112.2693 } }],
            ok: true,
            count: 1,
            cursor: 0,
        };

        await expect(
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asPoints()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'POINTS',
            'CIRCLE',
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
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asBounds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
            'fleet',
            'BOUNDS',
            'CIRCLE',
            33.5123,
            -112.2693,
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
                .within('fleet')
                .sector(52.25191, 13.3723, 1000, 180, 270)
                .asObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('WITHIN', [
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
            tile38.within('fleet').object(area).asCount()
        ).resolves.toEqual({ ...expected, count: 0 });

        expect(command).toHaveBeenCalledWith('WITHIN', [
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
