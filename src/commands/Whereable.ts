import { CommandArgs, SubCommand } from '../Client';
import { Executable } from './Executable';

export interface Where {
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
}

export class Whereable extends Executable implements Where {
    private _where: (
        | [SubCommand.WHERE, string, number, number]
        | [SubCommand.WHERE, string]
    )[] = [];

    compileWhere(): CommandArgs {
        return this._where.length ? [...this._where.flat()] : [];
    }

    resetWhere(): void {
        this._where = [];
    }

    setWhere(
        query:
            | [SubCommand.WHERE, string, number, number]
            | [SubCommand.WHERE, string]
    ): void {
        this._where.push(query);
    }

    where(field: string, min: number, max: number): this {
        this.setWhere([SubCommand.WHERE, field, min, max]);
        return this;
    }

    whereExpr(expr: string): this {
        this._where.push([SubCommand.WHERE, expr]);
        return this;
    }
}
