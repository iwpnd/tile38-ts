import { Command } from './Client';
import { Channel, FSet, Set, SetChan, SetHook } from './commands';
import { Follower } from './Follower';
import { Fields, JSONResponse, TTLResponse } from './responses';
import {
    ChannelInterface,
    FSetInterface,
    LeaderInterface,
    SetChanInterface,
    SetHookInterface,
    SetInterface,
} from './specs';

export class Leader extends Follower implements LeaderInterface {
    aofShrink(): Promise<JSONResponse> {
        return this.client.command(Command.AOFSHRINK);
    }

    channel(): ChannelInterface {
        return new Channel(this.client);
    }

    del(key: string, id: string): Promise<JSONResponse> {
        return this.client.command(Command.DEL, [key, id]);
    }

    delChan(name: string): Promise<JSONResponse> {
        return this.client.command(Command.DELCHAN, [name]);
    }

    delHook(name: string): Promise<JSONResponse> {
        return this.client.command(Command.DELHOOK, [name]);
    }

    drop(key: string): Promise<JSONResponse> {
        return this.client.command(Command.DROP, [key]);
    }

    expire(key: string, id: string, seconds: number): Promise<JSONResponse> {
        return this.client.command(Command.EXPIRE, [key, id, seconds]);
    }

    flushDb(): Promise<JSONResponse> {
        return this.client.command(Command.FLUSHDB);
    }

    fSet(key: string, id: string, fields: Fields): FSetInterface {
        return new FSet(this.client, key, id, fields);
    }

    jSet(
        key: string,
        id: string,
        path: string,
        value: string | number,
        mode?: 'RAW' | 'STR'
    ): Promise<JSONResponse> {
        return this.client.command(Command.JSET, [
            key,
            id,
            path,
            value,
            ...(mode ? [mode] : []),
        ]);
    }

    jDel(key: string, id: string, path: string): Promise<JSONResponse> {
        return this.client.command(Command.JDEL, [key, id, path]);
    }

    pDel(key: string, pattern: string): Promise<JSONResponse> {
        return this.client.command(Command.PDEL, [key, pattern]);
    }

    pDelChan(pattern: string): Promise<JSONResponse> {
        return this.client.command(Command.PDELCHAN, [pattern]);
    }

    pDelHook(pattern: string): Promise<JSONResponse> {
        return this.client.command(Command.PDELHOOK, [pattern]);
    }

    persist(key: string, id: string): Promise<JSONResponse> {
        return this.client.command(Command.PERSIST, [key, id]);
    }

    readOnly(value = true): Promise<JSONResponse> {
        return this.client.command(Command.READONLY, [value ? 'yes' : 'no']);
    }

    rename(key: string, newKey: string, nx = false): Promise<JSONResponse> {
        if (nx) {
            return this.client.command(Command.RENAMENX, [key, newKey]);
        }

        return this.client.command(Command.RENAME, [key, newKey]);
    }

    set(key: string, id: string): SetInterface {
        return new Set(this.client, key, id);
    }

    setChan(name: string): SetChanInterface {
        return new SetChan(this.client, name);
    }

    setHook(name: string, endpoint: string): SetHookInterface {
        return new SetHook(this.client, name, endpoint);
    }

    ttl(key: string, id: string): Promise<TTLResponse> {
        return this.client.command(Command.TTL, [key, id]);
    }
}
