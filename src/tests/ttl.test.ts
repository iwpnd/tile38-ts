import { TTLResponse, Tile38 } from '..';

describe('ttl', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send TTL command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        const expected: TTLResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ttl: expect.any(Number) as number,
        };

        await expect(tile38.ttl('fleet', 'truck1')).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('TTL', ['fleet', 'truck1']);
    });
});
