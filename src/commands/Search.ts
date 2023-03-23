import { Client, Command, CommandArgs, SubCommand } from '../Client';
import { range } from '../range';
import {
    CountResponse,
    IdsResponse,
    JSONResponse,
    StringObjectsResponse,
} from '../responses';
import { SearchInterface } from '../specs';
import { Whereable } from './Whereable';

type Output = SubCommand.OBJECTS | SubCommand.COUNT | SubCommand.IDS;

export class Search extends Whereable implements SearchInterface {
    protected readonly command: Command.SEARCH | Command.SCAN = Command.SEARCH;

    private _key: string;

    private _options: {
        cursor?: number;
        limit?: number;
        noFields?: boolean;
        match?: string;
        asc?: boolean;
        desc?: boolean;
    } = {};

    protected _output?:
        | [SubCommand.BOUNDS]
        | [SubCommand.COUNT]
        | [SubCommand.HASHES, number]
        | [SubCommand.IDS]
        | [SubCommand.OBJECTS]
        | [SubCommand.POINTS];

    protected _all = false;

    constructor(client: Client, key: string) {
        super(client);

        this.key(key);
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

    noFields(flag = true): this {
        this._options.noFields = flag;
        return this;
    }

    match(value?: string): this {
        this._options.match = value;
        return this;
    }

    asc(flag = true): this {
        this._options.asc = flag;
        if (flag) {
            this._options.desc = false;
        }
        return this;
    }

    desc(flag = true): this {
        this._options.desc = flag;
        if (flag) {
            this._options.asc = false;
        }
        return this;
    }

    output(format: Output): this {
        this._output = format === SubCommand.OBJECTS ? undefined : [format];

        return this;
    }

    all(flag = true): this {
        this._all = flag;
        return this;
    }

    asCount(): Promise<CountResponse> {
        this.output(SubCommand.COUNT);
        return this.exec<CountResponse>();
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

    async asStringObjects(): Promise<StringObjectsResponse> {
        this.output(SubCommand.OBJECTS);

        if (this._all) {
            const responses = await this.execAll<StringObjectsResponse>();
            return {
                ...responses[0],
                objects: responses.map((response) => response.objects).flat(),
            };
        }

        return this.exec();
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

    compile(): [Command, CommandArgs] {
        return [
            this.command,
            [
                this._key,
                ...this.compileOptions(),
                ...super.compileWhere(),
                ...(this._output || []),
            ],
        ];
    }

    protected async execAll<R extends JSONResponse>(): Promise<R[]> {
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
