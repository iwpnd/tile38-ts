/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import { GeoJSON } from '@vpriem/geojson';
import { RedisOptions } from 'ioredis';
import { WhereInValues } from './commands/Whereable';
import {
    BoundsNeSwResponse,
    BoundsNeSwResponses,
    BoundsResponse,
    ChansResponse,
    Commands,
    ConfigGetResponse,
    ConfigKeys,
    CountResponse,
    Detect,
    Fields,
    Geofence,
    HashResponse,
    HashesResponse,
    HooksResponse,
    IdsResponse,
    InfoFollowerResponse,
    InfoResponse,
    JSONResponse,
    JsonGetResponse,
    KeysResponse,
    Meta,
    ObjectResponse,
    ObjectsResponse,
    PingResponse,
    PointResponse,
    PointsResponse,
    ServerExtendedResponse,
    ServerFollowerResponse,
    ServerResponse,
    StatsResponse,
    StringObjectResponse,
    StringObjectsResponse,
    TTLResponse,
} from './responses';

/**
 * ChannelInterface provides methods for handling geofencing events
 */
export interface ChannelInterface {
    /**
     * Register an event listener for geofencing messages
     * @param {string} event - The event type
     * @param {function} listener - The callback function to handle the event
     * @returns {this}
     */
    on<
        O extends GeoJSON = GeoJSON,
        F extends Fields | undefined = undefined,
        M extends Meta | undefined = undefined,
    >(
        event: 'message',
        listener: (message: Geofence<O, F, M>, channel: string) => void
    ): this;

    /**
     * Subscribe to one or more channels
     * @param {...string} channel - The channels to subscribe to
     * @returns {Promise<void>}
     */
    subscribe(...channel: string[]): Promise<void>;

    /**
     * Subscribe to one or more patterns
     * @param {...string} patterns - The patterns to subscribe to
     * @returns {Promise<void>}
     */
    pSubscribe(...patterns: string[]): Promise<void>;

    /**
     * Unsubscribe from all channels
     * @returns {Promise<void>}
     */
    unsubscribe(): Promise<void>;
}

/**
 * FSetInterface provides methods for setting fields on a geospatial object
 */
export interface FSetInterface {
    /**
     * Set the key for the object
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the ID for the object
     * @param {string} value - The ID value
     * @returns {this}
     */
    id(value: string): this;

    /**
     * Specify whether to only update existing objects
     * @param {boolean} [flag] - If true, only update existing objects
     * @returns {this}
     */
    xx(flag?: boolean): this;

    /**
     * Set the fields for the object
     * @param {Fields} [fields] - The fields to set
     * @returns {this}
     */
    fields(fields?: Fields): this;

    /**
     * Execute the FSet command
     * @returns {Promise<JSONResponse>}
     */
    exec(): Promise<JSONResponse>;
}

/**
 * GetInterface provides methods for retrieving geospatial data
 */
export interface GetInterface {
    /**
     * Set the key for the object
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the ID for the object
     * @param {string} value - The ID value
     * @returns {this}
     */
    id(value: string): this;

    /**
     * Specify whether to include fields in the response
     * @param {boolean} [flag] - If true, include fields
     * @returns {this}
     */
    withFields(flag?: boolean): this;

    /**
     * Set the output format for the response
     * @param {'BOUNDS' | 'OBJECT' | 'POINT' | 'STRING'} format - The output format
     * @returns {this}
     */
    output(format: 'BOUNDS' | 'OBJECT' | 'POINT' | 'STRING'): this;

    /**
     * Set the output format to 'HASH' with specified precision
     * @param {'HASH'} format - The output format
     * @param {number} precision - The precision for the hash
     * @returns {this}
     */
    output(format: 'HASH', precision: number): this;

    /**
     * Retrieve the data as a string
     * @template F
     * @returns {Promise<StringObjectResponse<F>>}
     */
    asString<F extends Fields = Fields>(): Promise<StringObjectResponse<F>>;

    /**
     * Retrieve the data as bounds
     * @template F
     * @returns {Promise<BoundsNeSwResponse<F>>}
     */
    asBounds<F extends Fields = Fields>(): Promise<BoundsNeSwResponse<F>>;

    /**
     * Retrieve the data as a hash
     * @template F
     * @param {number} precision - The precision for the hash
     * @returns {Promise<HashResponse<F>>}
     */
    asHash<F extends Fields = Fields>(
        precision: number
    ): Promise<HashResponse<F>>;

    /**
     * Retrieve the data as a GeoJSON object
     * @template O, F
     * @returns {Promise<ObjectResponse<O, F>>}
     */
    asObject<O extends GeoJSON = GeoJSON, F extends Fields = Fields>(): Promise<
        ObjectResponse<O, F>
    >;

