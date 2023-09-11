import { Intersects } from './Intersects';
import { Command } from '../Client';
import { WithinInterface } from '../specs';

export class Within extends Intersects implements WithinInterface {
    protected readonly command = Command.WITHIN;
}
