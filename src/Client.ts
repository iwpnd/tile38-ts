import EventEmitter from 'events';
import { Redis, RedisOptions } from 'ioredis';
import { forwardEvents } from './events';
import { parseResponse } from './parseResponse';
import { JSONResponse } from './responses';

export enum Command {
    AOFSHRINK = 'AOFSHRINK',
    AUTH = 'AUTH',
    BOUNDS = 'BOUNDS',
    CHANS = 'CHANS',
    CONFIG = 'CONFIG',
    DELCHAN = 'DELCHAN',
    DEL = 'DEL',
    DELHOOK = 'DELHOOK',
    DROP = 'DROP',
    EXISTS = 'EXISTS',
    EXPIRE = 'EXPIRE',
    FLUSHDB = 'FLUSHDB',
    FSET = 'FSET',
    GC = 'GC',
    GET = 'GET',
    HEALTHZ = 'HEALTHZ',
    HOOKS = 'HOOKS',
    INFO = 'INFO',
    INTERSECTS = 'INTERSECTS',
    JDEL = 'JDEL',
    JGET = 'JGET',
    JSET = 'JSET',
    KEYS = 'KEYS',
    NEARBY = 'NEARBY',
    OUTPUT = 'OUTPUT',
    PDELCHAN = 'PDELCHAN',
    PDELHOOK = 'PDELHOOK',
    PDEL = 'PDEL',
    PERSIST = 'PERSIST',
    PING = 'PING',
    READONLY = 'READONLY',
    RENAMENX = 'RENAMENX',
    RENAME = 'RENAME',
    SCAN = 'SCAN',
    SEARCH = 'SEARCH',
    SERVER = 'SERVER',
    SETCHAN = 'SETCHAN',
    SETHOOK = 'SETHOOK',
    SET = 'SET',
    STATS = 'STATS',
    TTL = 'TTL',
    WITHIN = 'WITHIN',
}

export enum SubCommand {
    ASC = 'ASC',
    BOUNDS = 'BOUNDS',
    BUFFER = 'BUFFER',
    CIRCLE = 'CIRCLE',
    COMMANDS = 'COMMANDS',
    COUNT = 'COUNT',
    CURSOR = 'CURSOR',
    DESC = 'DESC',
    DETECT = 'DETECT',
    EX = 'EX',
    FENCE = 'FENCE',
    FIELD = 'FIELD',
    GET = 'GET',
    HASHES = 'HASHES',
    HASH = 'HASH',
    IDS = 'IDS',
    LIMIT = 'LIMIT',
    MATCH = 'MATCH',
    META = 'META',
    NOFIELDS = 'NOFIELDS',
    NX = 'NX',
    OBJECT = 'OBJECT',
    OBJECTS = 'OBJECTS',
    POINT = 'POINT',
    POINTS = 'POINTS',
    QUADKEY = 'QUADKEY',
    REWRITE = 'REWRITE',
    SECTOR = 'SECTOR',
    STRING = 'STRING',
    TILE = 'TILE',
    WHERE = 'WHERE',
    WITHFIELDS = 'WITHFIELDS',
    XX = 'XX',
}

export type ConstructorArgs = (string | number | RedisOptions | undefined)[];

export type CommandArgs = Array<SubCommand | string | number | object>;

enum Format {
    RESP = 'resp',
    JSON = 'json',
}

const toString = (s: string | number): string =>
    typeof s === 'string' ? s : `${s}`;

const applyDefaults = (args: ConstructorArgs) => {
    const options = args.find((arg) => typeof arg === 'object');
    if (!options) return [...args, { port: 9851, lazyConnect: true }];
    return args.map((arg) =>
        typeof arg === 'object'
            ? { port: 9851, ...arg, lazyConnect: true }
            : arg
    );
};

const catchConnectionClosed = (error: Error) => {
    if (error.message !== 'Connection is closed.') throw error;
};

export class Client extends EventEmitter {
    private redis: Redis;

    private subscriber: Redis;

    private format: `${Format}` = Format.RESP;

    constructor(...args: ConstructorArgs) {
        super();

        this.redis = new Redis(...(applyDefaults(args) as [string]))
            .on('ready', () => {
                this.format = Format.RESP;
            })
            .on('end', () => {
                this.format = Format.RESP;
            });

        forwardEvents(this.redis, this);

        this.subscriber = this.redis
            .duplicate()
            .on('error', (error) =>
                /* istanbul ignore next */
                this.emit('error', error)
            )
            .on('message', (channel, message) =>
                this.emit('message', JSON.parse(message), channel)
            )
            .on('pmessage', (pattern, channel, message) =>
                this.emit('message', JSON.parse(message), channel, pattern)
            );
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
        await this.subscriber.subscribe(...channels);
    }

    async pSubscribe(patterns: string | string[]): Promise<void> {
        await this.subscriber.psubscribe(...patterns);
    }

    async unsubscribe(...channels: string[]): Promise<void> {
        await this.subscriber.unsubscribe(...channels);
    }

    async pUnsubscribe(...patterns: string[]): Promise<void> {
        await this.subscriber.punsubscribe(...patterns);
    }

    async quit(force = false): Promise<void> {
        await Promise.all(
            force
                ? [this.redis.disconnect(), this.subscriber.disconnect()]
                : [
                      this.redis.quit().catch(catchConnectionClosed),
                      this.subscriber.quit().catch(catchConnectionClosed),
                  ]
        );
    }
}
