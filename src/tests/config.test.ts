import { ConfigGetResponse, Tile38 } from '..';

describe('config', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send CONFIG commands', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: ConfigGetResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            properties: {
                autogc: expect.any(String) as string,
            },
        };

        await expect(tile38.configSet('autogc', 1)).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(tile38.configGet('autogc')).resolves.toEqual(expected);

        await expect(tile38.configRewrite()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('CONFIG', ['SET', 'autogc', 1]);
        expect(command).toHaveBeenCalledWith('CONFIG', ['GET', 'autogc']);
        expect(command).toHaveBeenCalledWith('CONFIG', ['REWRITE']);
    });
});
