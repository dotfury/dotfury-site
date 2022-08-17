varying vec2 vUv;
varying float vWave;

uniform sampler2D uTexture;
uniform float uAlpha;


void main(){
  float wave = vWave * 0.2;
  vec3 texture = texture2D(uTexture, vUv + wave).rgb;

  gl_FragColor = vec4(texture, uAlpha);
}