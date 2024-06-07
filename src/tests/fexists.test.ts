import { Tile38 } from '..';

describe('fexists', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    beforeEach(() => tile38.flushDb());

    it('should send FEXISTS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38
                .set('fleet', 'truck1')
                .fields({ weight: 9001 })
                .point(33.5123, -112.2693)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38.fexists('fleet', 'truck1', 'weight')
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            exists: true,
        });

        expect(command).toHaveBeenCalledWith('FEXISTS', [
            'fleet',
            'truck1',
            'weight',
        ]);

        await expect(
            tile38.fexists('fleet', 'truck1', 'milage')
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            exists: false,
        });
    });
});
