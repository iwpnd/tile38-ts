import {
    Tile38,
    Tile38Error,
    Tile38IdNotFoundError,
    Tile38KeyNotFoundError,
} from '..';

describe('errors', () => {
    const tile38 = new Tile38();

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    it('should throw Tile38Error', () =>
        expect(tile38.set('fleet', 'truck1').exec()).rejects.toBeInstanceOf(
            Tile38Error
        ));

    it('should throw Tile38KeyNotFoundError on key not found', () =>
        expect(tile38.get('asd', 'truck1').exec()).rejects.toBeInstanceOf(
            Tile38KeyNotFoundError
        ));

    it('should throw Tile38IdNotFoundError on id not found', async () => {
        await tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec();

        await expect(
            tile38.get('fleet', 'truck666').exec()
        ).rejects.toBeInstanceOf(Tile38IdNotFoundError);
    });
});
