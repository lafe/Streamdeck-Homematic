
export function isInteger(value: unknown): boolean {
    return typeof value === "number" && value === Number(value);
}
