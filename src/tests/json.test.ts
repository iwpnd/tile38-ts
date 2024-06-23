import { JsonGetResponse, Tile38 } from '..';

describe('json', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send JGET/JSET/JDEL command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38
                .set('fleet', 'truck1')
                .object({
                    type: 'Point',
                    coordinates: [1, 2, 3],
                })
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.jSet('fleet', 'truck1', 'coordinates.1', 1)
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('JSET', [
            'fleet',
            'truck1',
            'coordinates.1',
            1,
        ]);

        await expect(
            tile38.jDel('fleet', 'truck1', 'coordinates.2')
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('JDEL', [
            'fleet',
            'truck1',
            'coordinates.2',
        ]);

        const expected: JsonGetResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            value: '1',
        };

        await expect(
            tile38.jGet('fleet', 'truck1', 'coordinates.1', 'RAW')
        ).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('JGET', [
            'fleet',
            'truck1',
            'coordinates.1',
            'RAW',
        ]);

        await expect(tile38.jGet('fleet', 'truck1')).resolves.toEqual({
            ...expected,
            value: '{"type":"Point","coordinates":[1,1]}',
        });
    });

    it('should send JGET/JSET/JDEL command with options', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38
                .set('linestring', '1')
                .object({
                    type: 'LineString',
                    coordinates: [
                        [0, 0],
                        [1, 1],
                    ],
                })
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.jSet('linestring', '1', 'coordinates.-1', '[2,2]', 'RAW')
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('JSET', [
            'linestring',
            '1',
            'coordinates.-1',
            '[2,2]',
            'RAW',
        ]);

        const expected: JsonGetResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            value: '{"type":"LineString","coordinates":[[0,0],[1,1],[2,2]]}',
        };

        await expect(tile38.jGet('linestring', '1')).resolves.toEqual(expected);
    });
});
