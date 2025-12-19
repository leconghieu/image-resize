export const WIDTHS = [200, 400, 600, 800];

export const sanitizeFileName = (name: string): string => {
    return name
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9]/g, "");
}

export const generateFileName = (name: string, extension: string) => {
    const nameWithoutExtension = sanitizeFileName(name.split(".")[0]!);
    const ramdomPrefix = Math.random()
        .toString(36)
        .slice(2, 8);
    const safeName = `${ramdomPrefix}-${nameWithoutExtension}`.toLowerCase();

    return {
        s3Key: `original_image/${(new Date()).toISOString()}/${safeName}.${extension}`,
        safeName,
    };
}
