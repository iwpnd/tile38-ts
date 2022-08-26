import { Tile38 } from '..';

describe('setHook', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    beforeAll(() =>
        expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        })
    );

    it('should send SETHOOK command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38
                .setHook('warehouse', 'http://10.0.20.78/endpoint')
                .nearby('fleet')
                .point(33.5123, -112.2693, 500)
                .where('type', 1, 1)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SETHOOK', [
            'warehouse',
            'http://10.0.20.78/endpoint',
            'NEARBY',
            'fleet',
            'FENCE',
            'WHERE',
            'type',
            1,
            1,
            'POINT',
            33.5123,
            -112.2693,
            500,
        ]);
    });
});
