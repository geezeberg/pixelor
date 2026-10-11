import '@testing-library/jest-dom/vitest';

class MockCanvasRenderingContext2D {
	canvas: HTMLCanvasElement;
	imageSmoothingEnabled = false;
	lastImageData: ImageData | null = null;
	clearRectCalls = 0;
	drawImageCalls = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	putImageData(imageData: ImageData) {
		this.lastImageData = imageData;
	}

	drawImage() {
		this.drawImageCalls += 1;
	}

	clearRect() {
		this.clearRectCalls += 1;
	}
}

declare global {
	interface HTMLCanvasElement {
		__mockContext?: MockCanvasRenderingContext2D;
	}
}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
	configurable: true,
	value(this: HTMLCanvasElement) {
		if (!this.__mockContext) {
			this.__mockContext = new MockCanvasRenderingContext2D(this);
		}

		return this.__mockContext;
	},
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
	configurable: true,
	value(callback: (blob: Blob | null) => void, type?: string) {
		callback(new Blob(['pixelor'], { type: type ?? 'image/png' }));
	},
});

