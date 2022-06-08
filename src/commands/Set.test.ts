import { Tile38 } from '..';
import { Set } from './Set';

describe('Set', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const key = 'fleet';
        const id = 'truck1';
        const query = new Set(tile38.client, key, id);

        expect(query.compile()).toEqual(['SET', [key, id]]);
        expect(query.fields({ speed: 10, weight: 100 }).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 10, 'FIELD', 'weight', 100],
        ]);
        expect(query.fields({ speed: 1 }).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1],
        ]);
        expect(query.ex(60).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60],
        ]);
        expect(query.xx().compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60, 'XX'],
        ]);
        expect(query.xx(false).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60],
        ]);
        expect(query.nx().compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60, 'NX'],
        ]);
        expect(query.nx(false).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60],
        ]);
        expect(query.point(1.1, 1.2).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60, 'POINT', 1.1, 1.2],
        ]);
        expect(
            query.object({ type: 'Point', coordinates: [1, 2] }).compile()
        ).toEqual([
            'SET',
            [
                key,
                id,
                'FIELD',
                'speed',
                1,
                'EX',
                60,
                'OBJECT',
                '{"type":"Point","coordinates":[1,2]}',
            ],
        ]);
        expect(query.bounds(1, 2, 3, 4).compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60, 'BOUNDS', 1, 2, 3, 4],
        ]);
        expect(query.hash('9tbnt').compile()).toEqual([
            'SET',
            [key, id, 'FIELD', 'speed', 1, 'EX', 60, 'HASH', '9tbnt'],
        ]);
        expect(query.fields().ex().compile()).toEqual([
            'SET',
            [key, id, 'HASH', '9tbnt'],
        ]);
    });
});
