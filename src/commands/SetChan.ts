import { Compilable } from './Executable';
import { Intersects } from './Intersects';
import { Nearby } from './Nearby';
import { WithClient } from './WithClient';
import { Within } from './Within';
import { Client, Command, CommandArgs, SubCommand } from '../Client';
import { Meta } from '../responses';
import {
    IntersectsFenceInterface,
    NearbyFenceInterface,
    SetChanInterface,
    WithinFenceInterface,
} from '../specs';

export class SetChan
    extends WithClient
    implements SetChanInterface, Compilable
{
    protected readonly command: Command.SETCHAN | Command.SETHOOK =
        Command.SETCHAN;

    private _name: string;

    private _endpoint?: string;

    private _meta?: Meta;

    private _ex?: number;

    constructor(client: Client, name: string) {
        super(client);

        this.name(name);
    }

    name(value: string): this {
        this._name = value;
        return this;
    }

    endpoint(value: string): this {
        this._endpoint = value;
        return this;
    }

    meta(meta?: Meta): this {
        this._meta = meta;
        return this;
    }

    ex(seconds?: number): this {
        this._ex = seconds;
        return this;
    }

    nearby(key: string): NearbyFenceInterface {
        return new Nearby(this.client, key, this).fence();
    }

    within(key: string): WithinFenceInterface {
        return new Within(this.client, key, this).fence();
    }

    intersects(key: string): IntersectsFenceInterface {
        return new Intersects(this.client, key, this).fence();
    }

    compile(): [Command, CommandArgs] {
        return [
            this.command,
            [
                this._name,
                ...(this._endpoint ? [this._endpoint] : []),
                ...(this._meta
                    ? Object.entries(this._meta)
                          .map(([name, value]) => [
                              SubCommand.META,
                              name,
                              value,
                          ])
                          .flat()
                    : []),
                ...(typeof this._ex === 'number'
                    ? [SubCommand.EX, this._ex]
                    : []),
            ],
        ];
    }
}
