#version 300 es
precision highp float;

out vec4 FragColor;

uniform vec4 uColor1;

void main(void) {
    FragColor = uColor1;
}
