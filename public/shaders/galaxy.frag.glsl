#version 300 es
precision highp float;

in vec2 vTextureCoords;
out vec4 FragColor;

uniform float uTime;
uniform vec3 uTransformPosition;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m * m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g = vec3(a0.x * x0.x + h.x * x0.y, vec2(a0.yz * x12.xz + h.yz * x12.yw));
  return 130.0 * dot(m, g);
}

void main(void) {
  vec2 pos = vec2((vTextureCoords + uTransformPosition.xy) * 1.0);
  float n1 = snoise(pos * vec2(1000.0));
  float n2 = snoise(pos * vec2(500.0));
  float n3 = snoise(pos * vec2(250.0));
  float n4 = snoise(pos * vec2(1750.0));
  float redshiftIntensity = step(0.975, n1);
  float blueshiftIntensity = step(0.975, n2);
  vec3 starColor = vec3(n1 * n2 * n3);
  starColor.xz += vec2(redshiftIntensity*n4, blueshiftIntensity*n4);
  starColor.xy += vec2(n3*0.05);
  vec3 twinkleIntensity = (sin(uTime * 0.002 * n4 ) + 1.0) * starColor;
  vec3 color = starColor * twinkleIntensity;

  FragColor = vec4(color, 1.0);
}
