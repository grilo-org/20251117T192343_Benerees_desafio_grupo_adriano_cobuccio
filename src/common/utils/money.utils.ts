import Decimal from 'decimal.js';

export class MoneyUtils {
    static parse(amount: string | number | Decimal): Decimal {
        try {
            return new Decimal(amount);
        } catch (err) {
            throw new Error('Invalid monetary amount');
        }
    }

    static add(
        a: string | number | Decimal,
        b: string | number | Decimal,
    ): Decimal {
        return this.parse(a).add(this.parse(b));
    }

    static sub(
        a: string | number | Decimal,
        b: string | number | Decimal,
    ): Decimal {
        return this.parse(a).sub(this.parse(b));
    }

    static lt(
        a: string | number | Decimal,
        b: string | number | Decimal,
    ): boolean {
        return this.parse(a).lt(this.parse(b));
    }

    static lte(
        a: string | number | Decimal,
        b: string | number | Decimal,
    ): boolean {
        return this.parse(a).lte(this.parse(b));
    }

    static toString(
        value: string | number | Decimal,
        decimalPlaces = 2,
    ): string {
        return this.parse(value).toFixed(decimalPlaces);
    }

    static toCents(value: string | number | Decimal): number {
        return this.parse(value).mul(100).toNumber();
    }

    static fromCents(cents: number): string {
        return new Decimal(cents).dividedBy(100).toFixed(2);
    }
}

export default MoneyUtils;
