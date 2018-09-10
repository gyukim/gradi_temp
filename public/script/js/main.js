

    var  gradients=[]
    
    window.onload = function() {
        // allStart();
      window.parent.postMessage({ hello: 'parent' }, '*');
    }

       window.addEventListener('message', function(e) {
        gradients[0]=e.data;
        allStart();
       });

  
       function allStart(){
    function Project(RENDERER, SCENE, CAMERA, TEXTURE, INDEX){
        this.renderer = RENDERER;
        this.scene = SCENE;
        this.camera = CAMERA;
        this.texture = TEXTURE;
        // this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
        this.index = INDEX;
        this.material, this.geometry;
        this.mesh;
        this.seed = Math.random()*3.0 - 1.0;
        this.seedX, this.seedY;
        this.color0, this.color1,this.color2;
        this.init = function(){
            // this.material = new THREE.MeshBasicMaterial({
            // 	map: this.texture
            // })
            this.shader = new ProjectShader();
            this.material = new THREE.ShaderMaterial({
                uniforms: this.shader.uniforms,
                vertexShader: this.shader.vertexShader,
                fragmentShader: this.shader.fragmentShader,
                transparent: true,
                side: 2,
                depthWrite: false
            })
            // this.material.uniforms["texture"].value=this.texture;
            // var color = gradients[Math.floor(Math.random()*gradients.length)];
    /*		var color = projectGradients["travis scott"];
            this.color0 = new THREE.Color().set(color[0]);
            this.color1 = new THREE.Color().set(color[1]);
            // console.log(color0, color1);
            this.material.uniforms["color0"].value = this.color0;
            this.material.uniforms["color1"].value = this.color1;*/
            this.setColor();
              this.geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);//this.texture.image.width/renderSize.x, this.texture.image.height/renderSize.y);
              this.mesh = new THREE.Mesh(this.geometry, this.material);
              worldObject.add(this.mesh);
              this.mesh.position.z = Math.random()*100 - 50;
              this.mesh.position.x = Math.random()*2.0 - 1.0;
              this.mesh.position.y = Math.random()*2.0 - 1.0;
              this.mesh.rotation.x = this.seedX = Math.random()*0.1 - 0.05;
              this.mesh.rotation.y = this.seedY = Math.random()*0.1 - 0.05;
        }
        this.setColor = function(){
            // var colors = projectGradients[currentProject];
            var color = gradients[0];
            // this.color0 = new THREE.Color().set(colors[this.index%colors.length/*Math.floor(Math.random()*colors.length)*/]);
            this.color0 = new THREE.Color().set(color.colors[0]);
            this.color1 = new THREE.Color().set(color.colors[1]);
            this.color2 = new THREE.Color().set(color.colors[2]);
            // this.color1 = new THREE.Color().set(colors[this.index%colors.length/*Math.floor(Math.random()*colors.length)*/]);
    
            this.material.uniforms["color0"].value = this.color0;
            this.material.uniforms["color1"].value = this.color1;
            this.material.uniforms["color2"].value = this.color2;

        }
        this.update = function(){       
            // var color0 = new THREE.Color().set(color.colors[0]);
            // var color1 = new THREE.Color().set(color.colors[1]);
            var hsl0 = this.color0.getHSL();
            var hsl1 = this.color1.getHSL();
            var hsl2= this.color2.getHSL();
    
            // console.log(hsl0, hsl1);
            this.material.uniforms["color0"].value = this.color0.setHSL((hsl0.h + 0.0001)%1.0, hsl0.s, hsl0.l);
            this.material.uniforms["color1"].value = this.color1.setHSL((hsl1.h + 0.0001)%1.0, hsl1.s, hsl1.l);
            this.material.uniforms["color2"].value = this.color2.setHSL((hsl2.h + 0.0001)%1.0, hsl2.s, hsl2.l);
    
            // this.mesh.position.z += Math.sin(time + this.mesh.position.z)*this.mesh.position.z;
            this.mesh.position.x += Math.sin(time*0.05 + this.seed)*0.001;
            this.mesh.position.y += Math.cos(time*0.05 + this.seed)*0.001;
            this.mesh.rotation.y = ((mouse.x)*0.1 + this.seedX);
            this.mesh.rotation.x = ((mouse.y)*0.1 + this.seedY);
            // this.mesh.rotation.y = (mouse.x + this.seedX)*0.1;
            // this.mesh.rotation.x = (mouse.y + this.seedY)*0.1;
            // this.mesh.position.z += Math.cos(time*0.05 + this.seed)*this.seed*100.0;
            // this.mesh.rotation.x = mouse.x;//Math.sin(time*0.1 + this.seed)*0.001;
            // this.mesh.rotation.y = mouse.y;//Math.cos(time*0.1 + this.seed)*0.00001;
        }
        this.setUniforms = function(UNIFORMS){
            for(u in UNIFORMS){
                    // if (this.buffers[i].material.uniforms[u]) this.buffers[i].material.uniforms[u].value = UNIFORMS[u];                
                if (this.material.uniforms[u]) this.material.uniforms[u].value = UNIFORMS[u];                
            }
        }
    }
    var ProjectShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "displaceTex"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "color0"  : { type: "v3", value: null },
                "color1"  : { type: "v3", value: null },
                "color2"  : { type: "v3", value: null },
                "time"  : { type: "f", value: null },
            }
        ]);
        this.vertexShader = [
            "varying vec2 vUv;",
            "varying vec3 vNormal;",
            "void main() {",
            "    vUv = uv;",
            "    vNormal = normal;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D displaceTex;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform vec3 color0;",
            "uniform vec3 color1;",
            "uniform vec3 color2;",
            "uniform float time;",
            "varying vec2 vUv;",
            "varying vec3 vNormal;",
    /*        "#define L 0.1  // interline distance",
            "#define A 5.0  // amplification factor",
            "#define P 3.0  // thickness",*/
            "#define L 1.0  // interline distance",
            "#define A 3.0  // amplification factor",
            "#define P 3.0  // thickness",
            "vec3 mod289(vec3 x) {",
            "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
            "}",
    
            "vec2 mod289(vec2 x) {",
            "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
            "}",
    
            "vec3 permute(vec3 x) {",
            "  return mod289(((x*34.0)+1.0)*x);",
            "}",
    
            "float snoise(vec2 v)",
            "  {",
            "  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0",
            "                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)",
            "                     -0.577350269189626,  // -1.0 + 2.0 * C.x",
            "                      0.024390243902439); // 1.0 / 41.0",
            "// First corner",
            "  vec2 i  = floor(v + dot(v, C.yy) );",
            "  vec2 x0 = v -   i + dot(i, C.xx);",
    
            "// Other corners",
            "  vec2 i1;",
            "  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0",
            "  //i1.y = 1.0 - i1.x;",
            "  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
            "  // x0 = x0 - 0.0 + 0.0 * C.xx ;",
            "  // x1 = x0 - i1 + 1.0 * C.xx ;",
            "  // x2 = x0 - 1.0 + 2.0 * C.xx ;",
            "  vec4 x12 = x0.xyxy + C.xxzz;",
            "  x12.xy -= i1;",
    
            "// Permutations",
            "  i = mod289(i); // Avoid truncation effects in permutation",
            "  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
            "        + i.x + vec3(0.0, i1.x, 1.0 ));",
    
            "  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
            "  m = m*m ;",
            "  m = m*m ;",
    
            "// Gradients: 41 points uniformly over a line, mapped onto a diamond.",
            "// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)",
    
            "  vec3 x = 2.0 * fract(p * C.www) - 1.0;",
            "  vec3 h = abs(x) - 0.5;",
            "  vec3 ox = floor(x + 0.5);",
            "  vec3 a0 = x - ox;",
    
            "// Normalise gradients implicitly by scaling m",
            "// Approximation of: m *= inversesqrt( a0*a0 + h*h );",
            "  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",
    
            "// Compute final noise value at P",
            "  vec3 g;",
            "  g.x  = a0.x  * x0.x  + h.x  * x0.y;",
            "  g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
            "  return 130.0 * dot(m, g);",
            "}",
            "void main() {",
            "    vec4 color = vec4(vec3(0.0), 1.0);",
            // "    color -= color;",
            // "    vec2 fc = gl_FragCoord.xy;",
            "    vec2 fc = vUv*resolution;",
            "    fc /= L;//.0025;//((mouse.x)*0.005 + 1.0);",
            "    vec2  p = floor(fc+.5);",
            "    float noise = snoise(vUv*0.5 + time*0.5);",
            // "    #define T(x,y) texture2D(texture,L*vec2(x,y)/resolution.xy).g   // add .g or nothing ",
    
            // "    #define M(c,T) o += pow(.5+.5*cos( 6.28*(uv-p).c + A*(2.*T-1.) ),P)",
            // "    color += pow(.5+.5*cos( 6.28*(fc-p).y + A*(2.*texture2D(texture,L*vec2(fc.x, p.y)/resolution.xy).g-1.) ),P);",
            // "    color += pow(.5+.5*cos( 6.28*(fc-p).x + A*(2.*texture2D(texture,L*vec2(p.x, fc.y)/resolution.xy).g-1.) ),P);",
            "    color += pow(.5+.5*cos( 6.28*(fc-p).y + A*(2.*texture2D(displaceTex,L*vec2(fc.x, p.y)/resolution.xy).g-1.) ),P);",
            "    color += pow(.5+.5*cos( 6.28*(fc-p).x + A*(2.*texture2D(displaceTex,L*vec2(p.x, fc.y)/resolution.xy).g-1.) ),P);",
            "	 vec3 gradient = mix(color0.rgb, color1.rgb, vUv.x);",
            "    gl_FragColor = mix(vec4(vec3(0.0),0.0),vec4(gradient, 1.0)/*texture2D(texture, vec2(1.0 - vUv.x, vUv.y))*/, color.r);//dot(color.rgb, vec3(1.0)/3.0));",
            // "   if(dot(texture2D(texture, vUv).rgb, vec3(1.0)/3.0) > 0.01){",
            // "     gl_FragColor = mix(texture2D(texture, vUv), vec4(0.0), dot(color.rgb, vec3(1.0)/3.0));//mix(vec4(vec3(1.0),0.0),/*vec4(gradient, 1.0)*/texture2D(texture, vUv), color.r);//dot(color.rgb, vec3(1.0)/3.0));",
            // "   } else {",
            // "       discard;",
            // "   }",
            "}"
        
        ].join("\n");
    }


    function Daubs(RENDERER, SCENE, CAMERA, TEXTURE, SHADERS) {

        this.renderer = RENDERER;
        this.scene = SCENE;
        this.camera = CAMERA;
        this.texture = TEXTURE;
        // this.texture.minFilter = THREE.LinearFilter;
        // this.texture.magFilter = THREE.LinearFilter;
        this.mask, this.origTex;
        this.shader1 = SHADERS[0];
        this.shader2 = SHADERS[1];
        this.shader3 = SHADERS[2];
        this.outputShader = SHADERS[3];
    
        this.mesh;
    
    
        this.fbos = [];
        this.init = function() {
            this.fbos[0] = new FeedbackObject(this.shader1);
            this.fbos[0].material.uniforms.texture.value = this.texture;
            console.log(this.texture);
            this.fbos[1] = new FeedbackObject(this.shader2);
            this.fbos[1].material.uniforms.texture2.value = this.texture;
            this.fbos[1].material.uniforms.texture.value = this.fbos[0].renderTarget.texture;
    
            this.fbos[2] = new FeedbackObject(this.shader3);
            this.fbos[2].material.uniforms.texture.value = this.fbos[1].renderTarget.texture;
    
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
            }
    
            this.material = new THREE.ShaderMaterial({
                uniforms: this.outputShader.uniforms,
                vertexShader: this.outputShader.vertexShader,
                fragmentShader: this.outputShader.fragmentShader,
                transparent: true,
                side: 2
            });
            this.material.uniforms.texture.value = this.fbos[2].renderTarget.texture;
            this.material.uniforms.texture.minFilter = this.material.uniforms.texture.magFilter = THREE.LinearFilter;
            this.material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
            this.material.uniforms.mouse.value = new THREE.Vector2(renderSize.x, 0);
            this.material.uniforms["tMatCap"].value = renderTarget.texture; 
    
            // this.material.uniforms.mask.value = type.renderTarget;
            // this.material.uniforms.inputTex.value = texture;
            // this.material.uniforms.time.value = time;
    
            this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y, 0);
    
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.scene.add(this.mesh);
            this.fbos[0].material.uniforms.texture.value = this.fbos[1].renderTarget.texture;
        };
    
        this.resize = function() {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].renderTarget.setSize(renderSize.x, renderSize.y);
            }
        };
    
        this.update = function() {
            this.fbos[1].render(this.renderer, this.camera);
            this.fbos[2].render(this.renderer, this.camera);
            // this.fbos[2].material.uniforms.texture.value.needsUpdate = true;
        };
        this.expand = function(scl) {
            this.fbos[1].mesh.scale.set(scl, scl, scl);
        };
        this.scale = function(scl) {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].mesh.scale.set(scl, scl, scl);
            }
        };
        this.getNewFrame = function() {
            this.fbos[0].render(this.renderer, this.camera);
            // this.fbos[0].material.uniforms.texture.value.needsUpdate = true;
    
        };
        this.swapBuffers = function() {
            var a = this.fbos[2].renderTarget;
            this.fbos[2].renderTarget = this.fbos[0].renderTarget;
            this.fbos[0].renderTarget = a;
        };
        this.setUniforms = function(UNIFORMS) {
            for(u in UNIFORMS){
                for (var i = 0; i < this.fbos.length; i++) {
                    if (this.fbos[i].material.uniforms[u]) this.fbos[i].material.uniforms[u].value = UNIFORMS[u];                
                    if (this.material.uniforms[u]) this.material.uniforms[u].value = UNIFORMS[u];
                }
            }
            // for (var i = 0; i < this.fbos.length; i++) {
                // if (this.fbos[i].material.uniforms.time) this.fbos[i].material.uniforms.time.value = time;                
                // if (this.material.uniforms.time) this.material.uniforms.time.value = time;
                // if (this.fbos[i].material.uniforms.resolution) this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
                // if (this.material.uniforms.resolution) this.material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
                // if (this.fbos[i].material.uniforms.mouse) this.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouse.x, mouse.y);
                // if (this.material.uniforms.mouse) this.material.uniforms.mouse.value = new THREE.Vector2(mouse.x, mouse.y);
            // }
        };
        this.dispose = function() {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].dispose();
            }
            this.material.dispose();
            this.geometry.dispose();
            this.scene.remove(this.mesh);
        };
    }
    
    function FeedbackObject(SHADER) {
        this.scene = new THREE.Scene();
        this.renderTarget, this.shader, this.material, this.geometry, this.mesh;
        this.initialize = function(SHADER) {
            this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            });
            this.shader = SHADER;
            this.material = new THREE.ShaderMaterial({
                uniforms: this.shader.uniforms,
                vertexShader: this.shader.vertexShader,
                fragmentShader: this.shader.fragmentShader
            });
            this.geometry = new THREE.PlaneGeometry(5,2);
            // this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.scene.add(this.mesh);
        };
        this.initialize(SHADER);
        this.render = function(RENDERER, CAMERA) {
            RENDERER.render(this.scene, CAMERA, this.renderTarget, true);
        };
        this.dispose = function() {
            this.renderTarget.dispose();
            this.material.dispose();
            this.material.uniforms.texture.value.dispose();
            this.geometry.dispose();
            this.scene.remove(this.mesh);
        };
    }
    

var isMobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);
var renderSize;
var container = document.getElementById("container");
var PATH = './assets/';
var mouse = new THREE.Vector2(0.0, 0.0);
var time = 0.0;
var scene, camera, renderer;
var material, geometry;
var textures = [];
var loader = new THREE.TextureLoader();
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );
var mouseDown = 0.0;
var timeout;
var assetCount = 0;
var totalAssetCount = 4;
var input;
var currentProject = "mother";
if ( ! Detector.webgl ){
    CREATEDWEBGL = false;
    Detector.addGetWebGLMessage();
} else {
    CREATEDWEBGL = true;

}
var textures = [];
var images = [
    "IMG_1430.jpg",
    "IMG_1497.jpg",
    "IMG_1513.jpg",
    "IMG_1520.jpg",
    "IMG_1523.jpg"
]
var projects = [];
var videoTex;
var worldObject;
for(var i = 0; i < images.length; i++){
    // var tex = loader.load(PATH + "textures/" + images[i]);
    var tex = null;
    textures.push(tex);
}
init();


function loadCounter(){
    assetCount++;
    if(assetCount >= totalAssetCount){
        init();
    }
}
function init() {
    
    setRenderSize();
    scene = new THREE.Scene();
    projScene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(renderSize.x, renderSize.y);
    renderer.setClearColor(0xffffff, 1.0);
    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
    // camera = new THREE.PerspectiveCamera(45, renderSize.x/renderSize.y, 0.01, 100000);
    camera.position.z = 100;
    camera.rotation.y = Math.random()*Math.PI*2.0;

    camera2 = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
    camera2.position.z = 1;


    camera3 = new THREE.Camera();
    camera3.position.z = 1;

    controls = new THREE.OrbitControls(camera);
    controls.enabled = false;
    container.appendChild(renderer.domElement);

    uniforms = {
        "resolution": new THREE.Vector2(renderSize.x, renderSize.y),
        "displaceTex": null,
        "time": 0.0,
        "mouse": new THREE.Vector2(0.0,0.0),
        "r2":4.0,
    }
    worldObject = new THREE.Object3D();

    for(var i = 0; i < textures.length; i++){
        var proj = new Project(renderer, projScene, camera2, textures[i], i);
        proj.init();
        proj.setUniforms(uniforms);
        projects.push(proj);
    }
    projScene.add(worldObject);

    renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);

    shaders = [
        new FlowShader(),
        new DiffShader(),
        new FlowShader(),
        new NormalShader()
    ]
    daubs = new Daubs(renderer, scene, camera3, renderTarget.texture, shaders);
    daubs.init();
    daubs.setUniforms(uniforms);

    daubs.material.uniforms["tMatCap"].value = loader.load(PATH + "textures/jeepster_skinmat2.jpg");
    uniforms["displaceTex"] = daubs.fbos[2].renderTarget.texture;
    // worldObject.rotation.y = Math.PI;
    debounceResize = debounce(onWindowResize, 250);
    window.addEventListener("resize", debounceResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchdown', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', function(){screenshot(renderer)}, false);

    // capturer.start();
    animate();
}

