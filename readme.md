# Streamdeck-Homematic

This repository contains a [Stream Deck](https://www.elgato.com/en/gaming/stream-deck) plugin that adds support for some components of the [HomeMatic](https://www.eq-3.com/products/homematic.html) home automation system.

**This project is currently in an early prototype stage. It is not affiliated with eQ-3/HomeMatic or Elgato.**

## Requirements

The plugin connects to the HomeMatic CCU using the [XML-API CCU Addon](https://github.com/jens-maus/XML-API). The plugin therefore needs a HomeMatic setup that uses one of the supported CCU models by the XML-API. Currently, these are:

- [HomeMatic CCU3](https://www.eq-3.com/products/homematic/detail/smart-home-central-control-unit-ccu3-homematic.html) / [RaspberryMatic](http://raspberrymatic.de/)
- [HomeMatic CCU2](https://www.eq-3.com/products/homematic/detail/homematic-central-control-unit-ccu2.html)
- HomeMatic CCU1

The plugin has been tested with version [2.3](https://github.com/homematic-community/XML-API/releases/tag/2.3) of the XML-API Addon. It supports the use of a security token, that has to be created manually using the `tokenregister.cgi` script of the XML-API Addon. For further information, see the discussion in the [Homematic Forum](https://homematic-forum.de/forum/viewtopic.php?f=41&t=77234#p749409) (unfortunately, only in German).

## Supported devices

The software is currently only tested with the "normal" 15 key [Stream Deck](https://www.elgato.com/en/gaming/stream-deck). It is assumed that other Stream Deck variants (like [XL](https://www.elgato.com/en/gaming/stream-deck-xl) or [Mini](https://www.elgato.com/en/gaming/stream-deck-mini)) are working as well, but this has not been tested.

The following HomeMatic devices are currently supported:

- [HomeMatic Wireless Switch Actuator 1-channel, flush-mount](https://www.eq-3.com/products/homematic/detail/homematic-wireless-switch-actuator-1-channel-flush-mount.html) (HM-LC-Sw1-FM)
  - Toggle Switch
- HomeMatic Wireless Wall Thermostat (HM-CC-TC)
  - Display temperature and humidity (pressing the button will switch between both)
- Homematic Wireless Shutter controls (HM-LC-Bl1-PB-FM, HM-LC-Bl1PBU-FM and [HmIP-BROLL-2](https://homematic-ip.com/en/product/shutter-actuator-brand-switches))

## Development

The plugin uses Gulp as task runner and Webpack as bundler. The UI components are written in React. Main entry points are the [app.ts](src/app.ts)/[index.html](src/index.html) that handles the events from the StreamDev device itself. Property Inspectors are implemented in their own files in the [propertyInspector](src/propertyInspector/) folder.

The plugin only uses some parts of the [Elgato Stream Deck reference implementation](https://github.com/elgatosf/streamdeck-plugintemplate). Most parts are newly implemented to use TypeScript and to leverage the power of modern application web based application development (even though it is a bit slower as a result).

To start development, perform the following steps:

- Checkout source code

  ```bash
  git clone https://github.com/lafe/Streamdeck-Homematic.git
  ```

- Install npm dependencies

   ```bash
   npm install
   ```

- To build the software, you can use `npm build`. The result of the build process is located in the "dist" folder.
- To debug the software, you can use `npm run watch`. This starts a gulp watcher that detects changes and starts a new compilation when a change is detected. The output is also placed in the "dist" folder and is copied to the folder "%AppData%\Elgato\StreamDeck\Plugins\dev.fernhomberg.streamdeck.homematic.sdPlugin" folder. This folder is the default folder of Stream Deck plugin.

## Debugging

The official [Stream Deck SDK](https://developer.elgato.com/documentation/stream-deck/sdk/) has a [short tutorial](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/#debugging) on how to debug the application.

The most important part is to add a new `DWORD` registry key `html_remote_debugging_enabled` to your registry (`HKEY_CURRENT_USER\Software\Elgato Systems GmbH\StreamDeck`) and set its value to `1`. Afterwards, you have a debugging page on [http://localhost:23654/](http://localhost:23654/) in Chrome/Microsoft Edge.

A new version of the plugin is only picked up, if the Stream Deck application itself is restarted. To make this easier, you can use the [reloadStreamdeck.ps1](scripts/reloadStreamdeck.ps1) script in the "scripts" folder, which kills the running `Streamdeck.exe` process and restarts it. Combined with the behavior of the `npm run watch` script, this makes debugging and testing new versions easy.
