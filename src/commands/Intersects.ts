import { GeoJSON } from '@vpriem/geojson';
import { Compilable } from './Executable';
import { Whereable } from './Whereable';
import { Client, Command, CommandArgs, SubCommand } from '../Client';
import { range } from '../range';
import {
    BoundsNeSwResponses,
    Commands,
    CountResponse,
    Detect,
    HashesResponse,
    IdsResponse,
    JSONResponse,
    ObjectsResponse,
    PointsResponse,
} from '../responses';
import { IntersectsInterface } from '../specs';

type Output =
    | SubCommand.BOUNDS
    | SubCommand.COUNT
    | SubCommand.HASHES
    | SubCommand.IDS
    | SubCommand.OBJECTS
    | SubCommand.POINTS;

export class Intersects extends Whereable implements IntersectsInterface {
    protected readonly command:
        | Command.INTERSECTS
        | Command.NEARBY
        | Command.WITHIN
        | Command.SCAN
        | Command.SEARCH = Command.INTERSECTS;

    private readonly hook?: Compilable;

    private _key: string;

    private _options: {
        cursor?: number;
        limit?: number;
        buffer?: number;
        noFields?: boolean;
        match?: string;
        sparse?: number;
        clip?: boolean;
        distance?: boolean;
    } = {};

    private _fence = false;

    private _detect?: Detect[];

    private _commands?: Commands[];

    private _query?:
        | [SubCommand.CIRCLE, number, number, number]
        | [SubCommand.POINT, number, number, number]
        | [SubCommand.POINT, number, number]
        | [SubCommand.HASH, string]
        | [SubCommand.QUADKEY, string]
        | [SubCommand.TILE, number, number, number]
        | [SubCommand.OBJECT, string]
        | [SubCommand.GET, string, string]
        | [SubCommand.BOUNDS, number, number, number, number]
        | [SubCommand.SECTOR, number, number, number, number, number];

    private _output?:
        | [SubCommand.BOUNDS]
        | [SubCommand.COUNT]
        | [SubCommand.HASHES, number]
        | [SubCommand.IDS]
        | [SubCommand.OBJECTS]
        | [SubCommand.POINTS];

    private _all = false;

    constructor(client: Client, key: string, hook?: Compilable) {
        super(client);

        this.key(key);
        this.hook = hook;
        super.resetWhere();
    }

    key(value: string): this {
        this._key = value;
        return this;
    }

    cursor(value?: number): this {
        this._options.cursor = value;
        return this;
    }

    limit(value?: number): this {
        this._options.limit = value;
        return this;
    }

    buffer(value?: number): this {
        this._options.buffer = value;
        return this;
    }

    noFields(flag = true): this {
        this._options.noFields = flag;
        return this;
    }

    match(value?: string): this {
        this._options.match = value;
        return this;
    }

    sparse(value?: number): this {
        this._options.sparse = value;
        return this;
    }

    clip(flag = true): this {
        this._options.clip = flag;
        return this;
    }

    distance(flag = true): this {
        this._options.distance = flag;
        return this;
    }

    fence(flag = true): this {
        this._fence = flag;
        return this;
    }

    detect(...what: Detect[]): this {
        this._detect = what.length ? what : undefined;
        return this;
    }

    commands(...which: Commands[]): this {
        this._commands = which.length ? which : undefined;
        return this;
    }

    circle(lat: number, lon: number, radius: number): this {
        this._query = [SubCommand.CIRCLE, lat, lon, radius];
        return this;
    }

    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this {
        this._query = [SubCommand.BOUNDS, minLat, minLon, maxLat, maxLon];
        return this;
    }

    hash(value: string): this {
        this._query = [SubCommand.HASH, value];
        return this;
    }

    quadKey(value: string): this {
        this._query = [SubCommand.QUADKEY, value];
        return this;
    }

    sector(
        lat: number,
        lon: number,
        radius: number,
        bearing1: number,
        bearing2: number
    ): this {
        this._query = [SubCommand.SECTOR, lat, lon, radius, bearing1, bearing2];

        return this;
    }

    tile(x: number, y: number, z: number): this {
        this._query = [SubCommand.TILE, x, y, z];
        return this;
    }

    object<O extends GeoJSON = GeoJSON>(value: O): this {
        this._query = [SubCommand.OBJECT, JSON.stringify(value)];
        return this;
    }

