import { Tile38 } from '..';
import { SetChan } from './SetChan';

describe('SetChan', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const name = 'warehouse';
        const query = new SetChan(tile38.client, name);

        expect(query.compile()).toEqual(['SETCHAN', [name]]);
        expect(query.ex(1).compile()).toEqual(['SETCHAN', [name, 'EX', 1]]);
        expect(query.ex().meta({ foo: 'bar', bar: 'baz' }).compile()).toEqual([
            'SETCHAN',
            [name, 'META', 'foo', 'bar', 'META', 'bar', 'baz'],
        ]);
        expect(query.meta().compile()).toEqual(['SETCHAN', [name]]);
    });
});
