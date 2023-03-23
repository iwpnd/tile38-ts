import { InfoLeaderResponse, Tile38 } from '..';

describe('info', () => {
    const tile38 = new Tile38();

    afterAll(() => tile38.quit());

    it('should send INFO command', async () => {
        const command = jest.spyOn(tile38.client, 'command');

        const expected: InfoLeaderResponse = {
            elapsed: expect.any(String) as string,
            ok: true,
            info: {
                aof_current_rewrite_time_sec: expect.any(Number) as number,
                aof_enabled: expect.any(Number) as number,
                aof_last_rewrite_time_sec: expect.any(Number) as number,
                aof_rewrite_in_progress: expect.any(Number) as number,
                cluster_enabled: 0,
                connected_clients: expect.any(Number) as number,
                connected_slaves: expect.any(Number) as number,
                expired_keys: expect.any(Number) as number,
                redis_version: expect.any(String) as string,
                tile38_version: expect.any(String) as string,
                slave0: expect.any(String) as string,
                total_messages_sent: expect.any(Number) as number,
                total_connections_received: expect.any(Number) as number,
                total_commands_processed: expect.any(Number) as number,
                uptime_in_seconds: expect.any(Number) as number,
                used_cpu_sys: expect.any(Number) as number,
                used_cpu_sys_children: expect.any(Number) as number,
                used_cpu_user: expect.any(Number) as number,
                used_cpu_user_children: expect.any(Number) as number,
                used_memory: expect.any(Number) as number,
                role: 'master',
            },
        };

        await expect(tile38.info()).resolves.toEqual(expected);

        expect(command).toHaveBeenCalledWith('INFO');
    });
});
