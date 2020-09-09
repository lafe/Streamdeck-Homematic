import { isArray } from "./isArray";
import { isObject } from "./isObject";

export function isValue(value: unknown): boolean {
    return !isObject(value) && !isArray(value);
}
