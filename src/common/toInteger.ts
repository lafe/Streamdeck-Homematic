
export function toInteger(value: unknown): number {
    const INFINITY = 1 / 0;
    const MAX_INTEGER = 1.7976931348623157e308;
    if (!value) {
        return (value as number) === 0 ? value as number : 0;
    }
    const convertedValue = Number(value);
    if (convertedValue === INFINITY || convertedValue === -INFINITY) {
        const sign = convertedValue < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return convertedValue;
}
