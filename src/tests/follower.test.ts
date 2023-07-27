import { Position } from '@vpriem/geojson';
import { ServerExtendedResponse, Tile38 } from '..';

describe('follower', () => {
    const tile38 = new Tile38({
        url: process.env.TILE38_URI,
        followerUrl: process.env.TILE38_FOLLOWER_URI,
    });
    const command = jest.spyOn(tile38.client, 'command');

    afterAll(async () => {
        await tile38.flushDb();
        await tile38.quit();
    });

    beforeAll(() =>
        expect(
            tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        })
    );

    it('should send GET to follower', async () => {
        await expect(
            tile38.follower().get('fleet', 'truck1').asObject()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            object: {
                type: 'Point',
                coordinates: [
                    expect.any(Number) as number,
                    expect.any(Number) as number,
                ],
            },
        });

        expect(command).not.toHaveBeenCalled();
    });

    it('should send PING to follower', async () => {
        await expect(tile38.follower().ping()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            ping: 'pong',
        });

        expect(command).not.toHaveBeenCalled();
    });

    it('should send KEYS to follower', async () => {
        await expect(tile38.follower().keys()).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            keys: expect.any(Array) as string[],
        });

        expect(command).not.toHaveBeenCalled();
    });

    it('should send BOUNDS to follower', async () => {
        await expect(tile38.follower().bounds('fleet')).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
            bounds: {
                type: 'Polygon',
                coordinates: expect.any(Array) as Position[][],
            },
        });

        expect(command).not.toHaveBeenCalled();
    });

    it('should send SERVER to follower', async () => {
        const expected: ServerExtendedResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            stats: {
                alloc_bytes: expect.any(Number) as number,
                alloc_bytes_total: expect.any(Number) as number,
                buck_hash_sys_bytes: expect.any(Number) as number,
                frees_total: expect.any(Number) as number,
                gc_cpu_fraction: expect.any(Number) as number,
                gc_sys_bytes: expect.any(Number) as number,
                go_goroutines: expect.any(Number) as number,
                go_threads: expect.any(Number) as number,
                go_version: expect.any(String) as string,
                heap_alloc_bytes: expect.any(Number) as number,
                heap_idle_bytes: expect.any(Number) as number,
                heap_inuse_bytes: expect.any(Number) as number,
                heap_objects: expect.any(Number) as number,
                heap_released_bytes: expect.any(Number) as number,
                heap_sys_bytes: expect.any(Number) as number,
                last_gc_time_seconds: expect.any(Number) as number,
                lookups_total: expect.any(Number) as number,
                mallocs_total: expect.any(Number) as number,
                mcache_inuse_bytes: expect.any(Number) as number,
                mcache_sys_bytes: expect.any(Number) as number,
                mspan_inuse_bytes: expect.any(Number) as number,
                mspan_sys_bytes: expect.any(Number) as number,
                next_gc_bytes: expect.any(Number) as number,
                other_sys_bytes: expect.any(Number) as number,
                stack_inuse_bytes: expect.any(Number) as number,
                stack_sys_bytes: expect.any(Number) as number,
                sys_bytes: expect.any(Number) as number,
                sys_cpus: expect.any(Number) as number,
                tile38_aof_current_rewrite_time_sec: expect.any(
                    Number
                ) as number,
                tile38_aof_enabled: expect.any(Boolean) as boolean,
                tile38_aof_last_rewrite_time_sec: expect.any(Number) as number,
                tile38_aof_rewrite_in_progress: expect.any(Boolean) as boolean,
                tile38_aof_size: expect.any(Number) as number,
                tile38_avg_point_size: expect.any(Number) as number,
                tile38_cluster_enabled: expect.any(Boolean) as boolean,
                tile38_connected_clients: expect.any(Number) as number,
                tile38_connected_slaves: expect.any(Number) as number,
                tile38_expired_keys: expect.any(Number) as number,
                tile38_http_transport: expect.any(Boolean) as boolean,
                tile38_id: expect.any(String) as string,
                tile38_in_memory_size: expect.any(Number) as number,
                tile38_max_heap_size: expect.any(Number) as number,
                tile38_num_collections: expect.any(Number) as number,
                tile38_num_hooks: expect.any(Number) as number,
                tile38_num_objects: expect.any(Number) as number,
                tile38_num_points: expect.any(Number) as number,
                tile38_num_strings: expect.any(Number) as number,
                tile38_num_object_groups: expect.any(Number) as number,
                tile38_num_hook_groups: expect.any(Number) as number,
                tile38_pid: expect.any(Number) as number,
                tile38_pointer_size: expect.any(Number) as number,
                tile38_read_only: expect.any(Boolean) as boolean,
                tile38_total_commands_processed: expect.any(Number) as number,
                tile38_total_connections_received: expect.any(Number) as number,
                tile38_total_messages_sent: expect.any(Number) as number,
                tile38_type: expect.any(String) as string,
                tile38_uptime_in_seconds: expect.any(Number) as number,
                tile38_version: expect.any(String) as string,
            },
        };

        await expect(tile38.follower().serverExtended()).resolves.toEqual(
            expected
        );

        expect(command).not.toHaveBeenCalled();
    });
});
