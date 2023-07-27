import { StatsResponse, Tile38 } from '..';

describe('stats', () => {
    const tile38 = new Tile38();

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    it('should send STATS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        const expected: StatsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            stats: [
                {
                    in_memory_size: expect.any(Number) as number,
                    num_objects: expect.any(Number) as number,
                    num_points: expect.any(Number) as number,
                    num_strings: expect.any(Number) as number,
                },
                null,
            ],
        };

        await expect(tile38.stats('fleet', 'fleet123')).resolves.toEqual(
            expected
        );

        expect(command).toHaveBeenCalledWith('STATS', ['fleet', 'fleet123']);
    });
});
