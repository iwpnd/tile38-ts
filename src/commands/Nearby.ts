import { Intersects } from './Intersects';
import { Command } from '../Client';
import { NearbyInterface } from '../specs';

export class Nearby extends Intersects implements NearbyInterface {
    protected readonly command = Command.NEARBY;
}
