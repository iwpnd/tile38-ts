import { Tile38 } from '..';

describe('del', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send DEL command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        await expect(tile38.del('fleet', 'truck1')).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        expect(command).toHaveBeenCalledWith('DEL', ['fleet', 'truck1']);
    });
});
