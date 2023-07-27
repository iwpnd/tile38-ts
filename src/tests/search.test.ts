import { CountResponse, IdsResponse, StringObjectsResponse, Tile38 } from '..';

describe('search', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    beforeAll(async () => {
        await tile38.flushDb();
        await tile38.set('fleet', 'truck1').string('a').exec();
        await tile38
            .set('fleet', 'truck2')
            .fields({ maxSpeed: 120 })
            .string('b')
            .exec();
        await tile38
            .set('fleet', 'truck3')
            .fields({ maxSpeed: 100, maxWeight: 1000 })
            .string('c')
            .exec();
    });

    it('should return objects considering where query', async () => {
        const expected: StringObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [],
            count: 2,
            cursor: 0,
        };

        await expect(
            tile38
                .search('fleet')
                .noFields()
                .where('maxSpeed', 100, 120)
                .asStringObjects()
        ).resolves.toEqual({
            ...expected,
            objects: [
                { id: 'truck2', object: 'b' },
                { id: 'truck3', object: 'c' },
            ],
        });

        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'WHERE',
            'maxSpeed',
            100,
            120,
        ]);

        await expect(
            tile38
                .search('fleet')
                .noFields()
                .where('maxSpeed', 100, 120)
                .where('maxWeight', 1000, 1000)
                .asStringObjects()
        ).resolves.toEqual({
            ...expected,
            objects: [{ id: 'truck3', object: 'c' }],
            count: 1,
        });

        expect(command).toHaveBeenCalledWith('SEARCH', [
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
        const expected: StringObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                { id: 'truck1', object: 'a' },
                { id: 'truck2', object: 'b' },
                { id: 'truck3', object: 'c' },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.search('fleet').noFields().asStringObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SEARCH', ['fleet', 'NOFIELDS']);
    });

    it('should return all objects in 1 request', async () => {
        const expected: StringObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                { id: 'truck1', object: 'a' },
                { id: 'truck2', object: 'b' },
                { id: 'truck3', object: 'c' },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.search('fleet').noFields().all().asStringObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(2);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'LIMIT',
            100,
        ]);
    });

    it('should return all objects in 3 requests', async () => {
        const expected: StringObjectsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            objects: [
                { id: 'truck1', object: 'a' },
                { id: 'truck2', object: 'b' },
                { id: 'truck3', object: 'c' },
            ],
            count: 3,
            cursor: 0,
        };

        await expect(
            tile38.search('fleet').all().noFields().limit(1).asStringObjects()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
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

        await expect(
            tile38.search('fleet').noFields().asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SEARCH', [
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
            tile38.search('fleet').noFields().all().limit(1).asIds()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledTimes(4);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'CURSOR',
            0,
            'COUNT',
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            0,
            'IDS',
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'LIMIT',
            1,
            'CURSOR',
            1,
            'IDS',
        ]);
        expect(command).toHaveBeenCalledWith('SEARCH', [
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
            tile38.search('fleet').noFields().asCount()
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SEARCH', [
            'fleet',
            'NOFIELDS',
            'COUNT',
        ]);
    });
});
