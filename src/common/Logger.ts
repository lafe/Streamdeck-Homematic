export class Logger {
    private identifier: string;
    constructor(identifier: string) {
        this.identifier = identifier.toUpperCase();
    }

    public log(message: string, ...data: unknown[]): void {
        console.log(`[${this.identifier}] ${message}`, ...data);
    }
    public info(message: string, ...data: unknown[]): void {
        console.info(`[${this.identifier}] ${message}`, ...data);
    }
    public warn(message: string, ...data: unknown[]): void {
        console.warn(`[${this.identifier}] ${message}`, ...data);
    }
    public error(message: string, ...data: unknown[]): void {
        console.error(`[${this.identifier}] ${message}`, ...data);
    }
}