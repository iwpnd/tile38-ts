import { Tile38 } from '..';
import { FSet } from './FSet';

describe('FSet', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const key = 'fleet';
        const id = 'truck1';
        const query = new FSet(tile38.client, key, id, {
            speed: 10,
            weight: 100,
        });

        expect(query.compile()).toEqual([
            'FSET',
            [key, id, 'speed', 10, 'weight', 100],
        ]);
        expect(query.xx().compile()).toEqual([
            'FSET',
            [key, id, 'XX', 'speed', 10, 'weight', 100],
        ]);
        expect(query.xx(false).compile()).toEqual([
            'FSET',
            [key, id, 'speed', 10, 'weight', 100],
        ]);
        expect(query.fields({ height: 20 }).compile()).toEqual([
            'FSET',
            [key, id, 'height', 20],
        ]);
        expect(query.fields({ city: 'Berlin' }).compile()).toEqual([
            'FSET',
            [key, id, 'city', 'Berlin'],
        ]);
    });
});