    point(lat: number, lon: number, radius?: number): this {
        if (radius) {
            this._query = [SubCommand.POINT, lat, lon, radius];
            return this;
        }

        this._query = [SubCommand.POINT, lat, lon];
        return this;
    }

    get(key: string, id: string): this {
        this._query = [SubCommand.GET, key, id];
        return this;
    }

    output(format: Exclude<Output, SubCommand.HASHES>): this;

    output(format: SubCommand.HASHES, precision: number): this;

    output(format: Output, precision?: number): this {
        if (format === SubCommand.OBJECTS) {
            this._output = undefined;
        } else if (format === SubCommand.HASHES) {
            this._output = [format, precision as number];
        } else {
            this._output = [format];
        }

        return this;
    }

    all(flag = true): this {
        this._all = flag;
        return this;
    }

    async asBounds(): Promise<BoundsNeSwResponses> {
        this.output(SubCommand.BOUNDS);

        if (this._all) {
            const responses = await this.execAll<BoundsNeSwResponses>();
            return {
                ...responses[0],
                bounds: responses.map((response) => response.bounds).flat(),
            };
        }

        return this.exec<BoundsNeSwResponses>();
    }

    asCount(): Promise<CountResponse> {
        this.output(SubCommand.COUNT);
        return this.exec<CountResponse>();
    }

    async asHashes(precision: number): Promise<HashesResponse> {
        this.output(SubCommand.HASHES, precision);

        if (this._all) {
            const responses = await this.execAll<HashesResponse>();
            return {
                ...responses[0],
                hashes: responses.map((response) => response.hashes).flat(),
            };
        }

        return this.exec<HashesResponse>();
    }

    async asIds(): Promise<IdsResponse> {
        this.output(SubCommand.IDS);

        if (this._all) {
            const responses = await this.execAll<IdsResponse>();
            return {
                ...responses[0],
                ids: responses.map((response) => response.ids).flat(),
            };
        }

        return this.exec<IdsResponse>();
    }

    async asObjects<O extends GeoJSON = GeoJSON>(): Promise<
        ObjectsResponse<O>
    > {
        this.output(SubCommand.OBJECTS);

        if (this._all) {
            const responses = await this.execAll<ObjectsResponse<O>>();
            return {
                ...responses[0],
                objects: responses.map((response) => response.objects).flat(),
            };
        }

        return this.exec();
    }

    async asPoints(): Promise<PointsResponse> {
        this.output(SubCommand.POINTS);

        if (this._all) {
            const responses = await this.execAll<PointsResponse>();
            return {
                ...responses[0],
                points: responses.map((response) => response.points).flat(),
            };
        }

        return this.exec<PointsResponse>();
    }

    private compileOptions(): CommandArgs {
        const args: CommandArgs = [];

        Object.entries(this._options).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                if (value) {
                    args.push(key.toUpperCase());
                }
            } else if (typeof value !== 'undefined') {
                args.push(key.toUpperCase(), value);
            }
        });

        return args;
    }

    private compileFence(): CommandArgs {
        return this._fence
            ? [
                  SubCommand.FENCE,
                  ...(this._detect
                      ? [SubCommand.DETECT, this._detect.join(',')]
                      : []),
                  ...(this._commands
                      ? [SubCommand.COMMANDS, this._commands.join(',')]
                      : []),
              ]
            : [];
    }

    compile(): [Command, CommandArgs] {
        const compiled: [Command, CommandArgs] = [
            this.command,
            [
                this._key,
                ...this.compileOptions(),
                ...this.compileFence(),
                ...super.compileWhere(),
                ...(this._output || []),
                ...(this._query || []),
            ],
        ];

        if (this.hook) {
            const [command, args] = this.hook.compile();
            return [command, [...args, ...compiled.flat()]];
        }

        return compiled;
    }

    private async execAll<R extends JSONResponse>(): Promise<R[]> {
        const output = this._output;
        const cursor = 0;
        const { limit = 100 } = this._options;

        const { count } = await this.output(SubCommand.COUNT)
            .cursor(cursor)
            .limit()
            .exec<CountResponse>();

        this._output = output;

        if (count <= limit) {
            const response = await this.cursor(cursor).limit(limit).exec<R>();
            return [response];
        }

        return range(Math.ceil(count / limit)).reduce<Promise<R[]>>(
            async (prev, page) => {
                const acc = await prev;
                const result = await this.cursor(page * limit)
                    .limit(limit)
                    .exec<R>();
                return acc.concat({ ...result, count, cursor: 0 });
            },
            Promise.resolve([])
        );
    }
}
