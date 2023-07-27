import { Tile38 } from '..';

describe('quit', () => {
    it('should quit gracefully', async () => {
        const tile38 = new Tile38();
        await expect(tile38.ping()).resolves.toBeDefined();
        await expect(tile38.quit()).resolves.toBeUndefined();
        await expect(tile38.quit()).resolves.toBeUndefined();
    });
});
