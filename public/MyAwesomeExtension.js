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

    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('myToolbarGroup');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('myToolbarGroup');
            this.viewer.toolbar.addControl(this._group);
        }

        this._button = new Autodesk.Viewing.UI.Button('myAwesomeButton');
        this._button.onClick = (ev) => {
            alert('Hello World!');
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
