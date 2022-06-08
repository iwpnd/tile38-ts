import { ServerExtendedResponse, ServerResponse, Tile38 } from '..';

describe('server', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send SERVER command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: ServerResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            stats: {
                aof_size: expect.any(Number) as number,
                avg_item_size: expect.any(Number) as number,
                cpus: expect.any(Number) as number,
                heap_released: expect.any(Number) as number,
                heap_size: expect.any(Number) as number,
                http_transport: expect.any(Boolean) as boolean,
                id: expect.any(String) as string,
                in_memory_size: expect.any(Number) as number,
                max_heap_size: expect.any(Number) as number,
                mem_alloc: expect.any(Number) as number,
                num_collections: expect.any(Number) as number,
                num_hooks: expect.any(Number) as number,
                num_objects: expect.any(Number) as number,
                num_points: expect.any(Number) as number,
                num_strings: expect.any(Number) as number,
                pid: expect.any(Number) as number,
                pointer_size: expect.any(Number) as number,
                read_only: expect.any(Boolean) as boolean,
                threads: expect.any(Number) as number,
                version: expect.any(String) as string,
            },
        };

        await expect(tile38.server()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SERVER');
    });

    it('should send SERVER command with EXT', async () => {
        const command = jest.spyOn(tile38.client, 'command');

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
                tile38_num_object_groups: expect.any(Number) as number,
                tile38_num_hook_groups: expect.any(Number) as number,
                tile38_num_strings: expect.any(Number) as number,
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

        await expect(tile38.serverExtended()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('SERVER', ['EXT']);
    });
});
