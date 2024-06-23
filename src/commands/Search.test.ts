import { Search } from './Search';
import { Tile38 } from '..';

describe('Search', () => {
    const tile38 = new Tile38();
    const key = 'fleet';

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const query = new Search(tile38.client, key);
        expect(query.compile()).toEqual(['SEARCH', [key]]);
    });

    it('should compile query with option arguments', () => {
        const query = new Search(tile38.client, key);
        expect(
            query
                .cursor(0)
                .limit(500)
                .noFields()
                .match('*')
                .asc()
                .desc()
                .compile()
        ).toEqual([
            'SEARCH',
            [key, 'CURSOR', 0, 'LIMIT', 500, 'NOFIELDS', 'MATCH', '*', 'DESC'],
        ]);

        expect(
            query.cursor().limit().noFields(false).match().desc(false).compile()
        ).toEqual(['SEARCH', [key]]);
    });

    it('should compile query with where and wherein', () => {
        let query = new Search(tile38.client, key);
        expect(query.where('foo', 1, 1).compile()).toEqual([
            'SEARCH',
            [key, 'WHERE', 'foo', 1, 1],
        ]);

        query = new Search(tile38.client, key);
        expect(query.wherein('foo', [1, 2]).compile()).toEqual([
            'SEARCH',
            [key, 'WHEREIN', 'foo', 2, 1, 2],
        ]);
    });
});
