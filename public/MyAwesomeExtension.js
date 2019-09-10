class MyAwesomeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
    }

    load() {
        console.log('MyAwesomeExtension loaded.');
        return true;
    }

    unload() {
        console.log('MyAwesomeExtension unloaded.');
        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);
