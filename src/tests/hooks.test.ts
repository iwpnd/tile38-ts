import { HooksResponse, Tile38 } from '..';

describe('hooks', () => {
    const tile38 = new Tile38();

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    beforeAll(() =>
        expect(
            tile38
                .setHook('warehouse', 'http://10.0.20.78/endpoint')
                .nearby('fleet')
                .point(33.5123, -112.2693, 500)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        })
    );

    it('should send HOOKS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: HooksResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            hooks: [
                {
                    name: expect.any(String) as string,
                    endpoints: expect.any(Array) as string[],
                    key: expect.any(String) as string,
                    meta: expect.any(Object) as object,
                    command: expect.any(Array) as string[],
                    ttl: expect.any(Number) as number,
                },
            ],
        };

        await expect(tile38.hooks()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('HOOKS', ['*']);
    });
});
