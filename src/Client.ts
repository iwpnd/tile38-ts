import EventEmitter from 'events';
import { createClient } from 'redis';
import { parseResponse } from './parseResponse';
import { JSONResponse } from './responses';

export enum Command {
    AUTH = 'AUTH',
    AOFSHRINK = 'AOFSHRINK',
    BOUNDS = 'BOUNDS',
    CHANS = 'CHANS',
    DEL = 'DEL',
    DELCHAN = 'DELCHAN',
    GC = 'GC',
    HOOKS = 'HOOKS',
    HEALTHZ = 'HEALTHZ',
    PDEL = 'PDEL',
    PERSIST = 'PERSIST',
    TTL = 'TTL',
    DELHOOK = 'DELHOOK',
    DROP = 'DROP',
    EXPIRE = 'EXPIRE',
    INFO = 'INFO',
    SET = 'SET',
    FSET = 'FSET',
    GET = 'GET',
    OUTPUT = 'OUTPUT',
    PING = 'PING',
    FLUSHDB = 'FLUSHDB',
    KEYS = 'KEYS',
    WITHIN = 'WITHIN',
    READONLY = 'READONLY',
    SERVER = 'SERVER',
    SETCHAN = 'SETCHAN',
    SETHOOK = 'SETHOOK',
    STATS = 'STATS',
    RENAME = 'RENAME',
    RENAMENX = 'RENAMENX',
    INTERSECTS = 'INTERSECTS',
    CONFIG = 'CONFIG',
    JGET = 'JGET',
    JSET = 'JSET',
    JDEL = 'JDEL',
    NEARBY = 'NEARBY',
    PDELCHAN = 'PDELCHAN',
    PDELHOOK = 'PDELHOOK',
    SCAN = 'SCAN',
    SEARCH = 'SEARCH',
}

export enum SubCommand {
    FIELD = 'FIELD',
    EX = 'EX',
    NX = 'NX',
    XX = 'XX',
    WITHFIELDS = 'WITHFIELDS',
    CURSOR = 'CURSOR',
    LIMIT = 'LIMIT',
    BUFFER = 'BUFFER',
    NOFIELDS = 'NOFIELDS',
    MATCH = 'MATCH',
    OBJECT = 'OBJECT',
    TILE = 'TILE',
    QUADKEY = 'QUADKEY',
    HASH = 'HASH',
    BOUNDS = 'BOUNDS',
    GET = 'GET',
    CIRCLE = 'CIRCLE',
    POINT = 'POINT',
    OBJECTS = 'OBJECTS',
    HASHES = 'HASHES',
    IDS = 'IDS',
    COUNT = 'COUNT',
    POINTS = 'POINTS',
    STRING = 'STRING',
    META = 'META',
    FENCE = 'FENCE',
    DETECT = 'DETECT',
    COMMANDS = 'COMMANDS',
    REWRITE = 'REWRITE',
    ASC = 'ASC',
    DESC = 'DESC',
    WHERE = 'WHERE',
    SECTOR = 'SECTOR',
}

export type CommandArgs = Array<SubCommand | string | number | object>;

enum Format {
    RESP = 'resp',
    JSON = 'json',
}

type RedisClient = ReturnType<typeof createClient>;

const toString = (s: string | number): string =>
    typeof s === 'string' ? s : `${s}`;

export class Client extends EventEmitter {
    private redis: RedisClient;

    private redisConnecting?: Promise<void>;

    private subscriber: RedisClient;

    private subscriberConnecting?: Promise<void>;

    private format: `${Format}` = Format.RESP;

    constructor(url: string) {
        super();

        this.redis = createClient({ url })
            .on('ready', () => {
                this.format = Format.RESP;
            })
            .on('error', (error) => {
                /* istanbul ignore next */
                this.emit('error', error);
            })
            .on('end', () => {
                this.format = Format.RESP;
            });

        this.subscriber = this.redis.duplicate().on('error', (error) => {
            /* istanbul ignore next */
            this.emit('error', error);
        });
    }

    private connect(): Promise<void> {
        if (typeof this.redisConnecting === 'undefined') {
            this.redisConnecting = this.redis.connect();
        }

        return this.redisConnecting;
    }

    private connectSubscriber(): Promise<void> {
        if (typeof this.subscriberConnecting === 'undefined') {
            this.subscriberConnecting = this.subscriber.connect();
        }

        return this.subscriberConnecting;
    }

    private async rawCommand(
        command: string,
        args?: CommandArgs
    ): Promise<string> {
        await this.connect();

        return this.redis.sendCommand([command, ...(args || []).map(toString)]);
    }

    async command<R extends JSONResponse = JSONResponse>(
        command: Command,
        args?: CommandArgs
    ): Promise<R> {
        await this.output('json');

        const response = await this.rawCommand(command, args);

        return parseResponse<R>(response);
    }

    private async output(format: `${Format}`): Promise<void> {
        if (this.format === format) return;

        const response = await this.rawCommand(Command.OUTPUT, [format]);

        if (format === 'json') {
            parseResponse(response);
        }

        this.format = format;
    }

    async subscribe(channels: string | string[]): Promise<void> {
        await this.connectSubscriber();

        return this.subscriber.subscribe(channels, (message, channel) =>
            this.emit('message', JSON.parse(message), channel)
        );
    }

    async pSubscribe(patterns: string | string[]): Promise<void> {
        await this.connectSubscriber();

        return this.subscriber.pSubscribe(patterns, (message, channel) =>
            this.emit('message', JSON.parse(message), channel)
        );
    }

    unsubscribe(channels: string | string[] = []): Promise<void> {
        return this.subscriber.unsubscribe(channels);
    }

    pUnsubscribe(patterns: string | string[] = []): Promise<void> {
        return this.subscriber.unsubscribe(patterns);
    }

    async quit(force = false): Promise<void> {
        await Promise.all([this.redisConnecting, this.subscriberConnecting]);

        if (force) {
            await Promise.all([
                this.redis.isOpen && this.redis.disconnect(),
                this.subscriber.isOpen && this.subscriber.disconnect(),
            ]);
        } else {
            /**
             * Issue with node-redis v4
             * We have to put back output to resp otherwise quit will take forever
             */
            await (this.redis.isOpen && this.output('resp'));

            await Promise.all([
                this.redis.isOpen && this.redis.quit(),
                this.subscriber.isOpen && this.subscriber.quit(),
            ]);
        }

        delete this.redisConnecting;
        delete this.subscriberConnecting;
    }
}
