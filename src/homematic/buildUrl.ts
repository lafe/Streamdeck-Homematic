import { Dictionary } from "../data/Dictionary";

export type XmlApiEndPoints = "statelist" | "state" | "statechange" | "devicelist";
export function buildUrl(domain: string, endpoint: XmlApiEndPoints, parameters?: Dictionary<string>) {
    let url = domain;
    if (!url.toLowerCase().startsWith("http") && !url.toLowerCase().startsWith("https")) {
        url = `http://${url}`;
    }
    if (!url.endsWith("/")) {
        url = `${url}/`;
    }
    url = `${url}addons/xmlapi/${endpoint}.cgi`;
    if (parameters != null) {
        const parameterCollection = Object.keys(parameters).map(key => `${key}=${parameters[key]}`);
        url = `${url}?${parameterCollection.join("&")}`;
    }
    return url;
}