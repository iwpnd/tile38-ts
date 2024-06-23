import { Scan } from './Scan';
import { Tile38 } from '..';

describe('Scan', () => {
    const tile38 = new Tile38();
    const key = 'fleet';

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const query = new Scan(tile38.client, key);
        expect(query.compile()).toEqual(['SCAN', [key]]);
    });

    it('should compile query with option arguments', () => {
        const query = new Scan(tile38.client, key);
        expect(
            query
                .cursor(0)
                .limit(500)
                .noFields()
                .match('*')
                .desc()
                .asc()
                .compile()
        ).toEqual([
            'SCAN',
            [key, 'CURSOR', 0, 'LIMIT', 500, 'NOFIELDS', 'MATCH', '*', 'ASC'],
        ]);

        expect(
            query.cursor().limit().noFields(false).match().asc(false).compile()
        ).toEqual(['SCAN', [key]]);
    });

    it('should compile query with where and wherein', () => {
        let query = new Scan(tile38.client, key);
        expect(query.where('foo', 1, 1).compile()).toEqual([
            'SCAN',
            [key, 'WHERE', 'foo', 1, 1],
        ]);

        query = new Scan(tile38.client, key);
        expect(query.wherein('foo', [1, 2]).compile()).toEqual([
            'SCAN',
            [key, 'WHEREIN', 'foo', 2, 1, 2],
        ]);
    });
});
