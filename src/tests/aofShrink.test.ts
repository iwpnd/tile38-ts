import { Tile38 } from '..';

describe('aofShrink', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send AOFSHRINK command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(tile38.aofShrink()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('AOFSHRINK');
    });
});
