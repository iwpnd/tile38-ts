import { WithClient } from './WithClient';
import { Command, CommandArgs } from '../Client';
import { JSONResponse } from '../responses';

export interface Compilable {
    compile(): [Command, CommandArgs];
}

export class Executable extends WithClient implements Compilable {
    // istanbul ignore next
    compile(): [Command, CommandArgs] {
        // istanbul ignore next
        throw new Error('Not implemented');
    }

    async exec<R extends JSONResponse = JSONResponse>(): Promise<R> {
        return this.client.command(...this.compile());
    }
}
