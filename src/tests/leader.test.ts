import { Tile38 } from '..';

describe('leader', () => {
    const tile38 = new Tile38({
        url: process.env.TILE38_URI,
        followerUrl: undefined,
    });

    afterAll(() => tile38.quit());

    it('should not have a follower', () =>
        expect(() => tile38.follower()).toThrow('No Follower'));
});
