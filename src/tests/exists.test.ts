import { Tile38 } from '..';

describe('exists', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    beforeEach(() => tile38.flushDb());

    it('should send EXISTS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.exists('fleet', 'truck1')).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            exists: true,
        });

        expect(command).toHaveBeenCalledWith('EXISTS', ['fleet', 'truck1']);

        await expect(tile38.exists('fleet', 'bobbycar')).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            exists: false,
        });
    });
});