    /**
     * Retrieve the data as a point
     * @template F
     * @returns {Promise<PointResponse<F>>}
     */
    asPoint<F extends Fields = Fields>(): Promise<PointResponse<F>>;

    /**
     * Execute the Get command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

/**
 * IntersectsBaseInterface provides methods for querying intersecting geospatial data
 */
interface IntersectsBaseInterface {
    /**
     * Set the key for the query
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the cursor position for the query
     * @param {number} [value] - The cursor value
     * @returns {this}
     */
    cursor(value?: number): this;

    /**
     * Set the limit for the number of returned results
     * @param {number} [value] - The limit value
     * @returns {this}
     */
    limit(value?: number): this;

    /**
     * Set the buffer distance for the query
     * @param {number} [value] - The buffer value
     * @returns {this}
     */
    buffer(value?: number): this;

    /**
     * Specify whether to exclude fields in the response
     * @param {boolean} [flag] - If true, exclude fields
     * @returns {this}
     */
    noFields(flag?: boolean): this;

    /**
     * Set the match pattern for the query
     * @param {string} [value] - The match pattern
     * @returns {this}
     */
    match(value?: string): this;

    /**
     * Set the sparsity of the returned results
     * @param {number} [value] - The sparsity value
     * @returns {this}
     */
    sparse(value?: number): this;

    /**
     * Specify whether to clip the results
     * @param {boolean} [flag] - If true, clip the results
     * @returns {this}
     */
    clip(flag?: boolean): this;

    /**
     * Set the circle parameters for the query
     * @param {number} lat - Latitude of the circle center
     * @param {number} lon - Longitude of the circle center
     * @param {number} radius - Radius of the circle
     * @returns {this}
     */
    circle(lat: number, lon: number, radius: number): this;

    /**
     * Set the bounds for the query
     * @param {number} minLat - Minimum latitude of the bounds
     * @param {number} minLon - Minimum longitude of the bounds
     * @param {number} maxLat - Maximum latitude of the bounds
     * @param {number} maxLon - Maximum longitude of the bounds
     * @returns {this}
     */
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;

    /**
     * Set the hash value for the query
     * @param {string} value - The hash value
     * @returns {this}
     */
    hash(value: string): this;

    /**
     * Set the quad key for the query
     * @param {string} value - The quad key value
     * @returns {this}
     */
    quadKey(value: string): this;

    /**
     * Set the sector parameters for the query
     * @param {number} lat - Latitude of the sector center
     * @param {number} lon - Longitude of the sector center
     * @param {number} radius - Radius of the sector
     * @param {number} bearing1 - First bearing angle
     * @param {number} bearing2 - Second bearing angle
     * @returns {this}
     */
    sector(
        lat: number,
        lon: number,
        radius: number,
        bearing1: number,
        bearing2: number
    ): this;

    /**
     * Set the tile coordinates for the query
     * @param {number} x - X coordinate of the tile
     * @param {number} y - Y coordinate of the tile
     * @param {number} z - Zoom level of the tile
     * @returns {this}
     */
    tile(x: number, y: number, z: number): this;

    /**
     * Set the GeoJSON object for the query
     * @param {O} value - The GeoJSON object
     * @template O
     * @returns {this}
     */
    object<O extends GeoJSON = GeoJSON>(value: O): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;
}

/**
 * IntersectsFenceInterface extends IntersectsBaseInterface to provide methods
 * for configuring geofence detection and commands
 */
export interface IntersectsFenceInterface extends IntersectsBaseInterface {
    /**
     * Set the detection events for the geofence
     * @param {...Detect[]} what - The detection events to set
     * @returns {this}
     */
    detect(...what: Detect[]): this;

    /**
     * Set the commands to trigger the geofence
     * @param {...Commands[]} which - The commands to set
     * @returns {this}
     */
    commands(...which: Commands[]): this;

    /**
     * Execute the IntersectsFence command
     * @returns {Promise<JSONResponse>}
     */
    exec(): Promise<JSONResponse>;
}

/**
 * IntersectsInterface extends IntersectsBaseInterface to provide methods
 * for querying intersecting geospatial data with various output formats
 */
export interface IntersectsInterface extends IntersectsBaseInterface {
    /**
     * Specify whether to return all matching objects
     * @param {boolean} [flag] - If true, return all matching objects
     * @returns {this}
     */
    all(flag?: boolean): this;

    /**
     * Get a specific object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {this}
     */
    get(key: string, id: string): this;

    /**
     * Set the output format for the response
     * @param {'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'} format - The output format
     * @returns {this}
     */
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;

    /**
     * Set the output format to 'HASHES' with specified precision
     * @param {'HASHES'} format - The output format
     * @param {number} precision - The precision for the hashes
     * @returns {this}
     */
    output(format: 'HASHES', precision: number): this;

