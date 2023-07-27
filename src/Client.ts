import EventEmitter from 'events';
import { Redis, RedisOptions } from 'ioredis';
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

const toString = (s: string | number): string =>
    typeof s === 'string' ? s : `${s}`;

export class Client extends EventEmitter {
    private redis: Redis;

    private subscriber: Redis;

    private format: `${Format}` = Format.RESP;

    constructor(url: string, options?: RedisOptions) {
        super();

        this.redis = new Redis(url, { ...options, lazyConnect: true })
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

    private async rawCommand(
        command: string,
        args?: CommandArgs
    ): Promise<string> {
        return this.redis.call(
            command,
            ...(args || []).map(toString)
        ) as Promise<string>;
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
        await this.subscriber.subscribe(...channels, (error) => {
            if (error) {
                this.emit('error', error);
            }
        });

        this.subscriber.on('message', (channel, message) =>
            this.emit('message', JSON.parse(message), channel)
        );
    }

    async pSubscribe(patterns: string | string[]): Promise<void> {
        await this.subscriber.psubscribe(...patterns, (error) => {
            if (error) {
                this.emit('error', error);
            }
        });

        this.subscriber.on('pmessage', (pattern, channel, message) =>
            this.emit('message', JSON.parse(message), channel)
        );
    }

    async unsubscribe(channels: string | string[]): Promise<void> {
        const unsubscribeFrom =
            typeof channels === 'string' ? [channels] : channels;
        await this.subscriber.unsubscribe(...unsubscribeFrom);
    }

    async pUnsubscribe(patterns: string | string[]): Promise<void> {
        const unsubscribeFrom =
            typeof patterns === 'string' ? [patterns] : patterns;
        await this.subscriber.punsubscribe(...unsubscribeFrom);
    }

    async quit(): Promise<void> {
        if (this.redis.status === 'ready') {
            await this.output('resp');
            await this.redis.quit();
            await new Promise((resolve) => {
                this.redis.disconnect();
                setTimeout(() => {
                    resolve(null);
                }, 100);
            });
        }

        if (this.subscriber.status === 'ready') {
            await this.output('resp');
            await this.subscriber.quit();
            await new Promise((resolve) => {
                this.subscriber.disconnect();
                setTimeout(() => {
                    resolve(null);
                }, 100);
            });
        }
    }
}
