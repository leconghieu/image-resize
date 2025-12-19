import { Jimp } from "jimp";

export const WIDTHS = [200, 400, 600, 800];

export const resize = async (buffer: Buffer, width: number): Promise<Buffer> => {
    const image = await Jimp.read(buffer);
    image.resize({ w: width });

    return await image.getBuffer("image/jpeg");
}