    /**
     * Retrieve the data as bounds
     * @returns {Promise<BoundsNeSwResponses>}
     */
    asBounds(): Promise<BoundsNeSwResponses>;

    /**
     * Retrieve the data as a count of matching objects
     * @returns {Promise<CountResponse>}
     */
    asCount(): Promise<CountResponse>;

    /**
     * Retrieve the data as hashes with specified precision
     * @param {number} precision - The precision for the hashes
     * @returns {Promise<HashesResponse>}
     */
    asHashes(precision: number): Promise<HashesResponse>;

    /**
     * Retrieve the data as IDs of matching objects
     * @returns {Promise<IdsResponse>}
     */
    asIds(): Promise<IdsResponse>;

    /**
     * Retrieve the data as GeoJSON objects
     * @template O
     * @returns {Promise<ObjectsResponse<O>>}
     */
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;

    /**
     * Retrieve the data as points
     * @returns {Promise<PointsResponse>}
     */
    asPoints(): Promise<PointsResponse>;

    /**
     * Execute the Intersects command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

/**
 * NearbyBaseInterface provides methods for querying nearby geospatial data
 */
interface NearbyBaseInterface {
    /**
     * Set the key for the query
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the cursor position for the query
     * @param {number} [value] - The cursor value
     * @returns {this}
     */
    cursor(value?: number): this;

    /**
     * Set the limit for the number of returned results
     * @param {number} [value] - The limit value
     * @returns {this}
     */
    limit(value?: number): this;

    /**
     * Specify whether to exclude fields in the response
     * @param {boolean} [flag] - If true, exclude fields
     * @returns {this}
     */
    noFields(flag?: boolean): this;

    /**
     * Set the match pattern for the query
     * @param {string} [value] - The match pattern
     * @returns {this}
     */
    match(value?: string): this;

    /**
     * Set the sparsity of the returned results
     * @param {number} [value] - The sparsity value
     * @returns {this}
     */
    sparse(value?: number): this;

    /**
     * Specify whether to include distance in the response
     * @param {boolean} [flag] - If true, include distance
     * @returns {this}
     */
    distance(flag?: boolean): this;

    /**
     * Set the point parameters for the query
     * @param {number} lat - Latitude of the point
     * @param {number} lon - Longitude of the point
     * @param {number} [radius] - Radius around the point
     * @returns {this}
     */
    point(lat: number, lon: number, radius?: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;
}

/**
 * NearbyFenceInterface extends NearbyBaseInterface to provide methods
 * for configuring geofence detection and commands
 */
export interface NearbyFenceInterface extends NearbyBaseInterface {
    /**
     * Set the detection events for the geofence
     * @param {...Detect[]} what - The detection events to set
     * @returns {this}
     */
    detect(...what: Detect[]): this;

    /**
     * Set the commands to trigger the geofence
     * @param {...Commands[]} which - The commands to set
     * @returns {this}
     */
    commands(...which: Commands[]): this;

    /**
     * Execute the NearbyFence command
     * @returns {Promise<JSONResponse>}
     */
    exec(): Promise<JSONResponse>;
}

/**
 * NearbyInterface extends NearbyBaseInterface to provide methods
 * for querying nearby geospatial data with various output formats
 */
export interface NearbyInterface extends NearbyBaseInterface {
    /**
     * Specify whether to return all matching objects
     * @param {boolean} [flag] - If true, return all matching objects
     * @returns {this}
     */
    all(flag?: boolean): this;

    /**
     * Set the output format for the response
     * @param {'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'} format - The output format
     * @returns {this}
     */
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;

    /**
     * Set the output format to 'HASHES' with specified precision
     * @param {'HASHES'} format - The output format
     * @param {number} precision - The precision for the hashes
     * @returns {this}
     */
    output(format: 'HASHES', precision: number): this;

    /**
     * Retrieve the data as bounds
     * @returns {Promise<BoundsNeSwResponses>}
     */
    asBounds(): Promise<BoundsNeSwResponses>;

    /**
     * Retrieve the data as a count of matching objects
     * @returns {Promise<CountResponse>}
     */
    asCount(): Promise<CountResponse>;

    /**
     * Retrieve the data as hashes with specified precision
     * @param {number} precision - The precision for the hashes
     * @returns {Promise<HashesResponse>}
     */
    asHashes(precision: number): Promise<HashesResponse>;

    /**
     * Retrieve the data as IDs of matching objects
     * @returns {Promise<IdsResponse>}
     */
    asIds(): Promise<IdsResponse>;

    /**
     * Retrieve the data as GeoJSON objects
     * @template O
     * @returns {Promise<ObjectsResponse<O>>}
     */
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;

    /**
     * Retrieve the data as points
     * @returns {Promise<PointsResponse>}
     */
    asPoints(): Promise<PointsResponse>;

