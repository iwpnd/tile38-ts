import { Tile38 } from '..';

describe('set', () => {
    const tile38 = new Tile38();
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(() => tile38.quit());

    it('should set point', async () => {
        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SET', [
            'fleet',
            'truck1',
            'POINT',
            33.5123,
            -112.2693,
        ]);
    });

    it('should set object', async () => {
        await expect(
            tile38
                .set('fleet', 'truck1')
                .object({
                    type: 'Point',
                    coordinates: [-112.2693, 33.5123],
                })
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SET', [
            'fleet',
            'truck1',
            'OBJECT',
            '{"type":"Point","coordinates":[-112.2693,33.5123]}',
        ]);
    });

    it('should set bounds', async () => {
        await expect(
            tile38
                .set('fleet', 'truck1')
                .bounds(33.784, -112.152, 33.7848, -112.1512)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SET', [
            'fleet',
            'truck1',
            'BOUNDS',
            33.784,
            -112.152,
            33.7848,
            -112.1512,
        ]);
    });

    it('should set hash', async () => {
        await expect(
            tile38.set('fleet', 'truck1').hash('9tbnt').exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('SET', [
            'fleet',
            'truck1',
            'HASH',
            '9tbnt',
        ]);
    });
});
