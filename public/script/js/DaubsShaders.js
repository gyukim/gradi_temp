	var DiffShader = function(){

		this.uniforms = THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				"displaceTex"  : { type: "t", value: null }

			}
		] );

		this.vertexShader = [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			"uniform sampler2D displaceTex;",
			// "uniform sampler2D texture3;",
			"varying vec2 vUv;",

			"void main() {",
			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec4 tex1 = texture2D(texture2, vUv);",
			// "  vec4 tex2 = texture2D(texture3, vUv);",

			// "  vec4 fc = (tex1 - tex0);",
			// "  vec4 fc = (tex1 - tex0);",
			// "  vec4 fc = (tex1*(1.0 - dot(texture2D(displaceTex, vUv).rgb, vec3(1.0)/3.0)) - tex0*(dot(texture2D(displaceTex, vUv).rgb, vec3(1.0)/3.0)));",
			"  vec4 fc = (tex1*0.05 + tex0*0.95);",
			// "  vec4 add = (fc + tex0);",
			"  gl_FragColor = vec4(fc);",
			"}"
		
		].join("\n");
		
	}
	var FlowShader = function(){

		this.uniforms = THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"reposTex"  : { type: "t", value: null },
				"displaceTex"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] );

		this.vertexShader = [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform float r2;",
			"uniform sampler2D texture;",
			"uniform sampler2D displaceTex;",
			"uniform sampler2D reposTex;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main( void ){",
			"    vec2 uv = vUv;",

			"    vec2 e = 1.0/resolution.xy;",


			"    float am1 = 0.5 + 0.5*0.927180409;",
			"    float am2 = 10.0;",
			// "	 float texCol = dot(texture2D(reposTex, vec2(1.0 - vUv.x, vUv.y)).rgb, vec3(1.0)/3.0);",
			"    for( int i=0; i<5; i++ ){",
			"    	float h  = dot( texture2D(texture, uv*0.1   ).xyz, vec3(1.0) );",
			"    	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0)).xyz, vec3(1.0) );",
			"    	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y)).xyz, vec3(1.0) );",
			"    	vec2 g = 0.001*vec2( (h-h2), (h-h1) )/e;",
			// "    	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
			"    	vec2 f = g.yx*vec2(5.0*mouse.x, 5.0*mouse.y);",
			// "    	vec2 f = g.yx*vec2(*2.0 - 1.0)*5.0;",
			// "    	vec2 f = g.yx*vec2(-1.0,1.0);",

			"   	g = mix( g, f, am1 );",

			"    	uv -= 0.00005*g*am2;",
			"    }",

			"    vec3 col2 = texture2D(texture, uv).xyz;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col2, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			"}"
		
		].join("\n");
	
	}
		var ReposShader = function(){

		this.uniforms = THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"reposTex"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] );

		this.vertexShader = [

			"varying vec2 vUv;",

			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			

			"varying vec2 vUv;",
			"uniform sampler2D texture;",
			"uniform sampler2D reposTex;",
			"uniform vec2 mouse;",
			"uniform vec2 resolution;",

			"uniform float r2;",

			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",

			"void main(){",

			"    vec2 tc = vUv;",
			"    vec4 look = texture2D(texture,tc);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*0.001;",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/3.333, mouse.y/3.333);",
			"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/50.0, mouse.y/50.0);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*(vec2(dot(texture2D(reposTex, vUv).rgb, vec3(1.0)/3.0))*2.0 - 1.0)/50.0;",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(0.0, 0.01);",
			"    vec2 coord = offs+tc;",
			"    vec4 repos = texture2D(texture, coord);",
			"    repos*=1.001;",
			// "    gl_FragColor = repos;",
			"  vec3 hsv = rgb2hsv(repos.rgb);",

			// "  hsv.r += 0.001;",
			// "  hsv.r = mod(hsv.r, 1.0);",
			// "  hsv.g *= 1.1;",
			"  //hsv.g = mod(hsv.g, 1.0);",
			"  repos.rgb = hsv2rgb(hsv); ",

			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, repos.rgb, f);",
		    "	}",
			"	gl_FragColor = vec4(repos.rgb,1.0);",
			"}"
		
		].join("\n");
		
	}
	var BlurShader = function(){

		this.uniforms = THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] );

		this.vertexShader = [

			"varying vec2 vUv;",

			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			

			"varying vec2 vUv;",
			"uniform sampler2D texture;",
			"uniform vec2 mouse;",
			"uniform vec2 resolution;",

			"uniform float r2;",

			"void main() {",
			"  float step_w = 1.0/resolution.x;",
			"  float step_h = 1.0/resolution.y;",
			"  vec2 tc = vUv;",
			"  vec4 input0 = texture2D(texture,tc);",
			"   ",
			"  vec2 x1 = vec2(step_w, 0.0);",
			"  vec2 y1 = vec2(0.0, step_h);",
			"    ",
			"  input0 += texture2D(texture, tc+x1); // right",
			"  input0 += texture2D(texture, tc-x1); // left",
			"  input0 += texture2D(texture, tc+y1); // top",
			"  input0 += texture2D(texture, tc-y1); // bottom",

			"  input0 *=0.2;",

			"  gl_FragColor = input0;",
			"}"
		
		].join("\n");
		
	}

	var PaintShader = function(){

		this.uniforms = THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"inputTex"  : { type: "t", value: null },
				"mask"  : { type: "t", value: null },
				"space"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"progress"  : { type: "f", value: null }

			}
		] );

		this.vertexShader = [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform sampler2D texture; ",
			"uniform sampler2D inputTex; ",
			"uniform sampler2D mask; ",
			"uniform float time; ",
			"uniform float progress; ",
			"uniform vec2 resolution; ",
			"varying vec2 vUv;",
			"vec3 textureColor(vec2 uv) {",
			"    return texture2D(texture,vec2(uv.x,uv.y)).rgb;   ",
			"    //return texture2D(iChannel0,uv).rgb;  ",
			"}",

			"float grid(float var, float size) {",
			"    return floor(var*size)/size;",
			"}",

			"float rand(vec2 co){",
			"    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
			"}",

			"void main()",
			"{",
			"    vec2 uv = vUv;//(fragCoord.xy / iResolution.xy);",
			"    ",
			"    float bluramount = sin(time)*0.1;",
			// "    if (iMouse.w >= 1.) {",
			// "    bluramount = 1.0/10.;",
			"    bluramount = 0.1;",
			// "    }",
			"	vec4 mask = texture2D(mask, vUv);",

			// "    //float dists = 5.;",
			// "    vec3 blurred_image = vec3(0.);",
			// "    #define repeats 2.",
			// "    for (float i = 0.; i < repeats; i++) { ",
			// "        //Older:",
			// "        //vec2 q = vec2(cos(degrees((grid(i,dists)/repeats)*360.)),sin(degrees((grid(i,dists)/repeats)*360.))) * (1./(1.+mod(i,dists)));",
			// "        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i,uv.x+uv.y))+bluramount);",
			// "        vec2 uv2 = uv+(q*bluramount);",
			// "        blurred_image += textureColor(uv2)/2.;",
			// "        //One more to hide the noise.",
			// "        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount);",
			// "        uv2 = uv+(q*bluramount);",
			// "        blurred_image += textureColor(uv2)/2.;",
			// "    }",
			// "    blurred_image /= repeats;",
			"        ",
			// "    gl_FragColor = vec4(mix(textureColor(vUv),blurred_image, mask.r),1.0);",
			"    gl_FragColor = vec4(mix(",
			"			mix(textureColor(vUv),texture2D(inputTex,vUv).rgb, 1.0-mask.r),",
			"			mix(textureColor(vUv),texture2D(inputTex,vUv).rgb, mask.r),",
			// "			progress)",
			"			0.0)",
			"	,1.0);",
			// "    gl_FragColor = vec4(textureColor(vUv),1.0);",
			"}",
	
			//  "const int radius = 1;",

			//  "void main() {",
			// "	 vec2 src_size = vec2 (1.0 / resolution.x, 1.0 / resolution.y);",
			//  "    //vec2 uv = gl_FragCoord.xy/resolution.xy;",
			//  "    vec2 uv = vUv;",
			//  "    float n = float((radius + 1) * (radius + 1));",
			//  "    int i; ",
			// "	 int j;",
			//  "    vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);",
			//  "    vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);",
			//  "    vec3 c;",

			//  "    for (int j = -radius; j <= 0; ++j)  {",
			//  "        for (int i = -radius; i <= 0; ++i)  {",
			//  "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			//  "            m0 += c;",
			//  "            s0 += c * c;",
			//  "        }",
			//  "    }",

			//  "    for (int j = -radius; j <= 0; ++j)  {",
			//  "        for (int i = 0; i <= radius; ++i)  {",
			//  "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			//  "            m1 += c;",
			//  "            s1 += c * c;",
			//  "        }",
			//  "    }",

			//  "    for (int j = 0; j <= radius; ++j)  {",
			//  "        for (int i = 0; i <= radius; ++i)  {",
			//  "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			//  "            m2 += c;",
			//  "            s2 += c * c;",
			//  "        }",
			//  "    }",

			//  "    for (int j = 0; j <= radius; ++j)  {",
			//  "        for (int i = -radius; i <= 0; ++i)  {",
			//  "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			//  "            m3 += c;",
			//  "            s3 += c * c;",
			//  "        }",
			//  "    }",


			//  "    float min_sigma2 = 1e+2;",
			//  "    m0 /= n;",
			//  "    s0 = abs(s0 / n - m0 * m0);",

			//  "    float sigma2 = s0.r + s0.g + s0.b;",
			//  "    if (sigma2 < min_sigma2) {",
			//  "        min_sigma2 = sigma2;",
			//  "        gl_FragColor = vec4(m0, 1.0);",
			//  "    }",

			//  "    m1 /= n;",
			//  "    s1 = abs(s1 / n - m1 * m1);",

			//  "    sigma2 = s1.r + s1.g + s1.b;",
			//  "    if (sigma2 < min_sigma2) {",
			//  "        min_sigma2 = sigma2;",
			//  "        gl_FragColor = vec4(m1, 1.0);",
			//  "    }",

			//  "    m2 /= n;",
			//  "    s2 = abs(s2 / n - m2 * m2);",

			//  "    sigma2 = s2.r + s2.g + s2.b;",
			//  "    if (sigma2 < min_sigma2) {",
			//  "        min_sigma2 = sigma2;",
			//  "        gl_FragColor = vec4(m2, 1.0);",
			//  "    }",

			//  "    m3 /= n;",
			//  "    s3 = abs(s3 / n - m3 * m3);",

			//  "    sigma2 = s3.r + s3.g + s3.b;",
			//  "    if (sigma2 < min_sigma2) {",
			//  "        min_sigma2 = sigma2;",
			//  "        gl_FragColor = vec4(m3, 1.0);",
			//  "    }",
			//  "}"
		
		].join("\n");
		
	}