    /**
     * Execute the Nearby command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}
/**
 * ScanInterface provides methods for scanning geospatial data with various output formats
 */
export interface ScanInterface {
    /**
     * Set the key for the scan
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the cursor position for the scan
     * @param {number} [value] - The cursor value
     * @returns {this}
     */
    cursor(value?: number): this;

    /**
     * Set the limit for the number of returned results
     * @param {number} [value] - The limit value
     * @returns {this}
     */
    limit(value?: number): this;

    /**
     * Specify whether to exclude fields in the response
     * @param {boolean} [flag] - If true, exclude fields
     * @returns {this}
     */
    noFields(flag?: boolean): this;

    /**
     * Set the match pattern for the scan
     * @param {string} [value] - The match pattern
     * @returns {this}
     */
    match(value?: string): this;

    /**
     * Specify whether to sort results in ascending order
     * @param {boolean} [flag] - If true, sort results in ascending order
     * @returns {this}
     */
    asc(flag?: boolean): this;

    /**
     * Specify whether to sort results in descending order
     * @param {boolean} [flag] - If true, sort results in descending order
     * @returns {this}
     */
    desc(flag?: boolean): this;

    /**
     * Set the output format for the scan response
     * @param {'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'} format - The output format
     * @returns {this}
     */
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;

    /**
     * Set the output format to 'HASHES' with specified precision
     * @param {'HASHES'} format - The output format
     * @param {number} precision - The precision for the hashes
     * @returns {this}
     */
    output(format: 'HASHES', precision: number): this;

    /**
     * Specify whether to return all matching objects
     * @param {boolean} [flag] - If true, return all matching objects
     * @returns {this}
     */
    all(flag?: boolean): this;

    /**
     * Retrieve the data as bounds
     * @returns {Promise<BoundsNeSwResponses>}
     */
    asBounds(): Promise<BoundsNeSwResponses>;

    /**
     * Retrieve the data as a count of matching objects
     * @returns {Promise<CountResponse>}
     */
    asCount(): Promise<CountResponse>;

    /**
     * Retrieve the data as hashes with specified precision
     * @param {number} precision - The precision for the hashes
     * @returns {Promise<HashesResponse>}
     */
    asHashes(precision: number): Promise<HashesResponse>;

    /**
     * Retrieve the data as IDs of matching objects
     * @returns {Promise<IdsResponse>}
     */
    asIds(): Promise<IdsResponse>;

    /**
     * Retrieve the data as GeoJSON objects
     * @template O
     * @returns {Promise<ObjectsResponse<O>>}
     */
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;

    /**
     * Retrieve the data as points
     * @returns {Promise<PointsResponse>}
     */
    asPoints(): Promise<PointsResponse>;

    /**
     * Execute the Scan command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;
}

/**
 * SearchInterface provides methods for searching geospatial data with various output formats
 */
export interface SearchInterface {
    /**
     * Set the key for the search
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the cursor position for the search
     * @param {number} [value] - The cursor value
     * @returns {this}
     */
    cursor(value?: number): this;

    /**
     * Set the limit for the number of returned results
     * @param {number} [value] - The limit value
     * @returns {this}
     */
    limit(value?: number): this;

    /**
     * Specify whether to exclude fields in the response
     * @param {boolean} [flag] - If true, exclude fields
     * @returns {this}
     */
    noFields(flag?: boolean): this;

    /**
     * Set the match pattern for the search
     * @param {string} [value] - The match pattern
     * @returns {this}
     */
    match(value?: string): this;

    /**
     * Specify whether to sort results in ascending order
     * @param {boolean} [flag] - If true, sort results in ascending order
     * @returns {this}
     */
    asc(flag?: boolean): this;

    /**
     * Specify whether to sort results in descending order
     * @param {boolean} [flag] - If true, sort results in descending order
     * @returns {this}
     */
    desc(flag?: boolean): this;

    /**
     * Set the output format for the search response
     * @param {'COUNT' | 'IDS' | 'OBJECTS'} format - The output format
     * @returns {this}
     */
    output(format: 'COUNT' | 'IDS' | 'OBJECTS'): this;

    /**
     * Specify whether to return all matching objects
     * @param {boolean} [flag] - If true, return all matching objects
     * @returns {this}
     */
    all(flag?: boolean): this;

    /**
     * Retrieve the data as a count of matching objects
     * @returns {Promise<CountResponse>}
     */
    asCount(): Promise<CountResponse>;

    /**
     * Retrieve the data as IDs of matching objects
     * @returns {Promise<IdsResponse>}
     */
    asIds(): Promise<IdsResponse>;

    /**
     * Retrieve the data as string objects
     * @returns {Promise<StringObjectsResponse>}
     */
    asStringObjects(): Promise<StringObjectsResponse>;

