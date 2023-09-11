import { Feature, Polygon } from '@vpriem/geojson';
import { Within } from './Within';
import { Tile38 } from '..';

describe('Within', () => {
    const feature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [1.05, 33.43],
                    [28.82, 33.43],
                    [28.82, 50.06],
                    [1.05, 50.06],
                    [1.05, 33.43],
                ],
            ],
        },
    };

    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const key = 'fleet';
        const query = new Within(tile38.client, key);

        expect(query.compile()).toEqual(['WITHIN', [key]]);
    });

    it('should compile query with options', () => {
        const key = 'fleet';
        const query = new Within(tile38.client, key);

        expect(
            query
                .cursor(0)
                .limit(500)
                .buffer(500)
                .noFields()
                .match('*')
                .sparse(1)
                .compile()
        ).toEqual([
            'WITHIN',
            [
                key,
                'CURSOR',
                0,
                'LIMIT',
                500,
                'BUFFER',
                500,
                'NOFIELDS',
                'MATCH',
                '*',
                'SPARSE',
                1,
            ],
        ]);

        expect(
            query
                .cursor()
                .limit()
                .buffer()
                .noFields(false)
                .match()
                .sparse()
                .compile()
        ).toEqual(['WITHIN', [key]]);
    });

    it('should compile query with query', () => {
        const key = 'fleet';
        const query = new Within(tile38.client, key);
        const id = 'bus';

        expect(query.hash('u33d').compile()).toEqual([
            'WITHIN',
            [key, 'HASH', 'u33d'],
        ]);

        expect(query.quadKey('120').compile()).toEqual([
            'WITHIN',
            [key, 'QUADKEY', '120'],
        ]);

        expect(query.object(feature).compile()).toEqual([
            'WITHIN',
            [key, 'OBJECT', JSON.stringify(feature)],
        ]);

        expect(query.bounds(1, 2, 3, 4).compile()).toEqual([
            'WITHIN',
            [key, 'BOUNDS', 1, 2, 3, 4],
        ]);

        expect(query.tile(1, 2, 3).compile()).toEqual([
            'WITHIN',
            [key, 'TILE', 1, 2, 3],
        ]);

        expect(query.sector(1, 2, 3, 4, 5).compile()).toEqual([
            'WITHIN',
            [key, 'SECTOR', 1, 2, 3, 4, 5],
        ]);

        expect(query.circle(1, 2, 3).compile()).toEqual([
            'WITHIN',
            [key, 'CIRCLE', 1, 2, 3],
        ]);

        expect(query.get(key, id).compile()).toEqual([
            'WITHIN',
            [key, 'GET', key, id],
        ]);
    });

    it('should compile query with options & query', () => {
        const key = 'fleet';
        const query = new Within(tile38.client, key);

        expect(query.noFields().hash('u33d').compile()).toEqual([
            'WITHIN',
            [key, 'NOFIELDS', 'HASH', 'u33d'],
        ]);

        expect(query.hash('u33d').limit(1).compile()).toEqual([
            'WITHIN',
            [key, 'NOFIELDS', 'LIMIT', 1, 'HASH', 'u33d'],
        ]);
    });
});
