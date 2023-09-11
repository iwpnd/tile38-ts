import { Nearby } from './Nearby';
import { Tile38 } from '..';

describe('Nearby', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(query.compile()).toEqual(['NEARBY', [key]]);
    });

    it('should compile query with options', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(
            query
                .cursor(0)
                .limit(500)
                .noFields()
                .match('*')
                .distance()
                .sparse(1)
                .compile()
        ).toEqual([
            'NEARBY',
            [
                key,
                'CURSOR',
                0,
                'LIMIT',
                500,
                'NOFIELDS',
                'MATCH',
                '*',
                'DISTANCE',
                'SPARSE',
                1,
            ],
        ]);

        expect(
            query
                .cursor()
                .limit()
                .noFields(false)
                .match()
                .distance(false)
                .sparse()
                .compile()
        ).toEqual(['NEARBY', [key]]);
    });

    it('should compile query point and radius', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(query.point(1, 2, 100).compile()).toEqual([
            'NEARBY',
            [key, 'POINT', 1, 2, 100],
        ]);
    });

    it('should compile query point without radius', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(query.point(1, 2).compile()).toEqual([
            'NEARBY',
            [key, 'POINT', 1, 2],
        ]);
    });

    it('should compile query with query+fence', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(
            query
                .point(1, 2, 100)
                .fence()
                .detect('inside', 'outside')
                .commands('set', 'del')
                .compile()
        ).toEqual([
            'NEARBY',
            [
                key,
                'FENCE',
                'DETECT',
                'inside,outside',
                'COMMANDS',
                'set,del',
                'POINT',
                1,
                2,
                100,
            ],
        ]);

        expect(
            query.point(1, 2, 100).fence(false).detect().commands().compile()
        ).toEqual(['NEARBY', [key, 'POINT', 1, 2, 100]]);
    });

    it('should compile query with option & query', () => {
        const key = 'fleet';
        const query = new Nearby(tile38.client, key);

        expect(query.noFields().point(1, 2, 100).compile()).toEqual([
            'NEARBY',
            [key, 'NOFIELDS', 'POINT', 1, 2, 100],
        ]);

        expect(query.point(1, 2, 100).limit(1).compile()).toEqual([
            'NEARBY',
            [key, 'NOFIELDS', 'LIMIT', 1, 'POINT', 1, 2, 100],
        ]);
    });
});