    /**
     * Execute the Search command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = StringObjectsResponse>(): Promise<R>;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;
}

/**
 * SetInterface provides methods for setting geospatial data
 */
export interface SetInterface {
    /**
     * Set the key for the object
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the ID for the object
     * @param {string} value - The ID value
     * @returns {this}
     */
    id(value: string): this;

    /**
     * Set the fields for the object
     * @template F
     * @param {F} [fields] - The fields to set
     * @returns {this}
     */
    fields<F extends Fields = Fields>(fields?: F): this;

    /**
     * Set the expiration time for the object in seconds
     * @param {number} [seconds] - The expiration time in seconds
     * @returns {this}
     */
    ex(seconds?: number): this;

    /**
     * Specify whether to only set the object if it does not already exist
     * @param {boolean} [flag] - If true, only set if the object does not exist
     * @returns {this}
     */
    nx(flag?: boolean): this;

    /**
     * Specify whether to only set the object if it already exists
     * @param {boolean} [flag] - If true, only set if the object exists
     * @returns {this}
     */
    xx(flag?: boolean): this;

    /**
     * Set the GeoJSON object
     * @template O
     * @param {O} geoJSON - The GeoJSON object
     * @returns {this}
     */
    object<O extends GeoJSON = GeoJSON>(geoJSON: O): this;

    /**
     * Set the point coordinates for the object
     * @param {number} lat - Latitude of the point
     * @param {number} lon - Longitude of the point
     * @returns {this}
     */
    point(lat: number, lon: number): this;

    /**
     * Set the bounds for the object
     * @param {number} minLat - Minimum latitude of the bounds
     * @param {number} minLon - Minimum longitude of the bounds
     * @param {number} maxLat - Maximum latitude of the bounds
     * @param {number} maxLon - Maximum longitude of the bounds
     * @returns {this}
     */
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;

    /**
     * Set the hash value for the object
     * @param {string} value - The hash value
     * @returns {this}
     */
    hash(value: string): this;

    /**
     * Set the string value for the object
     * @param {string} value - The string value
     * @returns {this}
     */
    string(value: string): this;

    /**
     * Execute the Set command
     * @returns {Promise<JSONResponse>}
     */
    exec(): Promise<JSONResponse>;
}

/**
 * WithinBaseInterface provides methods for querying geospatial data within specified areas
 */
interface WithinBaseInterface {
    /**
     * Set the key for the query
     * @param {string} value - The key value
     * @returns {this}
     */
    key(value: string): this;

    /**
     * Set the cursor position for the query
     * @param {number} [value] - The cursor value
     * @returns {this}
     */
    cursor(value?: number): this;

    /**
     * Set the limit for the number of returned results
     * @param {number} [value] - The limit value
     * @returns {this}
     */
    limit(value?: number): this;

    /**
     * Set the buffer distance for the query
     * @param {number} [value] - The buffer value
     * @returns {this}
     */
    buffer(value?: number): this;

    /**
     * Specify whether to exclude fields in the response
     * @param {boolean} [flag] - If true, exclude fields
     * @returns {this}
     */
    noFields(flag?: boolean): this;

    /**
     * Set the match pattern for the query
     * @param {string} [value] - The match pattern
     * @returns {this}
     */
    match(value?: string): this;

    /**
     * Set the sparsity of the returned results
     * @param {number} [value] - The sparsity value
     * @returns {this}
     */
    sparse(value?: number): this;

    /**
     * Set the circle parameters for the query
     * @param {number} lat - Latitude of the circle center
     * @param {number} lon - Longitude of the circle center
     * @param {number} radius - Radius of the circle
     * @returns {this}
     */
    circle(lat: number, lon: number, radius: number): this;

    /**
     * Set the bounds for the query
     * @param {number} minLat - Minimum latitude of the bounds
     * @param {number} minLon - Minimum longitude of the bounds
     * @param {number} maxLat - Maximum latitude of the bounds
     * @param {number} maxLon - Maximum longitude of the bounds
     * @returns {this}
     */
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;

    /**
     * Set the hash value for the query
     * @param {string} value - The hash value
     * @returns {this}
     */
    hash(value: string): this;

    /**
     * Set the quad key for the query
     * @param {string} value - The quad key value
     * @returns {this}
     */
    quadKey(value: string): this;

    /**
     * Set the sector parameters for the query
     * @param {number} lat - Latitude of the sector center
     * @param {number} lon - Longitude of the sector center
     * @param {number} radius - Radius of the sector
     * @param {number} bearing1 - First bearing angle
     * @param {number} bearing2 - Second bearing angle
     * @returns {this}
     */
    sector(
        lat: number,
        lon: number,
        radius: number,
        bearing1: number,
        bearing2: number
    ): this;

