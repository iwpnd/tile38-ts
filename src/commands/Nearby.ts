import { Command } from '../Client';
import { NearbyInterface } from '../specs';
import { Intersects } from './Intersects';

export class Nearby extends Intersects implements NearbyInterface {
    protected readonly command = Command.NEARBY;
}
