import { GeoJSON } from '@vpriem/geojson';
import { Command, SubCommand } from '../Client';
import {
    BoundsNeSwResponses,
    HashesResponse,
    ObjectsResponse,
    PointsResponse,
} from '../responses';
import { ScanInterface } from '../specs';
import { Search } from './Search';

type Output =
    | SubCommand.BOUNDS
    | SubCommand.COUNT
    | SubCommand.HASHES
    | SubCommand.IDS
    | SubCommand.OBJECTS
    | SubCommand.POINTS;

export class Scan extends Search implements ScanInterface {
    protected readonly command = Command.SCAN;

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
}
