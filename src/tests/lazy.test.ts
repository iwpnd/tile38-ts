import { Tile38 } from '..';

describe('lazy', () => {
    const tile38 = new Tile38();

    it('should not create any redis connection', async () => {
        await expect(tile38.quit()).resolves.toBeUndefined();
        await expect(tile38.quit(false)).resolves.toBeUndefined();
        await expect(tile38.quit()).resolves.toBeUndefined();
    });
});
