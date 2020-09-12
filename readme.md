# Streamdeck-Homematic

Streamdeck plugin that adds support for some components of the Homematic home automation system.

## Requirements

The plugin connects to the Homematic CCU using the [XML-API CCU Addon](https://github.com/jens-maus/XML-API). The plugin therefore needs a Homematic setup that uses one of the supported CCU models by the XML-API. Currently, these are:

- [HomeMatic CCU3](https://www.eq-3.de/produkte/homematic/detail/smart-home-zentrale-ccu3-homematic.html) / [RaspberryMatic](http://raspberrymatic.de/)
- [HomeMatic CCU2](https://www.eq-3.de/produkte/homematic/detail/homematic-zentrale-ccu-2.html)
- HomeMatic CCU1

## Development

The plugin uses Gulp as task runner and Webpack as bundler. The UI components are written in React. Main entry points are the [app.ts](src/app.ts)/[index.html](src/index.html) that handles the events from the StreamDev device itself. Property Inspectors are implemented in their own files in the [propertyInspector](src/propertyInspector/) folder.
