import { Tile38 } from '..';

describe('readOnly', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send READONLY command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(tile38.readOnly()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.readOnly(false)).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('READONLY', ['yes']);
        expect(command).toHaveBeenCalledWith('READONLY', ['no']);
    });
});
