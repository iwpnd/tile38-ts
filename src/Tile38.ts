import { ConstructorArgs } from './Client';
import { Tile38Error } from './errors';
import { Follower } from './Follower';
import { Leader } from './Leader';
import { FollowerInterface, Tile38Options } from './specs';

export class Tile38 extends Leader {
    readonly _follower?: Follower;

    constructor(port: number | string, options?: Tile38Options);

    constructor(port: number, host: string, options?: Tile38Options);

    constructor(path?: string, followerPath?: string, options?: Tile38Options);

    constructor(options?: Tile38Options);

    constructor(...args: ConstructorArgs) {
        super(...(args as [string]));

        if (typeof args[0] === 'string' && typeof args[1] === 'string') {
            this._follower = new Follower(args[1], args[2] as Tile38Options)
                // forwarding follower errors
                .on('error', (error) =>
                    /* istanbul ignore next */
                    this.emit('error', error)
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
