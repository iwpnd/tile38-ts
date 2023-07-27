import EventEmitter from 'events';
import { Client } from '../Client';
import { ChannelInterface } from '../specs';

export class Channel extends EventEmitter implements ChannelInterface {
    private readonly client: Client;

    private subscribedToChannels: string[];

    private subscribedToPatterns: string[];

    constructor(client: Client) {
        super();

        this.client = client.on('message', (message, channel, pattern) =>
            this.emit('message', message, channel, pattern)
        );

        this.subscribedToPatterns = [];
        this.subscribedToChannels = [];
    }

    async subscribe(...channels: string[]): Promise<void> {
        await this.client.subscribe(channels);
        this.subscribedToChannels = channels;
    }

    async pSubscribe(...patterns: string[]): Promise<void> {
        await this.client.pSubscribe(patterns);
        this.subscribedToPatterns = patterns;
    }

    async unsubscribe(): Promise<void> {
        if (this.subscribedToPatterns.length) {
            await this.client.pUnsubscribe(this.subscribedToPatterns);
        }

        if (this.subscribedToChannels.length) {
            await this.client.unsubscribe(this.subscribedToChannels);
        }
    }
}
