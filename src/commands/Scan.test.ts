import { Tile38 } from '..';
import { Scan } from './Scan';

describe('Scan', () => {
    const tile38 = new Tile38();
    const key = 'fleet';
    const query = new Scan(tile38.client, key);

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        expect(query.compile()).toEqual(['SCAN', [key]]);
    });

    it('should compile query with option arguments', () => {
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
});
