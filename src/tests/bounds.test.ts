import { Position } from '@vpriem/geojson';
import { BoundsResponse, Tile38 } from '..';

describe('bounds', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send BOUNDS command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        const expected: BoundsResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: {
                type: 'Polygon',
                coordinates: expect.any(Array) as Position[][],
            },
        };

        await expect(tile38.bounds('fleet')).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('BOUNDS', ['fleet']);
    });
});
