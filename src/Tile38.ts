import { RedisOptions } from 'ioredis';
import { Tile38Error } from './errors';
import { Follower } from './Follower';
import { Leader } from './Leader';
import { FollowerInterface } from './specs';

export interface Tile38ClientOptions {
    url?: string;
    followerUrl?: string;
    redisOptions?: RedisOptions;
}

export const Tile38DefaultClientOptions = {
    url: process.env.TILE38_LEADER_URI || process.env.TILE38_URI,
    followerUrl: process.env.TILE38_FOLLOWER_URI,
};

export class Tile38 extends Leader {
    readonly _follower?: Follower;

    constructor(options: Tile38ClientOptions = Tile38DefaultClientOptions) {
        const opts = { Tile38DefaultClientOptions, ...options };
        const { url, followerUrl, redisOptions } = opts;

        super(url as string, redisOptions);

        if (followerUrl) {
            this._follower = new Follower(followerUrl, redisOptions).on(
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

    async quit(): Promise<void> {
        await Promise.all([super.quit(), this._follower?.quit()]);
    }
}
