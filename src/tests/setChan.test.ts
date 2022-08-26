import { Tile38 } from '..';

describe('setChan', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(() => tile38.quit());

    beforeAll(() =>
        expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        })
    );

    it('should send SETCHAN with INTERSECTS', async () => {
        await expect(
            tile38
                .setChan('parking')
                .intersects('fleet')
                .where('type', 1, 1)
                .circle(1, 2, 100)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SETCHAN', [
            'parking',
            'INTERSECTS',
            'fleet',
            'FENCE',
            'WHERE',
            'type',
            1,
            1,
            'CIRCLE',
            1,
            2,
            100,
        ]);
    });

    it('should send SETCHAN with NEARBY', async () => {
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

        expect(command).toHaveBeenCalledWith('SETCHAN', [
            'parking',
            'NEARBY',
            'fleet',
            'FENCE',
            'POINT',
            33.5123,
            -112.2693,
            500,
        ]);
    });

    it('should send SETCHAN with WITHIN', async () => {
        await expect(
            tile38.setChan('parking').within('fleet').circle(1, 2, 100).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SETCHAN', [
            'parking',
            'WITHIN',
            'fleet',
            'FENCE',
            'CIRCLE',
            1,
            2,
            100,
        ]);
    });
});
