/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

	canvas : !! window.CanvasRenderingContext2D,
	webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers : !! window.Worker,
	fileapi : window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage : function () {

		var domElement = document.createElement("div");
		var inner = document.createElement("div");

		document.body.style.backgroundImage = 'url("./assets/textures/ls.jpg")';
		document.body.style.backgroundSize = 'cover';
		document.body.style.backgroundPosition = 'center';
		document.body.style.backgroundRepeat = 'no-repeat';
		domElement.style.color = 'white';
		domElement.style.width = '100vw';
		domElement.style.height = '100vh';
		domElement.style.fontFamily = 'HelveticaNeue-UltraLight';
		inner.style.top = '50%';
		inner.style.left = '50%';
		inner.style.width = "auto";
		inner.style.height = "auto";
		inner.style.fontSize = "24px";
		inner.style.textAlign = "center";
		inner.style.position = 'absolute';
		inner.style.transform = 'translate(-50%,-50%)';
		inner.style.webkitTransform = 'translate(-50%,-50%)';
		inner.style.mozTransform = 'translate(-50%,-50%)';
		inner.style.oTransform = 'translate(-50%,-50%)';
		domElement.appendChild(inner);
		if ( ! this.webgl ) {

			inner.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' );

		}

		return domElement;

	},

	addGetWebGLMessage : function ( parameters ) {

		var parent, id, domElement;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		domElement = Detector.getWebGLErrorMessage();
		domElement.id = id;

		parent.appendChild( domElement );

	}

};
