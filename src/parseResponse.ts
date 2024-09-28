/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import {
    Tile38Error,
    Tile38IdNotFoundError,
    Tile38KeyNotFoundError,
    Tile38NotCaughtUpError,
} from './errors';
import { JSONResponse } from './responses';

export const parseResponse = <R extends JSONResponse>(response: string): R => {
    let obj: R;

    try {
        obj = JSON.parse(response) as R;
    } catch (error) /* istanbul ignore next */ {
        throw new Tile38Error((error as Error).message || 'unknown');
    }

    if (!obj.ok) {
        const message = obj.err ?? /* istanbul ignore next */ 'unknown';

        if (message.includes('key not found')) {
            throw new Tile38KeyNotFoundError(message);
        }

        if (message.includes('id not found')) {
            throw new Tile38IdNotFoundError(message);
        }

        /* istanbul ignore next */
        if (message.includes('not caught up')) {
            throw new Tile38NotCaughtUpError(message);
        }

        throw new Tile38Error(message);
    }

    return obj;
};
