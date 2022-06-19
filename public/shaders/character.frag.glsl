#version 300 es
precision highp float;

in vec2 vTextureCoords;
out vec4 FragColor;

uniform sampler2D uTextureDiffuse;
uniform vec3 uTransformPosition;
uniform float uDirection;
uniform float uTime;
uniform vec4 uColor1;
uniform vec4 uColor2;

void main(void) {
    float directions = 4.0;
    float framesPerLoop = 3.0;
    vec2 spriteSheetSize = vec2(framesPerLoop, directions);

    // Texture offsets
    float footStride = 0.6;
    float texOffsetU = 1.0 / framesPerLoop * floor(abs(sin(
        (uTransformPosition.x * footStride) +
        abs(uTransformPosition.y * footStride)
    ) * 2.5));
    float texOffsetV = (1.0 / directions) * uDirection;
    vec2 texOffset = vec2(texOffsetU, texOffsetV);

    // Texture color
    vec4 textureColor = texture(uTextureDiffuse, vTextureCoords / spriteSheetSize + texOffset);
    
    // Clothing color
    vec3 clothingTint = vec3(0.4);
    // vec3 clothingTint = vec3(0.2, 0.6, 0.4);
    // vec3 clothingTint = vec3(0.8, 0.2, 0.4);
    // vec3 clothingTint = uColor1.rgb;
    vec3 textureGreyscale = vec3((textureColor.x + textureColor.y + textureColor.z) / 3.0);
    vec4 clothingColor = vec4(textureGreyscale * clothingTint, textureColor.a);
    float texHeadToBodyRatio = 0.47;
    float isAboveNeck = step(texHeadToBodyRatio, vTextureCoords.y);
    float isBelowNeck = step(-texHeadToBodyRatio, -vTextureCoords.y);

    FragColor = (textureColor * isBelowNeck) + (isAboveNeck * clothingColor);
    // FragColor = color;
}
