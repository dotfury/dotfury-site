varying vec2 vUv;
varying float vWave;

uniform sampler2D uTexture;

void main(){
  float wave = vWave * 0.2;
  // split each texture color
  float r = texture2D(uTexture, vUv + wave * 2.0).r;
  float g = texture2D(uTexture, vUv + wave * 2.5).g;
  float b = texture2D(uTexture, vUv + wave * 4.0).b;
  // put them back together
  vec3 texture = vec3(r, g, b);
  // vec3 texture = texture2D(uTexture, vUv + wave).rgb;

  gl_FragColor = vec4(texture, 1.0);
}