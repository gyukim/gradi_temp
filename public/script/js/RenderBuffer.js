function RenderBuffer(SHADER, SCENE) {
    if(SCENE){
        this.scene = SCENE;
    } else {
        this.scene = new THREE.Scene();
    }

    this.renderTarget, this.shader, this.material, this.geometry, this.mesh;
    this.initialize = function(SHADER) {
        this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
        this.renderTarget.texture.minFilter = THREE.LinearFilter;
        this.renderTarget.texture.magFilter = THREE.LinearFilter;
        this.renderTarget.texture.wrapS = THREE.RepeatWrapping;
        this.renderTarget.wrapS = THREE.RepeatWrapping;
        this.renderTarget.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget.wrapT = THREE.RepeatWrapping;
        this.renderTarget.texture.format = THREE.RGBAFormat;
        this.shader = SHADER;
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            transparent: true
        });
        this.geometry = new THREE.PlaneGeometry(2,2);
        // this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
    };
    this.initialize(SHADER);
    this.render = function(RENDERER, CAMERA, TO_TARGET) {
        if(TO_TARGET){
            RENDERER.render(this.scene, CAMERA, this.renderTarget);            
        } else {
            RENDERER.render(this.scene, CAMERA);            
        }
    };
    this.dispose = function() {
        this.renderTarget.dispose();
        this.material.dispose();
        // this.material.uniforms.texture.value.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh);
    };
}