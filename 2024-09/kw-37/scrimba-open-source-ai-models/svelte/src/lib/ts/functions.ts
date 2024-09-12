function imgToBlob(canvas: HTMLCanvasElement, image: HTMLImageElement): Promise<Blob> {
	canvas.width = image.width;
	canvas.height = image.height;
	let ctx = canvas.getContext('2d')!;
	ctx.drawImage(image, 0, 0, image.width, image.height);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob!), 'image/jpeg');
	});
}

export { imgToBlob };
