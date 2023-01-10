import { Command, CommandArgs } from '../Client';
import { JSONResponse } from '../responses';
import { WithClient } from './WithClient';

export interface Compilable {
    compile(): [Command, CommandArgs];
}

export class Executable extends WithClient implements Compilable {
    // eslint-disable-next-line class-methods-use-this
    compile(): [Command, CommandArgs] {
        // istanbul ignore next
        throw new Error('Not implemented');
    }

    async exec<R extends JSONResponse = JSONResponse>(): Promise<R> {
        return this.client.command(...this.compile());
    }
}