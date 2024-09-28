import { GeoJSON } from '@vpriem/geojson';
import { Executable } from './Executable';
import { Client, Command, CommandArgs, SubCommand } from '../Client';
import { Fields } from '../responses';
import { SetInterface } from '../specs';

export class Set extends Executable implements SetInterface {
    private _key: string;

    private _id: string;

    private _fields?: Fields;

    private _ex?: number;

    private _nxOrXx?: SubCommand.NX | SubCommand.XX;

    private _input:
        | [SubCommand.OBJECT, string]
        | [SubCommand.POINT, number, number]
        | [SubCommand.BOUNDS, number, number, number, number]
        | [SubCommand.HASH, string]
        | [SubCommand.STRING, string];

    constructor(client: Client, key: string, id: string) {
        super(client);

        this.key(key).id(id);
    }

    id(value: string): this {
        this._id = value;
        return this;
    }

    key(value: string): this {
        this._key = value;
        return this;
    }

    fields(fields?: Fields): this {
        this._fields = fields;
        return this;
    }

    ex(seconds?: number): this {
        this._ex = seconds;
        return this;
    }

    nx(flag = true): this {
        this._nxOrXx = flag ? SubCommand.NX : undefined;
        return this;
    }

    xx(flag = true): this {
        this._nxOrXx = flag ? SubCommand.XX : undefined;
        return this;
    }

    object(value: GeoJSON): this {
        this._input = [SubCommand.OBJECT, JSON.stringify(value)];
        return this;
    }

    point(lat: number, lon: number): this {
        this._input = [SubCommand.POINT, lat, lon];
        return this;
    }

    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this {
        this._input = [SubCommand.BOUNDS, minLat, minLon, maxLat, maxLon];
        return this;
    }

    hash(value: string): this {
        this._input = [SubCommand.HASH, value];
        return this;
    }

    string(value: string): this {
        this._input = [SubCommand.STRING, value];
        return this;
    }

    compile(): [Command, CommandArgs] {
        return [
            Command.SET,
            [
                this._key,
                this._id,
                ...(this._fields
                    ? Object.entries(this._fields)
                          .map(([name, value]) =>
                              typeof value === 'object'
                                  ? [
                                        SubCommand.FIELD,
                                        name,
                                        JSON.stringify(value),
                                    ]
                                  : [SubCommand.FIELD, name, value]
                          )
                          .flat()
                    : []),
                ...(typeof this._ex === 'number'
                    ? [SubCommand.EX, this._ex]
                    : []),
                ...(this._nxOrXx ? [this._nxOrXx] : []),
                ...this._input,
            ],
        ];
    }
}
