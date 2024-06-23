import { Executable } from './Executable';
import { CommandArgs, SubCommand } from '../Client';

type WhereType = (
    | [SubCommand.WHERE, string, number, number]
    | [SubCommand.WHERE, string]
)[];

export type WhereInValues = (number | string)[];

type WhereInType = [SubCommand.WHEREIN, string, ...Array<string | number>][];

export interface Where {
    where(field: string, min: number, max: number): this;
    whereExpr(expr: string): this;
    wherein(field: string, values: WhereInValues): this;
}

export class Whereable extends Executable implements Where {
    private _where: WhereType = [];

    private _wherein: WhereInType = [];

    compileWhere(): CommandArgs {
        return this._where.length ? [...this._where.flat()] : [];
    }

    compileWherein(): CommandArgs {
        return this._wherein.length ? [...this._wherein.flat()] : [];
    }

    resetWhere(): void {
        this._where = [];
        this._wherein = [];
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
        this.setWhere([SubCommand.WHERE, expr]);
        return this;
    }

    wherein(field: string, values: WhereInValues): this {
        this._wherein.push([
            SubCommand.WHEREIN,
            field,
            values.length,
            ...values,
        ]);
        return this;
    }
}
