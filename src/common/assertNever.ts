export function assertNever(value: never, noError?: boolean){
    if(noError) {
        return value;
    }
    throw new Error(`The value ${JSON.stringify(value)} is not supported.`);
}