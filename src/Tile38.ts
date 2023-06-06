import { RedisClientOptions } from 'redis';
import { Tile38Error } from './errors';
import { Follower } from './Follower';
import { Leader } from './Leader';
import { FollowerInterface } from './specs';

export class Tile38 extends Leader {
    readonly _follower?: Follower;

    /* eslint-disable default-param-last */
    constructor(
        url = process.env.TILE38_LEADER_URI || process.env.TILE38_URI,
        followerUrl = process.env.TILE38_FOLLOWER_URI,
        options?: RedisClientOptions
    ) {
        super(url as string, options);

        if (followerUrl) {
            this._follower = new Follower(followerUrl, options).on(
                'error',
                (error) => {
                    /* istanbul ignore next */
                    this.emit('error', error);
                }
            );
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
