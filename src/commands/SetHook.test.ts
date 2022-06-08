import { Tile38 } from '..';
import { SetHook } from './SetHook';

describe('SetHook', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should compile query', () => {
        const name = 'warehouse';
        const endpoint = 'http://10.0.20.78/endpoint';
        const query = new SetHook(tile38.client, name, endpoint);

        expect(query.compile()).toEqual(['SETHOOK', [name, endpoint]]);
        expect(query.ex(1).compile()).toEqual([
            'SETHOOK',
            [name, endpoint, 'EX', 1],
        ]);
        expect(query.ex().meta({ foo: 'bar', bar: 'baz' }).compile()).toEqual([
            'SETHOOK',
            [name, endpoint, 'META', 'foo', 'bar', 'META', 'bar', 'baz'],
        ]);
        expect(query.meta().compile()).toEqual(['SETHOOK', [name, endpoint]]);
    });
});
