export enum DeviceType {
    StreamDeck = 0,
    StreamDeckMini = 1,
    StreamDeckXL = 2,
    StreamDeckMobile = 3,
    CorsairGKeys = 4.
}

export interface DeviceInfo {
    name: string;
    size: {
        columns: number;
        rows: number;
    };
    type: DeviceType;
}