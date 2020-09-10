export function parseJson<T>(rawData: string | unknown): T | null {
    if (typeof rawData === "object") {
        return rawData as unknown as T;
    }
    if(typeof rawData !== "string"){
        console.error(`The data type "${typeof rawData}" supplied to the parseJson function is currently unsupported.`);
        return null;
    }
    try {
        const data = JSON.parse(rawData) as T;
        return data;
    } catch(e){
        console.error(`While trying to convert the raw JSON data to an object, an error occured: ${e.message}`, e);
        return null;
    }
}