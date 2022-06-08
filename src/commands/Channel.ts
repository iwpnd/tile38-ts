import EventEmitter from 'events';
import { Client } from '../Client';
import { ChannelInterface } from '../specs';

export class Channel extends EventEmitter implements ChannelInterface {
    private readonly client: Client;

    constructor(client: Client) {
        super();

        this.client = client.on('message', (message, channel, pattern) =>
            this.emit('message', message, channel, pattern)
        );
    }

    async subscribe(...channels: string[]): Promise<void> {
        return this.client.subscribe(channels);
    }

    async pSubscribe(...patterns: string[]): Promise<void> {
        return this.client.pSubscribe(patterns);
    }

    async unsubscribe(): Promise<void> {
        await Promise.all([
            this.client.unsubscribe(),
            this.client.pUnsubscribe(),
        ]);
    }
}
