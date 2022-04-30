export class CanvasIO {
    // Mouse state
    public mouseX: number = 0;
    public mouseY: number = 0;
    public mouseIsDown: boolean = false;

    // Key states
    public keysDown = new Map<string, boolean>();

    public constructor(canvasEl: HTMLCanvasElement) {
        canvasEl.onmousedown = ev => this.mouseIsDown = true;
        canvasEl.onmouseup = ev => this.mouseIsDown = false;
        canvasEl.onmousemove = ev => [this.mouseX, this.mouseY] = [ev.clientX, ev.clientY];
        canvasEl.onkeydown = ev => this.keysDown.set(ev.key, true);
        canvasEl.onkeyup = ev => this.keysDown.set(ev.key, false);
        canvasEl.onblur = ev => {
            this.mouseIsDown = false;
            this.keysDown.forEach((v, k, m) => m.set(k, false));
        }
    }

}