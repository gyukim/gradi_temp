function NormalShader(){

		this.uniforms = THREE.UniformsUtils.merge([
			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null },
			 	"tNormal" : {type: 't', value: null },
	            "tMatCap" : {type: 't', value: null },
	            "time" : {type: 'f', value: 0 },
	            "bump" : {type: 'f', value: 0 },
	            "noise" : {type: 'f', value: .00 },
	            "repeat" : {type: 'v2', value: new THREE.Vector2( 1, 1 ) },
	            "useNormal" : {type: 'f', value: 1 },
	            "useRim" : {type: 'f', value: 0 },
	            "rimPower" : {type: 'f', value: 2 },
	            "useScreen" : {type: 'f', value: 0 },
	            "normalScale" : {type: 'f', value: 0.5 },
	            "normalRepeat" : {type: 'f', value: 1 }
			}
		]);

		this.vertexShader = [

			"attribute vec4 tangent;",

			"uniform float time;",
			"uniform vec2 repeat;",
			"uniform float useNormal;",
			"uniform float useRim;",

			"varying vec2 vUv;",
			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec3 vEye;",
			"varying vec3 vU;",
			"varying vec2 vN;",

			"void main() {",

			"	vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );",

			"	if( useNormal == 0. ) {",
			"		vec3 n = normalize( normalMatrix * normal );",
			"		vec3 r = reflect( vU, n );",
			"		float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );",
			"		vN = vec2( r.x / m + 0.5,  r.y / m + 0.5 );",
			"	} else {",
			"		vN = vec2( 0. );",
			"	}",

			"	vUv = repeat * uv;",
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"	vNormal = normalize( normalMatrix * normal );",
			"	if( useNormal == 1. ) {",
			"		vTangent = normalize( normalMatrix * tangent.xyz );",
			"		vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );",
			"	} else {",
			"		vTangent = vec3( 0. );",
			"		vBinormal = vec3( 0. );",
			"	}",

			"	if( useRim > 0. ) {",
			"		vEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;",
			"	} else {",
			"		vEye = vec3( 0. );",
			"	}",

			"}",
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform float time;",
			"uniform float bump;",
			"uniform sampler2D tNormal;",
			"uniform sampler2D tMatCap;",
			"uniform float noise;",
			"uniform float useNormal;",
			"uniform float useRim;",
			"uniform float rimPower;",
			"uniform float useScreen;",
			"uniform float normalScale;",
			"uniform float normalRepeat;",

			"uniform sampler2D texture; ",
			"uniform vec2 resolution; ",
			"uniform vec2 mouse; ",

			"varying vec2 vUv;",
			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec3 vEye;",
			"varying vec3 vU;",
			"varying vec2 vN;",

			"float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}",
			"// Using a sobel filter to create a normal map and then applying simple lighting.",

			"// This makes the darker areas less bumpy but I like it",
			"#define USE_LINEAR_FOR_BUMPMAP",

			"//#define SHOW_NORMAL_MAP",
			"//#define SHOW_ALBEDO",

			"struct C_Sample",
			"{",
			"	vec3 vAlbedo;",
			"	vec3 vNormal;",
			"};",
			"	",
			"C_Sample SampleMaterial(const in vec2 vUV, sampler2D sampler,  const in vec2 vTextureSize, const in float fNormalScale)",
			"{",
			"	C_Sample result;",
			"	",
			"	vec2 vInvTextureSize = vec2(1.0) / vTextureSize;",
			"	",
			"	vec3 cSampleNegXNegY = texture2D(sampler, vUV + (vec2(-1.0, -1.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSampleZerXNegY = texture2D(sampler, vUV + (vec2( 0.0, -1.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSamplePosXNegY = texture2D(sampler, vUV + (vec2( 1.0, -1.0)) * vInvTextureSize.xy).rgb;",
			"	",
			"	vec3 cSampleNegXZerY = texture2D(sampler, vUV + (vec2(-1.0, 0.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSampleZerXZerY = texture2D(sampler, vUV + (vec2( 0.0, 0.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSamplePosXZerY = texture2D(sampler, vUV + (vec2( 1.0, 0.0)) * vInvTextureSize.xy).rgb;",
			"	",
			"	vec3 cSampleNegXPosY = texture2D(sampler, vUV + (vec2(-1.0,  1.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSampleZerXPosY = texture2D(sampler, vUV + (vec2( 0.0,  1.0)) * vInvTextureSize.xy).rgb;",
			"	vec3 cSamplePosXPosY = texture2D(sampler, vUV + (vec2( 1.0,  1.0)) * vInvTextureSize.xy).rgb;",

			"	// convert to linear	",
			"	vec3 cLSampleNegXNegY = cSampleNegXNegY * cSampleNegXNegY;",
			"	vec3 cLSampleZerXNegY = cSampleZerXNegY * cSampleZerXNegY;",
			"	vec3 cLSamplePosXNegY = cSamplePosXNegY * cSamplePosXNegY;",

			"	vec3 cLSampleNegXZerY = cSampleNegXZerY * cSampleNegXZerY;",
			"	vec3 cLSampleZerXZerY = cSampleZerXZerY * cSampleZerXZerY;",
			"	vec3 cLSamplePosXZerY = cSamplePosXZerY * cSamplePosXZerY;",

			"	vec3 cLSampleNegXPosY = cSampleNegXPosY * cSampleNegXPosY;",
			"	vec3 cLSampleZerXPosY = cSampleZerXPosY * cSampleZerXPosY;",
			"	vec3 cLSamplePosXPosY = cSamplePosXPosY * cSamplePosXPosY;",

			"	// Average samples to get albdeo colour",
			"	result.vAlbedo = ( cLSampleNegXNegY + cLSampleZerXNegY + cLSamplePosXNegY ",
			"		    	     + cLSampleNegXZerY + cLSampleZerXZerY + cLSamplePosXZerY",
			"		    	     + cLSampleNegXPosY + cLSampleZerXPosY + cLSamplePosXPosY ) / 9.0;	",
			"	",
			"	vec3 vScale = vec3(0.3333);",
			"	",
			"	#ifdef USE_LINEAR_FOR_BUMPMAP",
			"		",
			"		float fSampleNegXNegY = dot(cLSampleNegXNegY, vScale);",
			"		float fSampleZerXNegY = dot(cLSampleZerXNegY, vScale);",
			"		float fSamplePosXNegY = dot(cLSamplePosXNegY, vScale);",
			"		",
			"		float fSampleNegXZerY = dot(cLSampleNegXZerY, vScale);",
			"		float fSampleZerXZerY = dot(cLSampleZerXZerY, vScale);",
			"		float fSamplePosXZerY = dot(cLSamplePosXZerY, vScale);",
			"		",
			"		float fSampleNegXPosY = dot(cLSampleNegXPosY, vScale);",
			"		float fSampleZerXPosY = dot(cLSampleZerXPosY, vScale);",
			"		float fSamplePosXPosY = dot(cLSamplePosXPosY, vScale);",
			"	",
			"	#else",
			"	",
			"		float fSampleNegXNegY = dot(cSampleNegXNegY, vScale);",
			"		float fSampleZerXNegY = dot(cSampleZerXNegY, vScale);",
			"		float fSamplePosXNegY = dot(cSamplePosXNegY, vScale);",
			"		",
			"		float fSampleNegXZerY = dot(cSampleNegXZerY, vScale);",
			"		float fSampleZerXZerY = dot(cSampleZerXZerY, vScale);",
			"		float fSamplePosXZerY = dot(cSamplePosXZerY, vScale);",
			"		",
			"		float fSampleNegXPosY = dot(cSampleNegXPosY, vScale);",
			"		float fSampleZerXPosY = dot(cSampleZerXPosY, vScale);",
			"		float fSamplePosXPosY = dot(cSamplePosXPosY, vScale);	",
			"	",
			"	#endif",
			"	",
			"	// Sobel operator - http://en.wikipedia.org/wiki/Sobel_operator",
			"	",
			"	vec2 vEdge;",
			"	vEdge.x = (fSampleNegXNegY - fSamplePosXNegY) * 0.25 ",
			"			+ (fSampleNegXZerY - fSamplePosXZerY) * 0.5",
			"			+ (fSampleNegXPosY - fSamplePosXPosY) * 0.25;",

			"	vEdge.y = (fSampleNegXNegY - fSampleNegXPosY) * 0.25 ",
			"			+ (fSampleZerXNegY - fSampleZerXPosY) * 0.5",
			"			+ (fSamplePosXNegY - fSamplePosXPosY) * 0.25;",

			"	result.vNormal = normalize(vec3(vEdge * fNormalScale, 1.0));	",
			"	",
			"	return result;",
			"}",

			"void main() {",
			// "	vec2 vUV = fragCoord.xy / iResolution.xy;",
			"	vec2 vUV = vUv*normalRepeat;",
			"	",
			"	C_Sample materialSample;",
			"		",
			"	float fNormalScale = 100.0;",
			"	materialSample = SampleMaterial( vUV, texture, resolution.xy, fNormalScale );",
			"	",
			"	// Random Lighting...",
			"	",
			"	float fLightHeight = 2.0;",
			"	float fViewHeight = 2.0;",
			"	",
			"	vec3 vSurfacePos = vec3(vUV, 0.0);",
			"	",
			"	vec3 vViewPos = vec3(0.5, 0.5, fViewHeight);",
			"			",
			// "	vec3 vLightPos = vec3( vec2(sin(time),cos(time)) * 0.25 + 0.5 , fLightHeight);",
			"		",
			// "	if( iMouse.z > 0.0 )",
			// "	{",
			"	vec3 vLightPos = vec3(vec2(0.5,0.5)/*mouse.xy / resolution.xy*/, fLightHeight);",
			// "	}",
			"	",
			"	vec3 vDirToView = normalize( vViewPos - vSurfacePos );",
			"	vec3 vDirToLight = normalize( vLightPos - vSurfacePos );",
			"		",
			"	float fNDotL = clamp( dot(materialSample.vNormal, vDirToLight), 0.0, 1.0);",
			"	float fDiffuse = fNDotL;",
			"	",
			"	vec3 vHalf = normalize( vDirToView + vDirToLight );",
			"	float fNDotH = clamp( dot(materialSample.vNormal, vHalf), 0.0, 1.0);",
			"	float fSpec = pow(fNDotH, 10.0) * fNDotL * 0.5;",
			"	",
			"	vec3 vResult = materialSample.vAlbedo * fDiffuse + fSpec;",
			"	",
			"	vResult = sqrt(vResult);",
			"	vResult = mix(vResult, texture2D(texture, vUv).rgb, 0.5);",
			"	",
			"	#ifdef SHOW_NORMAL_MAP",
			"	vResult = materialSample.vNormal * 0.5 + 0.5;",
			"	#endif",
			"	",
			"	#ifdef SHOW_ALBEDO",
			"	vResult = sqrt(materialSample.vAlbedo);",
			"	#endif",
			"	",
			"	vec3 finalNormal = vNormal;",
			"	vec2 calculatedNormal = vN;",

			"	if( useNormal == 1. ) {",
			// "		vec3 normalTex = texture2D( tNormal, vUv * normalRepeat ).xyz * 2.0 - 1.0;",
			"		vec3 normalTex = vResult * 2.0 - 1.0;",
			"		normalTex.xy *= normalScale;",
			"		normalTex.y *= -1.;",
			"		normalTex = normalize( normalTex );",
			// "		mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
			"		finalNormal = /*tsb * */normalTex;",

			"		vec3 r = reflect( vU, normalize( finalNormal ) );",
			"		float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );",
			"		calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );",
			"	}",

			"	vec3 base = texture2D( tMatCap, calculatedNormal ).rgb;",
			"	",
			"	// rim lighting",

			"	if( useRim > 0. ) {",
			"		float f = rimPower * abs( dot( vNormal, normalize( vEye ) ) );",
			"		f = useRim * ( 1. - smoothstep( 0.0, 1., f ) );",
			"        base += vec3( f );",
			"    }",

			"    // screen blending",

			"    if( useScreen == 1. ) {",
			"		base = vec3( 1. ) - ( vec3( 1. ) - base ) * ( vec3( 1. ) - base );",
			"	}",

			"    // noise ",

			"    base += noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );",

			// "	gl_FragColor = mix(vec4( base, 1. ), vec4(vResult,1.0), dot(texture2D(texture, vUv).rgb, vec3(1.0)/3.0));",
			// "	gl_FragColor = vec4( base, 1. );",
			"	gl_FragColor =/*vec4(vResult,1.0);//*/texture2D(texture, vUv);",

			"}",


		
		].join("\n");
}