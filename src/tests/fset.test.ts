import { Tile38 } from '..';
import { ObjectsResponse } from '../responses';

describe('fset', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    beforeEach(() => tile38.flushDb());

    it('should send FSET command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.fSet('fleet', 'truck1', { speed: 16 }).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('FSET', [
            'fleet',
            'truck1',
            'speed',
            16,
        ]);
    });

    it('should return with fields', async () => {
        const key = 'fleet';
        const id = 'truck1';

        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            cursor: 0,
            count: 1,
            fields: ['speed'],
            objects: [
                {
                    object: {
                        type: 'Point',
                        coordinates: [-112.2693, 33.5123],
                    },
                    id: 'truck1',
                    fields: [16],
                },
            ],
        };

        await expect(
            tile38.set(key, id).point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.fSet('fleet', 'truck1', { speed: 16 }).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.within('fleet').circle(33.5123, -112.2693, 100).asObjects()
        ).resolves.toEqual(expected);

        await expect(
            tile38.set('stock', 'baguette').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38
                .fSet('stock', 'baguette', { driver: { name: 'John' } })
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.within('stock').circle(33.5123, -112.2693, 100).asObjects()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            cursor: 0,
            count: 1,
            fields: ['driver'],
            objects: [
                {
                    object: {
                        type: 'Point',
                        coordinates: [-112.2693, 33.5123],
                    },
                    id: 'baguette',
                    fields: [{ name: 'John' }],
                },
            ],
        });
    });

    it('should return with object fields', async () => {
        const key = 'fleet';
        const id = 'bus';
        const fields = { driver: { name: 'John' } };
        const { driver } = fields;

        const expected: ObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            cursor: 0,
            count: 1,
            fields: ['driver'],
            objects: [
                {
                    object: {
                        type: 'Point',
                        coordinates: [-112.2693, 33.5123],
                    },
                    id,
                    fields: [driver],
                },
            ],
        };

        await expect(
            tile38.set(key, id).point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.fSet(key, id, fields).exec()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.within(key).circle(33.5123, -112.2693, 100).asObjects()
        ).resolves.toEqual(expected);
    });
});
