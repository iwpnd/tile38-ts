import { Client, Command, CommandArgs } from '../Client';
import { Fields } from '../responses';
import { FSetInterface } from '../specs';
import { Executable } from './Executable';

export class FSet extends Executable implements FSetInterface {
    private _key: string;

    private _id: string;

    private _xx?: 'XX';

    private _fields: Fields = {};

    constructor(client: Client, key: string, id: string, fields: Fields) {
        super(client);

        this.key(key).id(id).fields(fields);
    }

    id(value: string): this {
        this._id = value;
        return this;
    }

    key(value: string): this {
        this._key = value;
        return this;
    }

    xx(flag = true): this {
        this._xx = flag ? 'XX' : undefined;
        return this;
    }

    fields(fields: Fields): this {
        this._fields = fields;
        return this;
    }

    compile(): [Command, CommandArgs] {
        return [
            Command.FSET,
            [
                this._key,
                this._id,
                ...(this._xx ? [this._xx] : []),
                ...Object.entries(this._fields)
                    .map(([name, value]) =>
                        typeof value === 'object'
                            ? [name, JSON.stringify(value)]
                            : [name, value]
                    )
                    .flat(),
            ],
        ];
    }
}
