class PotreeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
        this._toolbar = null;
        this._group = null;
        this._pointcloud = null;
    }

    load() {
        console.log('PotreeExtension loaded.');
        return true;
    }

    unload() {
        console.log('PotreeExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._button = new Autodesk.Viewing.UI.Button('potree-button');
        this._button.onClick = () => {
            if (!this._group) {
                this.loadPointCloud('/potree/data/lion_takanawa/cloud.js');
            }
        };
        this._button.setToolTip('Show Potree Model');
        this._toolbar = new Autodesk.Viewing.UI.ControlGroup('potree-toolbar');
        this._toolbar.addControl(this._button);
        this.viewer.toolbar.addControl(this._toolbar);
    }

    loadPointCloud(url, position) {
        Potree.loadPointCloud(url, 'pointcloud', (e) => {
            this._group = new THREE.Group();
            this._group.isPotreeGroup = true; // for debugging
            this._group.scale.x = this._group.scale.y = this._group.scale.z = 5.0;
            this._group.position.z = -35.0;

            this._pointcloud = e.pointcloud;
            this._pointcloud.isPotree = true; // for debugging
            if (position !== undefined) {
                this._pointcloud.position.copy(position);
            }
            const material = this._pointcloud.material;
            material.size = 2;
            material.pointColorType = Potree.PointColorType.RGB; //RGB | DEPTH | HEIGHT | POINT_INDEX | LOD | CLASSIFICATION
            material.pointSizeType = Potree.PointSizeType.ADAPTIVE; //ADAPTIVE | FIXED
            material.shape = Potree.PointShape.CIRCLE; //CIRCLE | SQUARE

            this._group.add(this._pointcloud);
            if (!this.viewer.overlays.hasScene('potree-scene')) {
                this.viewer.overlays.addScene('potree-scene');
            }
            this.viewer.overlays.addMesh(this._group, 'potree-scene');
            this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatePointCloud.bind(this));
            this.updatePointCloud();
        });
    }

    updatePointCloud() {
        if (this._pointcloud) {
            const camera = this.viewer.impl.camera; //.perspectiveCamera;
            const renderer = this.viewer.impl.glrenderer();
            Potree.updatePointClouds([this._pointcloud], camera, renderer);
        }
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('PotreeExtension', PotreeExtension);
