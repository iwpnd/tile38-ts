import { PingResponse, Tile38 } from '..';

describe('ping', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send PING command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: PingResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            ping: 'pong',
        };

        await expect(tile38.ping()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('PING');
    });
});
