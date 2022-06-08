import { Tile38 } from '..';
import { SubCommand } from '../Client';
import { Get } from './Get';

describe('GetQuery', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const key = 'fleet';
        const id = 'truck1';
        const query = new Get(tile38.client, key, id);

        expect(query.compile()).toEqual(['GET', [key, id]]);
        expect(query.withFields().compile()).toEqual([
            'GET',
            [key, id, 'WITHFIELDS'],
        ]);
        expect(query.withFields(false).compile()).toEqual(['GET', [key, id]]);
        expect(query.output(SubCommand.BOUNDS).compile()).toEqual([
            'GET',
            [key, id, 'BOUNDS'],
        ]);
        expect(query.output(SubCommand.POINT).compile()).toEqual([
            'GET',
            [key, id, 'POINT'],
        ]);
        expect(query.output(SubCommand.HASH, 1).compile()).toEqual([
            'GET',
            [key, id, 'HASH', 1],
        ]);
        expect(query.output(SubCommand.OBJECT).compile()).toEqual([
            'GET',
            [key, id],
        ]);
    });
});
