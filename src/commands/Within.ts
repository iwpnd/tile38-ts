import { Command } from '../Client';
import { WithinInterface } from '../specs';
import { Intersects } from './Intersects';

export class Within extends Intersects implements WithinInterface {
    protected readonly command = Command.WITHIN;
}
