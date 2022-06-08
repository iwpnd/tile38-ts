import { KeysResponse, Tile38 } from '..';

describe('keys', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send KEYS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        const expected: KeysResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            keys: expect.any(Array) as string[],
        };

        await expect(tile38.keys()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('KEYS', ['*']);
    });
});
