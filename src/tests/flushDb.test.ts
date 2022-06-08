import { Tile38 } from '..';

describe('flushDb', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send FLUSHDB command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(tile38.flushDb()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('FLUSHDB');
    });
});
