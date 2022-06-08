import { Tile38Error } from './errors';
import { Follower } from './Follower';
import { Leader } from './Leader';
import { FollowerInterface } from './specs';

export class Tile38 extends Leader {
    readonly _follower?: Follower;

    constructor(
        url = process.env.TILE38_LEADER_URI || process.env.TILE38_URI,
        followerUrl = process.env.TILE38_FOLLOWER_URI
    ) {
        super(url as string);

        if (followerUrl) {
            this._follower = new Follower(followerUrl).on('error', (error) => {
                /* istanbul ignore next */
                this.emit('error', error);
            });
        }
    }

    follower(): FollowerInterface {
        if (typeof this._follower === 'undefined') {
            throw new Tile38Error('No Follower');
        }

        return this._follower;
    }

    async quit(force = false): Promise<void> {
        await Promise.all([super.quit(force), this._follower?.quit(force)]);
    }
}
