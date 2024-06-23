import { Feature, Polygon } from '@vpriem/geojson';
import { Intersects } from './Intersects';
import { Tile38 } from '..';

describe('Intersects', () => {
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
        const query = new Intersects(tile38.client, key);

        expect(query.compile()).toEqual(['INTERSECTS', [key]]);
    });

    it('should compile query with options', () => {
        const key = 'fleet';
        const query = new Intersects(tile38.client, key);

        expect(
            query
                .cursor(0)
                .limit(500)
                .buffer(500)
                .noFields()
                .match('*')
                .clip()
                .sparse(1)
                .compile()
        ).toEqual([
            'INTERSECTS',
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
                'CLIP',
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
                .clip(false)
                .sparse()
                .compile()
        ).toEqual(['INTERSECTS', [key]]);
    });

    it('should compile query with query', () => {
        const key = 'fleet';
        const query = new Intersects(tile38.client, key);
        const id = 'bus';

        expect(query.hash('u33d').compile()).toEqual([
            'INTERSECTS',
            [key, 'HASH', 'u33d'],
        ]);

        expect(query.quadKey('120').compile()).toEqual([
            'INTERSECTS',
            [key, 'QUADKEY', '120'],
        ]);

        expect(query.object(feature).compile()).toEqual([
            'INTERSECTS',
            [key, 'OBJECT', JSON.stringify(feature)],
        ]);

        expect(query.bounds(1, 2, 3, 4).compile()).toEqual([
            'INTERSECTS',
            [key, 'BOUNDS', 1, 2, 3, 4],
        ]);

        expect(query.tile(1, 2, 3).compile()).toEqual([
            'INTERSECTS',
            [key, 'TILE', 1, 2, 3],
        ]);

        expect(query.circle(1, 2, 3).compile()).toEqual([
            'INTERSECTS',
            [key, 'CIRCLE', 1, 2, 3],
        ]);

        expect(query.get(key, id).compile()).toEqual([
            'INTERSECTS',
            [key, 'GET', key, id],
        ]);
    });

    it('should compile query with query+fence', () => {
        const key = 'fleet';
        const query = new Intersects(tile38.client, key);

        expect(
            query
                .hash('u33d')
                .fence()
                .detect('inside', 'outside')
                .commands('set', 'del')
                .compile()
        ).toEqual([
            'INTERSECTS',
            [
                key,
                'FENCE',
                'DETECT',
                'inside,outside',
                'COMMANDS',
                'set,del',
                'HASH',
                'u33d',
            ],
        ]);

        expect(
            query.hash('u33d').fence(false).detect().commands().compile()
        ).toEqual(['INTERSECTS', [key, 'HASH', 'u33d']]);
    });

    it('should compile query with options & query', () => {
        const key = 'fleet';
        const query = new Intersects(tile38.client, key);

        expect(query.noFields().hash('u33d').compile()).toEqual([
            'INTERSECTS',
            [key, 'NOFIELDS', 'HASH', 'u33d'],
        ]);

        expect(query.hash('u33d').limit(1).compile()).toEqual([
            'INTERSECTS',
            [key, 'NOFIELDS', 'LIMIT', 1, 'HASH', 'u33d'],
        ]);
    });

    it('should compile query with where and wherein', () => {
        const key = 'fleet';
        let query = new Intersects(tile38.client, key);

        expect(
            query.noFields().hash('u33d').where('foo', 1, 1).compile()
        ).toEqual([
            'INTERSECTS',
            [key, 'NOFIELDS', 'WHERE', 'foo', 1, 1, 'HASH', 'u33d'],
        ]);

        query = new Intersects(tile38.client, key);
        expect(
            query.noFields().hash('u33d').wherein('foo', [1, 2]).compile()
        ).toEqual([
            'INTERSECTS',
            [key, 'NOFIELDS', 'WHEREIN', 'foo', 2, 1, 2, 'HASH', 'u33d'],
        ]);
    });
});