function animate() {
    id = requestAnimationFrame(animate);
    draw();
}

function draw() {
   
    time += 0.125;    
    uniforms.time = time;    
    uniforms["mouse"].x = mouse.x*0.1;
    uniforms["mouse"].y = mouse.y*0.1;
    for(var i = 0; i < projects.length; i++){
        projects[i].update();
        projects[i].setUniforms(uniforms);
    }

    daubs.update();
    renderer.render(projScene, camera, renderTarget);
    renderer.render(scene, camera2);
    daubs.getNewFrame();
    daubs.swapBuffers();
    daubs.setUniforms(uniforms);  
    capturer.capture( renderer.domElement );



}
function onMouseMove(event) {
    event.preventDefault();

    mouse.x+=0.5;

    mouse.y+=0.2;
    var descriptions = document.getElementById("descriptions");
    console.log(); 
    for(var i = 0; i < projects.length; i++){
        // projects[i].setColor();
    }
}
function onMouseDown() {
    mouseDown = 1.0;
    // cancelAnimationFrame(id);
    mouse.x = (event.pageX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.pageY / renderSize.y) * 2 + 1;      
}
function onMouseUp() {
    mouseDown = 0.0;

}
function onDocumentTouchStart(event) {
    updateMouse(event);
}

function onDocumentTouchMove(event) {
    updateMouse(event);
}

function updateMouse(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouse.x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
        mouse.y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
    }
}

function onWindowResize(event) {
    setRenderSize();
    renderer.setSize(renderSize.x, renderSize.y);
    uniforms["resolution"] = new THREE.Vector2(renderSize.x, renderSize.y);

}

function setRenderSize(){
    renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // renderSize = new THREE.Vector2(window.innerHeight*2448/3264, window.innerHeight);
}
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            var file = window.URL.createObjectURL(blob);
            var img = new Image();
            img.src = file;
            img.onload = function(e) {
                window.open(this.src);

            }
        }
        function dataURItoBlob(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
    if (event.keyCode == "82") {
        capturer.start();
    }
    if (event.keyCode == "84") {
        capturer.stop();
        capturer.save(function(blob) {
            window.open(blob);
        });
    }
}
       }