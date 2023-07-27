import { Tile38 } from '..';

describe('expire', () => {
    const tile38 = new Tile38();

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    it('should send EXPIRE command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.expire('fleet', 'truck1', 1)).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('EXPIRE', ['fleet', 'truck1', 1]);
    });
});
