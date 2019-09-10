class MyAwesomeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._enabled = false;
    }

    load() {
        console.log('MyAwesomeExtension loaded.');
        return true;
    }

    unload() {
        console.log('MyAwesomeExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('myToolbarGroup');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('myToolbarGroup');
            this.viewer.toolbar.addControl(this._group);
        }

        this._button = new Autodesk.Viewing.UI.Button('myAwesomeButton');
        this._button.onClick = async (ev) => {
            this._enabled = !this._enabled;
            if (this._enabled) {
                const ids = await this.findLeafNodes();
                const filterProperties = ['Area'];
                const maxArea = 100.0;
                this.viewer.model.getBulkProperties(ids, filterProperties, (items) => {
                    for (const item of items) {
                        const areaProperty = item.properties[0];
                        const relativeArea = parseFloat(areaProperty.displayValue) / maxArea;
                        const color = new THREE.Color();
                        color.setHSL(relativeArea * 0.33, 1.0, 0.5);
                        this.viewer.setThemingColor(item.dbId, new THREE.Vector4(color.r, color.g, color.b, 0.5));
                    }
                });
            } else {
                this.viewer.clearThemingColors();
            }
        };
        this._button.setToolTip('My Awesome Extension Button');
        this._button.addClass('myAwesomeButtonIcon');
        this._group.addControl(this._button);
    }

    findLeafNodes() {
        return new Promise((resolve, reject) => {
            this.viewer.getObjectTree((tree) => {
                let ids = [];
                tree.enumNodeChildren(tree.getRootId(), (id) => {
                    if (tree.getChildCount(id) === 0) {
                        ids.push(id);
                    }
                }, true);
                resolve(ids);
            });
        });
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);
