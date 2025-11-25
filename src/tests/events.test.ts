import { Tile38 } from '..';

describe('events', () => {
    it('should emit connect/ready/close/end', async () => {
        const connect = jest.fn();
        const ready = jest.fn();
        const close = jest.fn();
        const end = jest.fn();
        const tile38 = new Tile38()
            .on('connect', connect)
            .on('ready', ready)
            .on('close', close)
            .on('end', end);
        expect(connect).not.toHaveBeenCalled();
        expect(ready).not.toHaveBeenCalled();
        expect(close).not.toHaveBeenCalled();
        expect(end).not.toHaveBeenCalled();
        await expect(tile38.ping()).resolves.toMatchObject({ ping: 'pong' });
        await expect(tile38.quit()).resolves.toBeUndefined();
        expect(connect).toHaveBeenCalled();
        expect(ready).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
        expect(end).toHaveBeenCalled();

        await tile38.quit();
    });

    it('should emit error', async () => {
        const error = jest.fn();
        const tile38 = new Tile38(1234, {
            maxRetriesPerRequest: 1,
            retryStrategy: () => {
                return;
            },
        }).on('error', error);
        expect(error).not.toHaveBeenCalled();
        await expect(tile38.ping()).rejects.toBeInstanceOf(Error);
        expect(error).toHaveBeenCalled();

        await tile38.quit();
    });
});
