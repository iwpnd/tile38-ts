import { Point } from '@vpriem/geojson';
import { Fields, GeofenceDel, GeofenceSet, Meta, Tile38 } from '..';

interface CustomMeta extends Meta {
    m: string;
}

interface CustomerFields extends Fields {
    f: number;
}

describe('channel', () => {
    const tile38 = new Tile38(
        'redis://localhost:9851/',
        'redis://localhost:9852/'
    );

    afterAll(() => tile38.quit());

    beforeAll(async () => {
        await tile38.pDelChan('*');

        await expect(
            tile38
                .setChan('parking1')
                .meta({ m: 'p1' })
                .nearby('fleet')
                .detect('inside')
                .point(52.5514366408197, 13.430185317993164, 100)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });

        await expect(
            tile38
                .setChan('parking2')
                .nearby('fleet')
                .detect('inside')
                .point(52.54568565984199, 13.427749872207642, 100)
                .exec()
        ).resolves.toEqual({
            elapsed: expect.any(String) as string,
            ok: true,
        });
    });

    describe('subscribe to channel', () => {
        const channel = tile38.channel();
        const followerChannel = tile38.follower().channel();

        beforeAll(() =>
            Promise.all([
                channel.subscribe('parking1'),
                followerChannel.subscribe('parking1'),
            ])
        );

        afterAll(() =>
            Promise.all([channel.unsubscribe(), followerChannel.unsubscribe()])
        );

        it('should receive set geofence', async () => {
            const promise = new Promise((resolve) => {
                channel.on('message', (message, channelName) => {
                    if (message.command === 'set') {
                        resolve({ message, channelName });
                    }
                });
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.5514366408197, 13.43018531799316)
                .fields({ f: 1 })
                .exec();

            const expected: GeofenceSet<Point, CustomerFields, CustomMeta> = {
                command: 'set',
                group: expect.any(String) as string,
                detect: 'inside',
                hook: 'parking1',
                key: 'fleet',
                time: expect.any(String) as string,
                fields: { f: 1 },
                meta: { m: 'p1' },
                id: 'truck1',
                object: {
                    type: 'Point',
                    coordinates: [
                        expect.any(Number) as number,
                        expect.any(Number) as number,
                    ],
                },
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking1',
            });
        });

        it('should receive set geofence on follower', async () => {
            const promise = new Promise((resolve) => {
                followerChannel.on('message', (message, channelName) => {
                    if (message.command === 'set') {
                        resolve({ message, channelName });
                    }
                });
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.5514366408197, 13.43018531799316)
                .fields({ f: 1 })
                .exec();

            const expected: GeofenceSet<Point, CustomerFields, CustomMeta> = {
                command: 'set',
                group: expect.any(String) as string,
                detect: 'inside',
                hook: 'parking1',
                key: 'fleet',
                time: expect.any(String) as string,
                fields: { f: 1 },
                meta: { m: 'p1' },
                id: 'truck1',
                object: {
                    type: 'Point',
                    coordinates: [
                        expect.any(Number) as number,
                        expect.any(Number) as number,
                    ],
                },
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking1',
            });
        });

        it('should receive del geofence', async () => {
            const promise = new Promise((resolve) => {
                channel.on('message', (message, channelName) => {
                    if (message.command === 'del') {
                        resolve({ message, channelName });
                    }
                });
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.5514366408197, 13.43018531799316)
                .fields({ f: 1 })
                .ex(1)
                .exec();

            const expected: GeofenceDel<CustomMeta> = {
                command: 'del',
                hook: 'parking1',
                key: 'fleet',
                time: expect.any(String) as string,
                meta: { m: 'p1' },
                id: 'truck1',
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking1',
            });
        });

        it('should receive del geofence on follower', async () => {
            const promise = new Promise((resolve) => {
                followerChannel.on('message', (message, channelName) => {
                    if (message.command === 'del') {
                        resolve({ message, channelName });
                    }
                });
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.5514366408197, 13.43018531799316)
                .fields({ f: 1 })
                .ex(1)
                .exec();

            const expected: GeofenceDel<CustomMeta> = {
                command: 'del',
                hook: 'parking1',
                key: 'fleet',
                time: expect.any(String) as string,
                meta: { m: 'p1' },
                id: 'truck1',
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking1',
            });
        });
    });

    describe('pattern subscribe to channel', () => {
        const channel = tile38.channel();
        const followerChannel = tile38.follower().channel();

        beforeAll(() =>
            Promise.all([
                channel.pSubscribe('parking*'),
                followerChannel.pSubscribe('parking*'),
            ])
        );

        afterAll(() =>
            Promise.resolve([
                channel.unsubscribe(),
                followerChannel.unsubscribe(),
            ])
        );

        it('should receive set geofence', async () => {
            const promise = new Promise((resolve) => {
                channel.on<Point, CustomerFields, CustomMeta>(
                    'message',
                    (message, channelName) => {
                        resolve({ message, channelName });
                    }
                );
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.54568565984199, 13.427749872207642)
                .fields({ f: 2 })
                .exec();

            const expected: GeofenceSet<Point, CustomerFields> = {
                command: 'set',
                group: expect.any(String) as string,
                detect: 'inside',
                hook: 'parking2',
                key: 'fleet',
                time: expect.any(String) as string,
                id: 'truck1',
                fields: { f: 2 },
                meta: undefined,
                object: {
                    type: 'Point',
                    coordinates: [
                        expect.any(Number) as number,
                        expect.any(Number) as number,
                    ],
                },
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking2',
            });
        });

        it('should receive set geofence on follower', async () => {
            const promise = new Promise((resolve) => {
                followerChannel.on<Point, CustomerFields, CustomMeta>(
                    'message',
                    (message, channelName) => {
                        resolve({ message, channelName });
                    }
                );
            });

            await tile38
                .set('fleet', 'truck1')
                .point(52.54568565984199, 13.427749872207642)
                .fields({ f: 2 })
                .exec();

            const expected: GeofenceSet<Point, CustomerFields> = {
                command: 'set',
                group: expect.any(String) as string,
                detect: 'inside',
                hook: 'parking2',
                key: 'fleet',
                time: expect.any(String) as string,
                id: 'truck1',
                fields: { f: 2 },
                meta: undefined,
                object: {
                    type: 'Point',
                    coordinates: [
                        expect.any(Number) as number,
                        expect.any(Number) as number,
                    ],
                },
            };

            await expect(promise).resolves.toEqual({
                message: expected,
                channelName: 'parking2',
            });
        });
    });
});
