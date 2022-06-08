import { Client } from '../Client';

export class WithClient {
    readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }
}
