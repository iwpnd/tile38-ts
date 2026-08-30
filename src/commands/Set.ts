/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import { GeoJSON } from '@vpriem/geojson';

import { Client, Command, CommandArgs, SubCommand } from '../Client';
import {
    BoundsNeSwResponse,
    Fields,
    HashResponse,
    ObjectResponse,
    PointResponse,
    StringObjectResponse,
} from '../responses';
import { SetInterface } from '../specs';
import { Executable } from './Executable';

type Output =
    | SubCommand.BOUNDS
    | SubCommand.HASH
    | SubCommand.OBJECT
    | SubCommand.POINT;

export class Set extends Executable implements SetInterface {
    private _key: string;

    private _id: string;

    private _fields?: Fields;

    private _ex?: number;

    private _nxOrXx?: SubCommand.NX | SubCommand.XX;

    private _returns = false;

    private _output?:
        | [SubCommand.BOUNDS]
        | [SubCommand.HASH, number]
        | [SubCommand.OBJECT]
        | [SubCommand.POINT];

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

    object<O extends GeoJSON = GeoJSON>(value: O): this {
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

    returns(): this {
        this._returns = true;
        return this;
    }

    output(format: Exclude<Output, SubCommand.HASH>): this;

    output(format: SubCommand.HASH, precision: number): this;

    output(format: Output, precision?: number): this {
        if (format === SubCommand.HASH) {
            /* istanbul ignore if */
            if (typeof precision == 'undefined') {
                throw Error('HASHES output requires hash precision');
            }
            this._output = [format, precision];
        } else {
            this._output = [format];
        }

        return this;
    }

    asObject<O extends GeoJSON = GeoJSON, F extends Fields = Fields>(): Promise<
        ObjectResponse<O, F>
    > {
        this.output(SubCommand.OBJECT);
        return this.exec();
    }

    asPoint<F extends Fields = Fields>(): Promise<PointResponse<F>> {
        this.output(SubCommand.POINT);
        return this.exec();
    }

    asHash<F extends Fields = Fields>(
        precision: number
    ): Promise<HashResponse<F>> {
        this.output(SubCommand.HASH, precision);
        return this.exec();
    }

    asBounds<F extends Fields = Fields>(): Promise<BoundsNeSwResponse<F>> {
        this.output(SubCommand.BOUNDS);
        return this.exec();
    }

    asString<F extends Fields = Fields>(): Promise<StringObjectResponse<F>> {
        this.output(SubCommand.OBJECT);
        return this.exec();
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
                /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
                ...(this._input || []),
                ...(this._returns ? [SubCommand.RETURN] : []),
                ...(this._returns && this._output ? this._output : []),
            ],
        ];
    }
}
