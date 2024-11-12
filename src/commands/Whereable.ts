import { CommandArgs, SubCommand } from '../Client';
import { Executable } from './Executable';

/**
 * Represents the different types of WHERE clauses
 * @typedef {Array} WhereType
 * @property {Array} 0 - SubCommand.WHERE with field name and range values
 * @property {Array} 1 - SubCommand.WHERE with field name only
 */
type WhereType = (
    | [SubCommand.WHERE, string, number, number]
    | [SubCommand.WHERE, string]
)[];

/**
 * Represents the values for WHERE IN clause
 * @typedef {(number | string)[]} WhereInValues
 */
export type WhereInValues = (number | string)[];

/**
 * Represents the WHERE IN clause
 * @typedef {Array} WhereInType
 * @property {Array} 0 - SubCommand.WHEREIN with field name and values
 */
type WhereInType = [SubCommand.WHEREIN, string, ...(string | number)[]][];

export interface Where {
    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this;

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this;

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
    wherein(field: string, values: WhereInValues): this;
}

/**
 * Whereable class provides methods for setting WHERE clauses
 * @extends {Executable}
 * @implements {Where}
 */
export class Whereable extends Executable implements Where {
    private _where: WhereType = [];

    private _wherein: WhereInType = [];

    /**
     * Compile WHERE clauses into command arguments
     * @returns {CommandArgs}
     */
    compileWhere(): CommandArgs {
        return this._where.length ? [...this._where.flat()] : [];
    }

    /**
     * Compile WHERE IN clauses into command arguments
     * @returns {CommandArgs}
     */
    compileWherein(): CommandArgs {
        return this._wherein.length ? [...this._wherein.flat()] : [];
    }

    /**
     * Reset WHERE and WHERE IN clauses
     */
    resetWhere(): void {
        this._where = [];
        this._wherein = [];
    }

    /**
     * Set a WHERE clause
     * @param {Array} query - The WHERE query
     */
    setWhere(
        query:
            | [SubCommand.WHERE, string, number, number]
            | [SubCommand.WHERE, string]
    ): void {
        this._where.push(query);
    }

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {this}
     */
    where(field: string, min: number, max: number): this {
        this.setWhere([SubCommand.WHERE, field, min, max]);
        return this;
    }

    /**
     * Filter by values of a specific field using expressions
     * @param {string} expr - The where expression
     * @returns {this}
     */
    whereExpr(expr: string): this {
        this.setWhere([SubCommand.WHERE, expr]);
        return this;
    }

    /**
     * Filter by values of a specific field
     * @param {string} field - The field name
     * @param {WhereInValues} values - The values to set
     * @returns {this}
     */
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
