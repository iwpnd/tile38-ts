import EventEmitter from 'events';
import { Client, Command, ConstructorArgs, SubCommand } from './Client';
import {
    Channel,
    Get,
    Intersects,
    Nearby,
    Scan,
    Search,
    Within,
} from './commands';
import { forwardEvents } from './events';
import {
    BoundsResponse,
    ChansResponse,
    ConfigGetResponse,
    ConfigKeys,
    ExistsResponse,
    FExistsResponse,
    HooksResponse,
    InfoFollowerResponse,
    JSONResponse,
    JsonGetResponse,
    KeysResponse,
    PingResponse,
    ServerExtendedResponse,
    ServerFollowerResponse,
    StatsResponse,
} from './responses';
import {
    ChannelInterface,
    FollowerInterface,
    GetInterface,
    IntersectsInterface,
    NearbyInterface,
    ScanInterface,
    SearchInterface,
    Tile38Options,
    WithinInterface,
} from './specs';

export class Follower extends EventEmitter implements FollowerInterface {
    readonly client: Client;

    constructor(port: number | string, options?: Tile38Options);

    constructor(port: number, host: string, options?: Tile38Options);

    constructor(options?: Tile38Options);

    constructor(...args: ConstructorArgs) {
        super();

        this.client = new Client(...(args as [string]));

        forwardEvents(this.client, this);
    }

    bounds(key: string): Promise<BoundsResponse> {
        return this.client.command(Command.BOUNDS, [key]);
    }

    chans(pattern = '*'): Promise<ChansResponse> {
        return this.client.command(Command.CHANS, [pattern]);
    }

    channel(): ChannelInterface {
        return new Channel(this.client);
    }

    configGet(name: ConfigKeys): Promise<ConfigGetResponse> {
        return this.client.command(Command.CONFIG, [Command.GET, name]);
    }

    configSet(name: ConfigKeys, value: string | number): Promise<JSONResponse> {
        return this.client.command(Command.CONFIG, [Command.SET, name, value]);
    }

    configRewrite(): Promise<JSONResponse> {
        return this.client.command(Command.CONFIG, [SubCommand.REWRITE]);
    }

    exists(key: string, id: string): Promise<ExistsResponse> {
        return this.client.command(Command.EXISTS, [key, id]);
    }

    fexists(key: string, id: string, field: string): Promise<FExistsResponse> {
        return this.client.command(Command.FEXISTS, [key, id, field]);
    }

    gc(): Promise<JSONResponse> {
        return this.client.command(Command.GC);
    }

    get(key: string, id: string): GetInterface {
        return new Get(this.client, key, id);
    }

    hooks(pattern = '*'): Promise<HooksResponse> {
        return this.client.command(Command.HOOKS, [pattern]);
    }

    healthz(): Promise<JSONResponse> {
        return this.client.command(Command.HEALTHZ);
    }

    info(): Promise<InfoFollowerResponse> {
        return this.client.command(Command.INFO);
    }

    intersects(key: string): IntersectsInterface {
        return new Intersects(this.client, key);
    }

    jGet(
        key: string,
        id: string,
        path?: string,
        mode?: 'RAW'
    ): Promise<JsonGetResponse> {
        return this.client.command(Command.JGET, [
            key,
            id,
            ...(path ? [path] : []),
            ...(mode ? [mode] : []),
        ]);
    }

    keys(pattern = '*'): Promise<KeysResponse> {
        return this.client.command(Command.KEYS, [pattern]);
    }

    nearby(key: string): NearbyInterface {
        return new Nearby(this.client, key);
    }

    ping(): Promise<PingResponse> {
        return this.client.command(Command.PING);
    }

    scan(key: string): ScanInterface {
        return new Scan(this.client, key);
    }

    search(key: string): SearchInterface {
        return new Search(this.client, key);
    }

    server(): Promise<ServerFollowerResponse> {
        return this.client.command(Command.SERVER);
    }

    serverExtended(): Promise<ServerExtendedResponse> {
        return this.client.command(Command.SERVER, ['EXT']);
    }

    stats(...keys: string[]): Promise<StatsResponse> {
        return this.client.command(Command.STATS, keys);
    }

    within(key: string): WithinInterface {
        return new Within(this.client, key);
    }

    async quit(force = false): Promise<void> {
        return this.client.quit(force);
    }
}
