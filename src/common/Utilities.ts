class Utils {
    public static sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    public static isUndefined(value: unknown) {
        return typeof value === "undefined";
    }

    public static isObject(o: unknown) {
        return typeof o === "object" && o !== null && o.constructor && o.constructor === Object;
    }

    public static isPlainObject(o: unknown) {
        return typeof o === "object" && o !== null && o.constructor && o.constructor === Object;
    }

    public static isArray(value: unknown) {
        return Array.isArray(value);
    }

    public static isNumber(value: unknown) {
        return typeof value === "number" && value !== null;
    }

    public static isInteger(value: unknown) {
        return typeof value === "number" && value === Number(value);
    }
    public static isString(value: unknown) {
        return typeof value === "string";
    }
    public static isImage(value: unknown) {
        return value instanceof HTMLImageElement;
    }
    public static isCanvas(value: unknown) {
        return value instanceof HTMLCanvasElement;
    }
    public static isValue(value: unknown) {
        return !this.isObject(value) && !this.isArray(value);
    }

    public static isNull(value: unknown) {
        return value === null;
    }

    public static toInteger(value: unknown) {
        const INFINITY = 1 / 0,
            MAX_INTEGER = 1.7976931348623157e308;
        if (!value) {
            return value === 0 ? value : 0;
        }
        value = Number(value);
        if (value === INFINITY || value === -INFINITY) {
            const sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    }
}