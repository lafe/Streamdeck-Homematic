export enum DeviceType {
    Relay = "HM-LC-Sw1-FM",
    ClimateControl = "HM-CC-TC",
    /**
     * Homematic Funk-Rollladenaktor 1fach
     * https://de.elv.com/homematic-funk-rollladenaktor-1fach-unterputzmontage-hm-lc-bl1-fm-fuer-smart-home-hausautomation-076799
     */
    BlindsRelais = "HM-LC-Bl1-PB-FM",
    /**
     * Homematic Funk-Rollladenaktor für Markenschalter
     * https://de.elv.com/homematic-funk-rollladenaktor-fuer-markenschalter-1fach-unterputzmontage-hm-lc-bl1pbu-fm-fuer-smart-home-hausautomation-103038
     */
    BlindsSwitch = "HM-LC-Bl1PBU-FM",
    /**
     * Homematic IP Smart Home Rollladenaktor HmIP-BROLL-2 für Markenschalter
     * https://de.elv.com/homematic-ip-rollladenaktor-hmip-broll-fuer-markenschalter-auch-fuer-markisenmotoren-geeignet-151322
     */
    BlindsSwitchIp2 = "HmIP-BROLL-2"
}