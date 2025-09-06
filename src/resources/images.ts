export const images: HTMLCanvasElement[] = [];

export const addImage = (image: HTMLCanvasElement): number => {
    const id = images.length;
    images.push(image);
    return id;
}