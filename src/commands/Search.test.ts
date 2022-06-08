import { Tile38 } from '..';
import { Search } from './Search';

describe('Search', () => {
    const tile38 = new Tile38();
    const key = 'fleet';
    const query = new Search(tile38.client, key);

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        expect(query.compile()).toEqual(['SEARCH', [key]]);
    });

    it('should compile query with option arguments', () => {
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
});
