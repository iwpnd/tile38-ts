import { ChansResponse, Tile38 } from '..';

describe('chans', () => {
    const tile38 = new Tile38();

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    beforeAll(async () => {
        await tile38.pDelChan('*');

        await expect(
            tile38
                .setChan('parking')
                .nearby('fleet')
                .point(33.5123, -112.2693, 500)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });
    });

    it('should send CHANS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: ChansResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            chans: [
                {
                    name: expect.any(String) as string,
                    key: expect.any(String) as string,
                    meta: expect.any(Object) as object,
                    command: expect.any(Array) as string[],
                    ttl: expect.any(Number) as number,
                },
            ],
        };

        await expect(tile38.chans()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('CHANS', ['*']);
    });
});
