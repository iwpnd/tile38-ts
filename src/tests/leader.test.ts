import { Tile38 } from '..';

describe('leader', () => {
    let tile38: Tile38;

    afterEach(() => tile38?.quit());

    it('should create with no arguments', async () => {
        tile38 = new Tile38();
        expect(() => tile38.follower()).toThrow('No Follower');
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
    });

    it('should create with path', async () => {
        tile38 = new Tile38('redis://localhost:9851/');
        expect(() => tile38.follower()).toThrow('No Follower');
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
    });

    it('should create with port only', async () => {
        tile38 = new Tile38(9851);
        expect(() => tile38.follower()).toThrow('No Follower');
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
    });

    it('should create with port and host', async () => {
        tile38 = new Tile38(9851, '127.0.0.1');
        expect(() => tile38.follower()).toThrow('No Follower');
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
    });

    it('should create with object', async () => {
        tile38 = new Tile38({ connectTimeout: 1000 });
        expect(() => tile38.follower()).toThrow('No Follower');
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
    });
});
