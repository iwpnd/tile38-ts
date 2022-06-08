/* eslint-disable camelcase */
import { GeoJSON, Polygon } from '@vpriem/geojson';

export type LatLon = {
    lat: number;
    lon: number;
};

export interface Bounds {
    ne: LatLon;
    sw: LatLon;
}

export type Fields = Record<string, number>;

export type Meta = Record<string, string>;

export type JSONResponse = {
    ok: boolean;
    elapsed: string;
    err?: string;
};

type ExtendResponse<E extends object> = JSONResponse & E;

export type ObjectResponse<
    O extends GeoJSON = GeoJSON,
    F extends Fields = Fields
> = ExtendResponse<{
    object: O;
    fields?: F;
}>;

export type ObjectsResponse<O extends GeoJSON = GeoJSON> = ExtendResponse<{
    objects: {
        object: O;
        id: string | number;
        distance?: number;
        fields?: number[];
    }[];
    count: number;
    cursor: number;
    fields?: string[];
}>;

export type StringObjectResponse<F extends Fields = Fields> = ExtendResponse<{
    object: string;
    fields?: F;
}>;

export type StringObjectsResponse = ExtendResponse<{
    objects: { id: string; object: string }[];
    count: number;
    cursor: number;
}>;

export type IdsResponse = ExtendResponse<{
    ids: string[];
    count: number;
    cursor: number;
}>;

export type CountResponse = ExtendResponse<{
    count: number;
    cursor: number;
}>;

export type PointResponse<F extends Fields = Fields> = ExtendResponse<{
    point: LatLon;
    fields?: F;
}>;

export type HashResponse<F = Fields> = ExtendResponse<{
    hash: string;
    fields?: F;
}>;

export type PointsResponse = ExtendResponse<{
    points: {
        point: LatLon;
        id: string | number;
        distance?: number;
        fields?: number[];
    }[];
    count: number;
    cursor: number;
    fields?: string[];
}>;

export type HashesResponse = ExtendResponse<{
    hashes: {
        hash: string;
        id: string | number;
        distance?: number;
        fields?: number[];
    }[];
    count: number;
    cursor: number;
    fields?: string[];
}>;

export type BoundsNeSwResponse<F extends Fields = Fields> = ExtendResponse<{
    bounds: Bounds;
    fields?: F;
}>;

export type BoundsNeSwResponses = ExtendResponse<{
    bounds: {
        bounds: Bounds;
        id: string | number;
        distance?: number;
        fields?: number[];
    }[];
    count: number;
    cursor: number;
    fields?: string[];
}>;

export type BoundsResponse = ExtendResponse<{
    bounds: Polygon;
}>;

export type KeysResponse = ExtendResponse<{
    keys: string[];
}>;

export type PingResponse = ExtendResponse<{
    ping: 'pong';
}>;

export type TTLResponse = ExtendResponse<{
    ttl: number;
}>;

export type StatsResponse = ExtendResponse<{
    stats: Array<{
        in_memory_size: number;
        num_objects: number;
        num_points: number;
        num_strings: number;
    } | null>;
}>;

export type ServerResponse = ExtendResponse<{
    stats: {
        aof_size: number;
        avg_item_size: number;
        cpus: number;
        heap_released: number;
        heap_size: number;
        http_transport: boolean;
        id: string;
        in_memory_size: number;
        max_heap_size: number;
        mem_alloc: number;
        num_collections: number;
        num_hooks: number;
        num_objects: number;
        num_points: number;
        num_strings: number;
        pid: number;
        pointer_size: number;
        read_only: boolean;
        threads: number;
        version: string;
    };
}>;

