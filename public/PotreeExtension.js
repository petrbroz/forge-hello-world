class PotreeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._pointclouds = new Map();
    }

    load() {
        this._group = new THREE.Group();
        if (!this.viewer.overlays.hasScene('potree-scene')) {
            this.viewer.overlays.addScene('potree-scene');
        }
        this.viewer.overlays.addMesh(this._group, 'potree-scene');
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatePointClouds.bind(this));
        console.log('PotreeExtension loaded.');
        return true;
    }

    unload() {
        this.viewer.overlays.removeScene('potree-scene');
        console.log('PotreeExtension unloaded.');
        return true;
    }

    /**
     * Adds potree model into the scene and starts streaming its data.
     * @param {string} name Unique name of the model.
     * @param {string} url URL of the potree model main file (typically "cloud.js").
     * @param {THREE.Vector3} [position] Optional position to apply to the newly loaded pointcloud.
     * @param {THREE.Vector3} [scale] Optional scale to apply to the newly loaded pointcloud.
     * @example
     * const ext = viewer.getExtension('PotreeExtension');
     * ext.loadPointCloud('lion', '/potree/data/lion_takanawa/cloud.js', new THREE.Vector3(0, 0, -25), new THREE.Vector3(5, 5, 5));
     */
    loadPointCloud(name, url, position, scale) {
        if (this._pointclouds.has(name)) {
            return;
        }
        Potree.loadPointCloud(url, name, (ev) => {
            const { pointcloud } = ev;
            const { material } = pointcloud;
            if (position) {
                pointcloud.position.copy(position);
            }
            if (scale) {
                pointcloud.scale.copy(scale);
            }
            material.size = 2;
            material.pointColorType = Potree.PointColorType.RGB; //RGB | DEPTH | HEIGHT | POINT_INDEX | LOD | CLASSIFICATION
            material.pointSizeType = Potree.PointSizeType.ADAPTIVE; //ADAPTIVE | FIXED
            material.shape = Potree.PointShape.CIRCLE; //CIRCLE | SQUARE
            this._group.add(pointcloud);
            this._pointclouds.set(name, pointcloud);
            this.updatePointClouds();
        });
    }

    updatePointClouds() {
        const pointclouds = Array.from(this._pointclouds.values());
        if (pointclouds) {
            const camera = this.viewer.impl.camera; //.perspectiveCamera;
            const renderer = this.viewer.impl.glrenderer();
            Potree.updatePointClouds(pointclouds, camera, renderer);
        }
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('PotreeExtension', PotreeExtension);
