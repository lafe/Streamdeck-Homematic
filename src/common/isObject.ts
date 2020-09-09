
export function isObject(o: unknown): boolean {
    return typeof o === "object" && o !== null && o.constructor && o.constructor === Object;
}