    /**
     * Set the tile coordinates for the query
     * @param {number} x - X coordinate of the tile
     * @param {number} y - Y coordinate of the tile
     * @param {number} z - Zoom level of the tile
     * @returns {this}
     */
    tile(x: number, y: number, z: number): this;

    /**
     * Set the GeoJSON object for the query
     * @template O
     * @param {O} value - The GeoJSON object
     * @returns {this}
     */
    object<O extends GeoJSON = GeoJSON>(value: O): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;
}

/**
 * WithinFenceInterface extends WithinBaseInterface to provide methods
 * for configuring geofence detection and commands
 */
export interface WithinFenceInterface extends WithinBaseInterface {
    /**
     * Set the detection events for the geofence
     * @param {...Detect[]} what - The detection events to set
     * @returns {this}
     */
    detect(...what: Detect[]): this;

    /**
     * Set the commands to trigger the geofence
     * @param {...Commands[]} which - The commands to set
     * @returns {this}
     */
    commands(...which: Commands[]): this;

    /**
     * Execute the WithinFence command
     * @returns {Promise<JSONResponse>}
     */
    exec(): Promise<JSONResponse>;
}

/**
 * WithinInterface extends WithinBaseInterface to provide methods
 * for querying geospatial data within specified areas with various output formats
 */
export interface WithinInterface extends WithinBaseInterface {
    /**
     * Specify whether to return all matching objects
     * @param {boolean} [flag] - If true, return all matching objects
     * @returns {this}
     */
    all(flag?: boolean): this;

    /**
     * Get a specific object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {this}
     */
    get(key: string, id: string): this;

    /**
     * Set the output format for the response
     * @param {'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'} format - The output format
     * @returns {this}
     */
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;

    /**
     * Set the output format to 'HASHES' with specified precision
     * @param {'HASHES'} format - The output format
     * @param {number} precision - The precision for the hashes
     * @returns {this}
     */
    output(format: 'HASHES', precision: number): this;

    /**
     * Retrieve the data as bounds
     * @returns {Promise<BoundsNeSwResponses>}
     */
    asBounds(): Promise<BoundsNeSwResponses>;

    /**
     * Retrieve the data as a count of matching objects
     * @returns {Promise<CountResponse>}
     */
    asCount(): Promise<CountResponse>;

    /**
     * Retrieve the data as hashes with specified precision
     * @param {number} precision - The precision for the hashes
     * @returns {Promise<HashesResponse>}
     */
    asHashes(precision: number): Promise<HashesResponse>;

    /**
     * Retrieve the data as IDs of matching objects
     * @returns {Promise<IdsResponse>}
     */
    asIds(): Promise<IdsResponse>;

    /**
     * Retrieve the data as GeoJSON objects
     * @template O
     * @returns {Promise<ObjectsResponse<O>>}
     */
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;

    /**
     * Retrieve the data as points
     * @returns {Promise<PointsResponse>}
     */
    asPoints(): Promise<PointsResponse>;

    /**
     * Execute the Within command
     * @template R
     * @returns {Promise<R>}
     */
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

/**
 * SetChanInterface provides methods for configuring geospatial channels
 */
export interface SetChanInterface {
    /**
     * Set the name for the channel
     * @param {string} value - The name value
     * @returns {this}
     */
    name(value: string): this;

    /**
     * Set the metadata for the channel
     * @template M
     * @param {M} [meta] - The metadata to set
     * @returns {this}
     */
    meta<M extends Meta = Meta>(meta?: M): this;

    /**
     * Set the expiration time for the channel in seconds
     * @param {number} [seconds] - The expiration time in seconds
     * @returns {this}
     */
    ex(seconds?: number): this;

    /**
     * Configure a nearby geofence for the channel
     * @param {string} key - The key value
     * @returns {NearbyFenceInterface}
     */
    nearby(key: string): NearbyFenceInterface;

    /**
     * Configure a within geofence for the channel
     * @param {string} key - The key value
     * @returns {WithinFenceInterface}
     */
    within(key: string): WithinFenceInterface;

    /**
     * Configure an intersects geofence for the channel
     * @param {string} key - The key value
     * @returns {IntersectsFenceInterface}
     */
    intersects(key: string): IntersectsFenceInterface;
}

/**
 * SetHookInterface provides methods for configuring geospatial hooks
 */
export interface SetHookInterface extends SetChanInterface {
    /**
     * Set the endpoint for the hook
     * @param {string} value - The endpoint value
     * @returns {this}
     */
    endpoint(value: string): this;
}

/**
 * Tile38Options represents the options for configuring Tile38
 * @typedef {RedisOptions} Tile38Options
 */
export type Tile38Options = RedisOptions;

enum ListenerEvent {
    CONNECT = 'connect',
    READY = 'ready',
    ERROR = 'error',
    CLOSE = 'close',
    RECONNECTING = 'reconnecting',
    WAIT = 'wait',
}

/**
 * Tile38BaseInterface provides methods for interacting with the Tile38 server
 */
interface Tile38BaseInterface {
    /**
     * Register an event listener for the 'connect' event
     * @param {'connect'} event - The event type
     * @param {() => void} listener - The callback function
     * @returns {this}
     */
    on(event: `${ListenerEvent}`, listener: () => void): this;

