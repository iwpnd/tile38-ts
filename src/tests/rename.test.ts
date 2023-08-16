import { Tile38 } from '..';

describe('rename', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    beforeAll(() => tile38.flushDb());

    afterAll(() => tile38.quit());

    it('should send RENAME command', async () => {
        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.rename('fleet', 'fleet2')).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('RENAME', ['fleet', 'fleet2']);
    });

    it('should send RENAMENX command', async () => {
        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.rename('fleet', 'fleet2', true)).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('RENAMENX', ['fleet', 'fleet2']);
    });
});
