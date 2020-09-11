export function css(...args: (string | string[] | null | undefined)[]): string {
    const classes: string[] = [];

    for (const arg of args) {
        if (arg == null) {
            continue;
        } else if (typeof arg === "string") {
            classes.push(arg);
        } else if (Array.isArray(arg)) {
            const concatResult = css(...args);
            classes.push(concatResult);
        }
    }

    return classes.join(" ");
}