    /**
     * Get the bounds for a specific key
     * @param {string} key - The key value
     * @returns {Promise<BoundsResponse>}
     */
    bounds(key: string): Promise<BoundsResponse>;

    /**
     * Get the channels matching a pattern
     * @param {string} [pattern] - The pattern to match
     * @returns {Promise<ChansResponse>}
     */
    chans(pattern?: string): Promise<ChansResponse>;

    /**
     * Get the configuration value for a specific key
     * @param {ConfigKeys} name - The configuration key
     * @returns {Promise<ConfigGetResponse>}
     */
    configGet(name: ConfigKeys): Promise<ConfigGetResponse>;

    /**
     * Set the configuration value for a specific key
     * @param {ConfigKeys} name - The configuration key
     * @param {string | number} value - The configuration value
     * @returns {Promise<JSONResponse>}
     */
    configSet(name: ConfigKeys, value: string | number): Promise<JSONResponse>;

    /**
     * Rewrite the configuration file
     * @returns {Promise<JSONResponse>}
     */
    configRewrite(): Promise<JSONResponse>;

    /**
     * Run the garbage collector
     * @returns {Promise<JSONResponse>}
     */
    gc(): Promise<JSONResponse>;

    /**
     * Get an object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {GetInterface}
     */
    get(key: string, id: string): GetInterface;

    /**
     * Get the hooks matching a pattern
     * @param {string} [pattern] - The pattern to match
     * @returns {Promise<HooksResponse>}
     */
    hooks(pattern?: string): Promise<HooksResponse>;

    /**
     * Check the health of the server
     * @returns {Promise<JSONResponse>}
     */
    healthz(): Promise<JSONResponse>;

    /**
     * Get the server information
     * @returns {Promise<InfoResponse>}
     */
    info(): Promise<InfoResponse>;

    /**
     * Query for objects that intersect with a specified key
     * @param {string} key - The key value
     * @returns {IntersectsInterface}
     */
    intersects(key: string): IntersectsInterface;

    /**
     * Get a JSON object by key, ID, and path
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @param {string} path - The JSON path
     * @param {'RAW'} [mode] - The mode
     * @returns {Promise<JsonGetResponse>}
     */
    jGet(
        key: string,
        id: string,
        path: string,
        mode?: 'RAW'
    ): Promise<JsonGetResponse>;

    /**
     * Get the keys matching a pattern
     * @param {string} [pattern] - The pattern to match
     * @returns {Promise<KeysResponse>}
     */
    keys(pattern?: string): Promise<KeysResponse>;

    /**
     * Query for nearby objects with a specified key
     * @param {string} key - The key value
     * @returns {NearbyInterface}
     */
    nearby(key: string): NearbyInterface;

    /**
     * Ping the server
     * @returns {Promise<PingResponse>}
     */
    ping(): Promise<PingResponse>;

    /**
     * Scan for objects with a specified key
     * @param {string} key - The key value
     * @returns {ScanInterface}
     */
    scan(key: string): ScanInterface;

    /**
     * Search for objects with a specified key
     * @param {string} key - The key value
     * @returns {SearchInterface}
     */
    search(key: string): SearchInterface;

    /**
     * Get the server information
     * @returns {Promise<ServerResponse>}
     */
    server(): Promise<ServerResponse>;

    /**
     * Get extended server information
     * @returns {Promise<ServerExtendedResponse>}
     */
    serverExtended(): Promise<ServerExtendedResponse>;

    /**
     * Get statistics for specified keys
     * @param {...string} keys - The keys to get statistics for
     * @returns {Promise<StatsResponse>}
     */
    stats(...keys: string[]): Promise<StatsResponse>;

    /**
     * Query for objects within a specified area with a key
     * @param {string} key - The key value
     * @returns {WithinInterface}
     */
    within(key: string): WithinInterface;

    /**
     * Quit the connection
     * @param {boolean} force - If true, force quit the connection
     * @returns {Promise<void>}
     */
    quit(force: boolean): Promise<void>;
}

/**
 * FollowerInterface provides methods for interacting with a Tile38 server in follower mode
 */
export interface FollowerInterface extends Tile38BaseInterface {
    /**
     * Get the server information in follower mode
     * @returns {Promise<ServerFollowerResponse>}
     */
    server(): Promise<ServerFollowerResponse>;

