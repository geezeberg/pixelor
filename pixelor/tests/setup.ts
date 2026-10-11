import '@testing-library/jest-dom/vitest';

class MockImageData {
	data: Uint8ClampedArray;
	width: number;
	height: number;

	constructor(width: number, height: number);
	constructor(data: Uint8ClampedArray, width: number, height?: number);
	constructor(
		dataOrWidth: Uint8ClampedArray | number,
		widthOrHeight: number,
		heightMaybe?: number,
	) {
		if (typeof dataOrWidth === 'number') {
			const width = dataOrWidth;
			const height = widthOrHeight;
			if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
				throw new TypeError('Invalid ImageData dimensions.');
			}

			this.width = width;
			this.height = height;
			this.data = new Uint8ClampedArray(width * height * 4);
			return;
		}

		const data = dataOrWidth;
		const width = widthOrHeight;
		const height = heightMaybe;

		if (!Number.isInteger(width) || width <= 0) {
			throw new TypeError('Invalid ImageData width.');
		}

		if (height === undefined) {
			if (data.length % (4 * width) !== 0) {
				throw new TypeError('ImageData data length is not compatible with width.');
			}
			this.height = data.length / (4 * width);
		} else {
			if (!Number.isInteger(height) || height <= 0) {
				throw new TypeError('Invalid ImageData height.');
			}
			if (data.length !== width * height * 4) {
				throw new TypeError('ImageData data length does not match width and height.');
			}
			this.height = height;
		}

		this.width = width;
		this.data = new Uint8ClampedArray(data);
	}
}

if (typeof globalThis.ImageData === 'undefined') {
	(globalThis as unknown as { ImageData: typeof ImageData }).ImageData = MockImageData as unknown as typeof ImageData;
}

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

Object.defineProperty(URL, 'createObjectURL', {
	configurable: true,
	value: () => 'blob:pixelor-test',
});

Object.defineProperty(URL, 'revokeObjectURL', {
	configurable: true,
	value: () => {},
});

Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
	configurable: true,
	value() {},
});

