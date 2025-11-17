import MoneyUtils from './money.utils';

describe('MoneyUtils', () => {
    it('parses valid amounts and throws on invalid', () => {
        expect(MoneyUtils.parse('10.50').toFixed(2)).toBe('10.50');
        expect(MoneyUtils.parse(5).toNumber()).toBe(5);
        expect(() => MoneyUtils.parse('abc' as any)).toThrow(
            'Invalid monetary amount',
        );
    });

    it('performs add, sub, lt, lte', () => {
        expect(MoneyUtils.add('1.00', '2.00').toFixed(2)).toBe('3.00');
        expect(MoneyUtils.sub('5.00', '3.25').toFixed(2)).toBe('1.75');
        expect(MoneyUtils.lt('1.00', '2.00')).toBe(true);
        expect(MoneyUtils.lte('2.00', '2.00')).toBe(true);
    });

    it('converts to string and cents and from cents', () => {
        expect(MoneyUtils.toString('1.234')).toBe('1.23');
        expect(MoneyUtils.toCents('1.23')).toBe(123);
        expect(MoneyUtils.fromCents(250)).toBe('2.50');
    });
});
