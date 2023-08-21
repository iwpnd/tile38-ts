import { JSONResponse, Tile38 } from '..';

describe('healthz', () => {
    describe('healthz leader', () => {
        const tile38 = new Tile38(
            'redis://localhost:9851/',
            'redis://localhost:9852/'
        );

        afterAll(() => tile38.quit());

        it('should send healthz command to leader', async () => {
            const command = jest.spyOn(tile38.client, 'command');

            const expected: JSONResponse = {
                elapsed: expect.any(String) as string,
                ok: true,
            };

            await expect(tile38.healthz()).resolves.toEqual(expected);

            expect(command).toHaveBeenCalledWith('HEALTHZ');
        });
    });

    describe('healthz follower', () => {
        const tile38 = new Tile38(
            'redis://localhost:9851/',
            'redis://localhost:9852/'
        );

        afterAll(() => tile38.quit());

        it('should send healthz command to follower', async () => {
            const command = jest.spyOn(tile38.client, 'command');

            const expected: JSONResponse = {
                elapsed: expect.any(String) as string,
                ok: true,
            };

            await expect(tile38.follower().healthz()).resolves.toEqual(
                expected
            );

            expect(command).not.toHaveBeenCalledWith('HEALTHZ');
        });
    });
});
