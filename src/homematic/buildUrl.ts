import { Dictionary } from "../data/Dictionary";

export type XmlApiEndPoints = "statelist" | "state" | "statechange" | "devicelist";
export function buildUrl(domain: string, securityToken: string, endpoint: XmlApiEndPoints, parameters?: Dictionary<string>) {
    let url = domain;
    if (!url.toLowerCase().startsWith("http") && !url.toLowerCase().startsWith("https")) {
        url = `http://${url}`;
    }
    if (!url.endsWith("/")) {
        url = `${url}/`;
    }
    url = `${url}addons/xmlapi/${endpoint}.cgi`;

    let urlParameters : Dictionary<string> = {};
    if (parameters == null) {
        urlParameters = {};
    } else {
        urlParameters = parameters;
    }

    if (urlParameters["sid"] == null) {
        urlParameters["sid"] = securityToken;
    }

    const parameterCollection = Object.keys(urlParameters).map(key => `${key}=${urlParameters[key]}`);
    url = `${url}?${parameterCollection.join("&")}`;
    return url;
}