export function hasProperty(o: unknown, propertyName: string): boolean {
    if(o == null){
        return false;
    }

    return Object.prototype.hasOwnProperty.call(o, propertyName);
}