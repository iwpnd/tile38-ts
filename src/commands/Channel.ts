import EventEmitter from 'events';
import { Client } from '../Client';
import { ChannelInterface } from '../specs';

export class Channel extends EventEmitter implements ChannelInterface {
    private readonly client: Client;

    private channels: string[] = [];

    private pChannels: string[] = [];

    constructor(client: Client) {
        super();

        this.client = client.on('message', (message, channel, pattern) =>
            this.emit('message', message, channel, pattern)
        );
    }

    async subscribe(...channels: string[]): Promise<void> {
        this.channels.push(...channels);
        return this.client.subscribe(channels);
    }

    async pSubscribe(...patterns: string[]): Promise<void> {
        this.pChannels.push(...patterns);
        return this.client.pSubscribe(patterns);
    }

    async unsubscribe(): Promise<void> {
        await Promise.all([
            this.channels.length && this.client.unsubscribe(this.channels),
            this.pChannels.length && this.client.pUnsubscribe(this.pChannels),
        ]);

        this.channels = [];
        this.pChannels = [];
    }
}