    /**
     * Get the info of the server in follower mode
     * @returns {Promise<InfoFollowerResponse>}
     */
    info(): Promise<InfoFollowerResponse>;

    /**
     * Get the channel interface
     * @returns {ChannelInterface}
     */
    channel(): ChannelInterface;
}

/**
 * LeaderInterface provides methods for interacting with a Tile38 server in leader mode
 */
export interface LeaderInterface extends Tile38BaseInterface {
    /**
     * Shrink the AOF file
     * @returns {Promise<JSONResponse>}
     */
    aofShrink(): Promise<JSONResponse>;

    /**
     * Get the channel interface
     * @returns {ChannelInterface}
     */
    channel(): ChannelInterface;

    /**
     * Delete an object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {Promise<JSONResponse>}
     */
    del(key: string, id: string): Promise<JSONResponse>;

    /**
     * Delete a channel by name
     * @param {string} name - The channel name
     * @returns {Promise<JSONResponse>}
     */
    delChan(name: string): Promise<JSONResponse>;

    /**
     * Delete a hook by name
     * @param {string} name - The hook name
     * @returns {Promise<JSONResponse>}
     */
    delHook(name: string): Promise<JSONResponse>;

    /**
     * Drop a key
     * @param {string} key - The key value
     * @returns {Promise<JSONResponse>}
     */
    drop(key: string): Promise<JSONResponse>;

    /**
     * Set the expiration time for an object in seconds
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @param {number} seconds - The expiration time in seconds
     * @returns {Promise<JSONResponse>}
     */
    expire(key: string, id: string, seconds: number): Promise<JSONResponse>;

    /**
     * Flush the database
     * @returns {Promise<JSONResponse>}
     */
    flushDb(): Promise<JSONResponse>;

    /**
     * Set the fields for an object
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @param {Fields} fields - The fields to set
     * @returns {FSetInterface}
     */
    fSet(key: string, id: string, fields: Fields): FSetInterface;

    /**
     * Set a JSON value for an object
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @param {string} path - The JSON path
     * @param {string | number} value - The value to set
     * @param {'RAW' | 'STR'} [mode] - The mode
     * @returns {Promise<JSONResponse>}
     */
    jSet(
        key: string,
        id: string,
        path: string,
        value: string | number,
        mode?: 'RAW' | 'STR'
    ): Promise<JSONResponse>;

    /**
     * Delete a JSON path for an object
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @param {string} path - The JSON path
     * @returns {Promise<JSONResponse>}
     */
    jDel(key: string, id: string, path: string): Promise<JSONResponse>;

    /**
     * Delete objects by pattern
     * @param {string} key - The key value
     * @param {string} pattern - The pattern to match
     * @returns {Promise<JSONResponse>}
     */
    pDel(key: string, pattern: string): Promise<JSONResponse>;

    /**
     * Delete channels by pattern
     * @param {string} pattern - The pattern to match
     * @returns {Promise<JSONResponse>}
     */
    pDelChan(pattern: string): Promise<JSONResponse>;

    /**
     * Delete hooks by pattern
     * @param {string} pattern - The pattern to match
     * @returns {Promise<JSONResponse>}
     */
    pDelHook(pattern: string): Promise<JSONResponse>;

    /**
     * Persist an object by removing its expiration
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {Promise<JSONResponse>}
     */
    persist(key: string, id: string): Promise<JSONResponse>;

    /**
     * Set the server to read-only mode
     * @param {boolean} [value] - If true, set to read-only mode
     * @returns {Promise<JSONResponse>}
     */
    readOnly(value?: boolean): Promise<JSONResponse>;

    /**
     * Rename a key
     * @param {string} key - The old key value
     * @param {string} newKey - The new key value
     * @param {boolean} [nx] - If true, only rename if new key does not exist
     * @returns {Promise<JSONResponse>}
     */
    rename(key: string, newKey: string, nx?: boolean): Promise<JSONResponse>;

    /**
     * Set an object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {SetInterface}
     */
    set(key: string, id: string): SetInterface;

    /**
     * Set a channel by name
     * @param {string} name - The channel name
     * @returns {SetChanInterface}
     */
    setChan(name: string): SetChanInterface;

    /**
     * Set a hook by name and endpoint
     * @param {string} name - The hook name
     * @param {string} endpoint - The endpoint value
     * @returns {SetHookInterface}
     */
    setHook(name: string, endpoint: string): SetHookInterface;

    /**
     * Get the TTL for an object by key and ID
     * @param {string} key - The key value
     * @param {string} id - The ID value
     * @returns {Promise<TTLResponse>}
     */
    ttl(key: string, id: string): Promise<TTLResponse>;
}
