import { GeoJSON } from '@vpriem/geojson';
import { RedisOptions } from 'ioredis';
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

export interface ChannelInterface {
    on<
        O extends GeoJSON = GeoJSON,
        F extends Fields | undefined = undefined,
        M extends Meta | undefined = undefined
    >(
        event: 'message',
        listener: (message: Geofence<O, F, M>, channel: string) => void
    ): this;
    subscribe(...channel: string[]): Promise<void>;
    pSubscribe(...patterns: string[]): Promise<void>;
    unsubscribe(): Promise<void>;
}

export interface FSetInterface {
    key(value: string): this;
    id(value: string): this;
    xx(flag?: boolean): this;
    fields(fields?: Fields): this;
    exec(): Promise<JSONResponse>;
}

export interface GetInterface {
    key(value: string): this;
    id(value: string): this;
    withFields(flag?: boolean): this;
    output(format: 'BOUNDS' | 'OBJECT' | 'POINT' | 'STRING'): this;
    output(format: 'HASH', precision: number): this;
    asString<F extends Fields = Fields>(): Promise<StringObjectResponse<F>>;
    asBounds<F extends Fields = Fields>(): Promise<BoundsNeSwResponse<F>>;
    asHash<F extends Fields = Fields>(
        precision: number
    ): Promise<HashResponse<F>>;
    asObject<O extends GeoJSON = GeoJSON, F extends Fields = Fields>(): Promise<
        ObjectResponse<O, F>
    >;
    asPoint<F extends Fields = Fields>(): Promise<PointResponse<F>>;
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

interface IntersectsBaseInterface {
    key(value: string): this;
    cursor(value?: number): this;
    limit(value?: number): this;
    buffer(value?: number): this;
    noFields(flag?: boolean): this;
    match(value?: string): this;
    sparse(value?: number): this;
    clip(flag?: boolean): this;
    circle(lat: number, lon: number, radius: number): this;
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;
    hash(value: string): this;
    quadKey(value: string): this;
    sector(
        lat: number,
        lon: number,
        radius: number,
        bearing1: number,
        bearing2: number
    ): this;
    tile(x: number, y: number, z: number): this;
    object<O extends GeoJSON = GeoJSON>(value: O): this;
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export interface IntersectsFenceInterface extends IntersectsBaseInterface {
    detect(...what: Detect[]): this;
    commands(...which: Commands[]): this;
    exec(): Promise<JSONResponse>;
}

export interface IntersectsInterface extends IntersectsBaseInterface {
    all(flag?: boolean): this;
    get(key: string, id: string): this;
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;
    output(format: 'HASHES', precision: number): this;
    asBounds(): Promise<BoundsNeSwResponses>;
    asCount(): Promise<CountResponse>;
    asHashes(precision: number): Promise<HashesResponse>;
    asIds(): Promise<IdsResponse>;
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;
    asPoints(): Promise<PointsResponse>;
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

interface NearbyBaseInterface {
    key(value: string): this;
    cursor(value?: number): this;
    limit(value?: number): this;
    noFields(flag?: boolean): this;
    match(value?: string): this;
    sparse(value?: number): this;
    distance(flag?: boolean): this;
    point(lat: number, lon: number, radius?: number): this;
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export interface NearbyFenceInterface extends NearbyBaseInterface {
    detect(...what: Detect[]): this;
    commands(...which: Commands[]): this;
    exec(): Promise<JSONResponse>;
}

export interface NearbyInterface extends NearbyBaseInterface {
    all(flag?: boolean): this;
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;
    output(format: 'HASHES', precision: number): this;
    asBounds(): Promise<BoundsNeSwResponses>;
    asCount(): Promise<CountResponse>;
    asHashes(precision: number): Promise<HashesResponse>;
    asIds(): Promise<IdsResponse>;
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;
    asPoints(): Promise<PointsResponse>;
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

export interface ScanInterface {
    key(value: string): this;
    cursor(value?: number): this;
    limit(value?: number): this;
    noFields(flag?: boolean): this;
    match(value?: string): this;
    asc(flag?: boolean): this;
    desc(flag?: boolean): this;
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;
    output(format: 'HASHES', precision: number): this;
    all(flag?: boolean): this;
    asBounds(): Promise<BoundsNeSwResponses>;
    asCount(): Promise<CountResponse>;
    asHashes(precision: number): Promise<HashesResponse>;
    asIds(): Promise<IdsResponse>;
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;
    asPoints(): Promise<PointsResponse>;
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export interface SearchInterface {
    key(value: string): this;
    cursor(value?: number): this;
    limit(value?: number): this;
    noFields(flag?: boolean): this;
    match(value?: string): this;
    asc(flag?: boolean): this;
    desc(flag?: boolean): this;
    output(format: 'COUNT' | 'IDS' | 'OBJECTS'): this;
    all(flag?: boolean): this;
    asCount(): Promise<CountResponse>;
    asIds(): Promise<IdsResponse>;
    asStringObjects(): Promise<StringObjectsResponse>;
    exec<R extends JSONResponse = StringObjectsResponse>(): Promise<R>;
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export interface SetInterface {
    key(value: string): this;
    id(value: string): this;
    fields<F extends Fields = Fields>(fields?: F): this;
    ex(seconds?: number): this;
    nx(flag?: boolean): this;
    xx(flag?: boolean): this;
    object<O extends GeoJSON = GeoJSON>(geoJSON: O): this;
    point(lat: number, lon: number): this;
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;
    hash(value: string): this;
    string(value: string): this;
    exec(): Promise<JSONResponse>;
}

interface WithinBaseInterface {
    key(value: string): this;
    cursor(value?: number): this;
    limit(value?: number): this;
    buffer(value?: number): this;
    noFields(flag?: boolean): this;
    match(value?: string): this;
    sparse(value?: number): this;
    circle(lat: number, lon: number, radius: number): this;
    bounds(
        minLat: number,
        minLon: number,
        maxLat: number,
        maxLon: number
    ): this;
    hash(value: string): this;
    quadKey(value: string): this;
    sector(
        lat: number,
        lon: number,
        radius: number,
        bearing1: number,
        bearing2: number
    ): this;
    tile(x: number, y: number, z: number): this;
    object<O extends GeoJSON = GeoJSON>(value: O): this;
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export interface WithinFenceInterface extends WithinBaseInterface {
    detect(...what: Detect[]): this;
    commands(...which: Commands[]): this;
    exec(): Promise<JSONResponse>;
}

export interface WithinInterface extends WithinBaseInterface {
    all(flag?: boolean): this;
    get(key: string, id: string): this;
    output(format: 'BOUNDS' | 'COUNT' | 'IDS' | 'OBJECTS' | 'POINTS'): this;
    output(format: 'HASHES', precision: number): this;
    asBounds(): Promise<BoundsNeSwResponses>;
    asCount(): Promise<CountResponse>;
    asHashes(precision: number): Promise<HashesResponse>;
    asIds(): Promise<IdsResponse>;
    asObjects<O extends GeoJSON = GeoJSON>(): Promise<ObjectsResponse<O>>;
    asPoints(): Promise<PointsResponse>;
    exec<R extends JSONResponse = ObjectResponse>(): Promise<R>;
}

export interface SetChanInterface {
    name(value: string): this;
    meta<M extends Meta = Meta>(meta?: M): this;
    ex(seconds?: number): this;
    nearby(key: string): NearbyFenceInterface;
    within(key: string): WithinFenceInterface;
    intersects(key: string): IntersectsFenceInterface;
}

export interface SetHookInterface extends SetChanInterface {
    endpoint(value: string): this;
}

export type Tile38Options = RedisOptions;

interface Tile38BaseInterface {
    on(event: 'error', listener: (error: Error) => void): this;
    bounds(key: string): Promise<BoundsResponse>;
    chans(pattern?: string): Promise<ChansResponse>;
    configGet(name: ConfigKeys): Promise<ConfigGetResponse>;
    configSet(name: ConfigKeys, value: string | number): Promise<JSONResponse>;
    configRewrite(): Promise<JSONResponse>;
    gc(): Promise<JSONResponse>;
    get(key: string, id: string): GetInterface;
    hooks(pattern?: string): Promise<HooksResponse>;
    healthz(): Promise<JSONResponse>;
    info(): Promise<InfoResponse>;
    intersects(key: string): IntersectsInterface;
    jGet(
        key: string,
        id: string,
        path: string,
        mode?: 'RAW'
    ): Promise<JsonGetResponse>;
    keys(pattern?: string): Promise<KeysResponse>;
    nearby(key: string): NearbyInterface;
    ping(): Promise<PingResponse>;
    scan(key: string): ScanInterface;
    search(key: string): SearchInterface;
    server(): Promise<ServerResponse>;
    serverExtended(): Promise<ServerExtendedResponse>;
    stats(...keys: string[]): Promise<StatsResponse>;
    within(key: string): WithinInterface;
    quit(force: boolean): Promise<void>;
}

export interface FollowerInterface extends Tile38BaseInterface {
    server(): Promise<ServerFollowerResponse>;
    info(): Promise<InfoFollowerResponse>;
}

export interface LeaderInterface extends Tile38BaseInterface {
    aofShrink(): Promise<JSONResponse>;
    channel(): ChannelInterface;
    del(key: string, id: string): Promise<JSONResponse>;
    delChan(name: string): Promise<JSONResponse>;
    delHook(name: string): Promise<JSONResponse>;
    drop(key: string): Promise<JSONResponse>;
    expire(key: string, id: string, seconds: number): Promise<JSONResponse>;
    flushDb(): Promise<JSONResponse>;
    fSet(key: string, id: string, fields: Fields): FSetInterface;
    jSet(
        key: string,
        id: string,
        path: string,
        value: string | number,
        mode?: 'RAW' | 'STR'
    ): Promise<JSONResponse>;
    jDel(key: string, id: string, path: string): Promise<JSONResponse>;
    pDel(key: string, pattern: string): Promise<JSONResponse>;
    pDelChan(pattern: string): Promise<JSONResponse>;
    pDelHook(pattern: string): Promise<JSONResponse>;
    persist(key: string, id: string): Promise<JSONResponse>;
    readOnly(value?: boolean): Promise<JSONResponse>;
    rename(key: string, newKey: string, nx?: boolean): Promise<JSONResponse>;
    set(key: string, id: string): SetInterface;
    setChan(name: string): SetChanInterface;
    setHook(name: string, endpoint: string): SetHookInterface;
    ttl(key: string, id: string): Promise<TTLResponse>;
}
