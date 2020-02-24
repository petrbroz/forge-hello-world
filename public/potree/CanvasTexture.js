/**
 * @author mrdoob / http://mrdoob.com/
 */

function CanvasTexture( canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.needsUpdate = true;

}

CanvasTexture.prototype = Object.create( THREE.Texture.prototype );
CanvasTexture.prototype.constructor = CanvasTexture;
CanvasTexture.prototype.isCanvasTexture = true;

THREE.CanvasTexture = CanvasTexture;
