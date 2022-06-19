export class Texture {
    public texture: WebGLTexture;

    public constructor(
        gl: WebGL2RenderingContext,
        public srcUrl: string = '',
    ) {
        const texture = gl.createTexture();
        if (!texture) throw new Error('Webgl failed to init texture');
        this.texture = texture;

        // Placeholder texture for use while real texture loaded async
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const bluePixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, bluePixel);

        // TODO: Parameterize these?
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (!srcUrl) return;

        // Asynchronously load the real texture
        const image = new Image();
        const imageLoadListeners: EventListener[] = [];
        const onLoad = () => {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            imageLoadListeners.forEach((listener) => image.removeEventListener('load', listener));
        };
        const onError = () => {
            // Set the texture to an opaque red pixel so it is obvious it has failed
            gl.bindTexture(gl.TEXTURE_2D, texture);
            const redPixel = new Uint8Array([255, 0, 0, 255]); // opaque red
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, redPixel);
            imageLoadListeners.forEach((listener) => image.removeEventListener('load', listener));
            throw new Error(`Failed to load texture image from url ${srcUrl}`);
        };
        imageLoadListeners.push(onLoad, onError);
        imageLoadListeners.forEach((listener) => image.addEventListener('load', listener));
        image.src = srcUrl;
    }
}
