import { Tile38 } from '..';

describe('events', () => {
    let tile38: Tile38;

    afterEach(() => tile38?.quit());

    it('should emit connect/ready/close/end', async () => {
        const connect = jest.fn();
        const ready = jest.fn();
        const close = jest.fn();
        const end = jest.fn();
        tile38 = new Tile38()
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
    });

    it('should emit error', async () => {
        const error = jest.fn();
        tile38 = new Tile38(1234, { maxRetriesPerRequest: 0 }).on(
            'error',
            error
        );
        expect(error).not.toHaveBeenCalled();
        await expect(tile38.ping()).rejects.toBeInstanceOf(Error);
        expect(error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'connect ECONNREFUSED 127.0.0.1:1234',
            })
        );
    });
});
