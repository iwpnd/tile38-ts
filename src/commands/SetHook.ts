import { Client, Command } from '../Client';
import { SetHookInterface } from '../specs';
import { SetChan } from './SetChan';

export class SetHook extends SetChan implements SetHookInterface {
    protected readonly command = Command.SETHOOK;

    constructor(client: Client, name: string, endpoint: string) {
        super(client, name);
        this.endpoint(endpoint);
    }
}
