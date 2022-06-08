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
import { GetInterface } from '../specs';
import { Executable } from './Executable';

type Output =
    | SubCommand.BOUNDS
    | SubCommand.HASH
    | SubCommand.OBJECT
    | SubCommand.POINT;

export class Get extends Executable implements GetInterface {
    private _key: string;

    private _id: string;

    private _withFields = false;

    private _output?:
        | [SubCommand.BOUNDS]
        | [SubCommand.HASH, number]
        | [SubCommand.OBJECT]
        | [SubCommand.POINT];

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

    withFields(flag = true): this {
        this._withFields = flag;
        return this;
    }

    output(format: Exclude<Output, SubCommand.HASH>): this;

    output(format: SubCommand.HASH, precision: number): this;

    output(format: Output, precision?: number): this {
        if (format === SubCommand.OBJECT) {
            this._output = undefined;
        } else if (format === SubCommand.HASH) {
            this._output = [format, precision as number];
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
            Command.GET,
            [
                this._key,
                this._id,
                ...(this._withFields ? [SubCommand.WITHFIELDS] : []),
                ...(this._output || []),
            ],
        ];
    }
}