export type ServerExtendedResponse = ExtendResponse<{
    stats: {
        alloc_bytes: number;
        alloc_bytes_total: number;
        buck_hash_sys_bytes: number;
        frees_total: number;
        gc_cpu_fraction: number;
        gc_sys_bytes: number;
        go_goroutines: number;
        go_threads: number;
        go_version: string;
        heap_alloc_bytes: number;
        heap_idle_bytes: number;
        heap_inuse_bytes: number;
        heap_objects: number;
        heap_released_bytes: number;
        heap_sys_bytes: number;
        last_gc_time_seconds: number;
        lookups_total: number;
        mallocs_total: number;
        mcache_inuse_bytes: number;
        mcache_sys_bytes: number;
        mspan_inuse_bytes: number;
        mspan_sys_bytes: number;
        next_gc_bytes: number;
        other_sys_bytes: number;
        stack_inuse_bytes: number;
        stack_sys_bytes: number;
        sys_bytes: number;
        sys_cpus: number;
        tile38_aof_current_rewrite_time_sec: number;
        tile38_aof_enabled: boolean;
        tile38_aof_last_rewrite_time_sec: number;
        tile38_aof_rewrite_in_progress: boolean;
        tile38_aof_size: number;
        tile38_avg_point_size: number;
        tile38_cluster_enabled: boolean;
        tile38_connected_clients: number;
        tile38_connected_slaves: number;
        tile38_expired_keys: number;
        tile38_http_transport: boolean;
        tile38_id: string;
        tile38_in_memory_size: number;
        tile38_max_heap_size: number;
        tile38_num_collections: number;
        tile38_num_hooks: number;
        tile38_num_objects: number;
        tile38_num_points: number;
        tile38_num_strings: number;
        tile38_num_object_groups: number;
        tile38_num_hook_groups: number;
        tile38_pid: number;
        tile38_pointer_size: number;
        tile38_read_only: boolean;
        tile38_total_commands_processed: number;
        tile38_total_connections_received: number;
        tile38_total_messages_sent: number;
        tile38_type: string;
        tile38_uptime_in_seconds: number;
        tile38_version: string;
    };
}>;

export interface ServerFollowerResponse extends ServerResponse {
    stats: ServerResponse['stats'] & {
        caught_up: boolean;
        caught_up_once: boolean;
        following: string;
    };
}

export type InfoResponse = ExtendResponse<{
    info: {
        aof_current_rewrite_time_sec: number;
        aof_enabled: number;
        aof_last_rewrite_time_sec: number;
        aof_rewrite_in_progress: number;
        cluster_enabled: 1 | 0;
        connected_clients: number;
        connected_slaves: number;
        expired_keys: number;
        redis_version: string;
        tile38_version: string;
        total_messages_sent: number;
        total_connections_received: number;
        total_commands_processed: number;
        uptime_in_seconds: number;
        used_cpu_sys: number;
        used_cpu_sys_children: number;
        used_cpu_user: number;
        used_cpu_user_children: number;
        used_memory: number;
    };
}>;

export interface InfoFollowerResponse extends InfoResponse {
    info: InfoResponse['info'] & {
        role: 'slave';
        master_host: string;
        master_port: string;
    };
}

export interface InfoLeaderResponse extends InfoResponse {
    info: InfoResponse['info'] & {
        role: 'master';
    } & { [key: string]: string | number };
}

export type ConfigKeys =
    | 'requirepass'
    | 'leaderauth'
    | 'protected-mode'
    | 'maxmemory'
    | 'autogc'
    | 'keepalive';

export type ConfigGetResponse = ExtendResponse<{
    properties: Partial<Record<ConfigKeys, string>>;
}>;

export type JsonGetResponse = ExtendResponse<{
    value: string | number;
}>;

export type HooksResponse = ExtendResponse<{
    hooks: {
        name: string;
        endpoints: string[];
        key: string;
        meta?: object;
        command: string[];
        ttl: number;
    }[];
}>;

export type ChansResponse = ExtendResponse<{
    chans: {
        name: string;
        key: string;
        meta?: object;
        command: string[];
        ttl: number;
    }[];
}>;

export type Detect = 'inside' | 'outside' | 'enter' | 'exit' | 'cross';

export type Commands = 'set' | 'del';

export interface GeofenceSet<
    O extends GeoJSON = GeoJSON,
    F extends Fields | undefined = undefined,
    M extends Meta | undefined = undefined
> {
    command: 'set';
    group: string;
    detect: Detect;
    hook: string;
    key: string;
    fields: F;
    meta: M;
    time: string;
    id: string;
    object: O;
}

export interface GeofenceDel<M extends Meta | undefined = undefined> {
    command: 'del';
    hook: string;
    key: string;
    meta: M;
    time: string;
    id: string;
}

export interface GeofenceDrop<M extends Meta | undefined = undefined> {
    command: 'drop';
    hook: string;
    key: string;
    meta: M;
    time: string;
}

export type Geofence<
    O extends GeoJSON = GeoJSON,
    F extends Fields | undefined = undefined,
    M extends Meta | undefined = undefined
> = GeofenceSet<O, F, M> | GeofenceDel<M> | GeofenceDrop<M>;
