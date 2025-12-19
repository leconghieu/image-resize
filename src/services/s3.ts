import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});

export const uploadToS3 = async (
    buffer: Buffer,
    contentType: string,
    key: string,
    isOriginal: boolean = true,
) => {
    return s3.send(new PutObjectCommand({
        Bucket: isOriginal ? process.env.ORIGINAL_BUCKET : process.env.RESIZED_BUCKET,
        Key: key,
        ContentType: contentType,
        Body: buffer,
    }));
}

export const getImage = async (key: string, isOriginal: boolean = true) => {
    return s3.send(
        new GetObjectCommand({
            Bucket: isOriginal ? process.env.ORIGINAL_BUCKET : process.env.RESIZED_BUCKET,
            Key: key,
        })
    );
}

// Check if object exists in s3 bucket (resized bucket only)
export const checkObjectExists = async (key: string) => {
    try {
        await s3.send(new HeadObjectCommand({
            Bucket: process.env.RESIZED_BUCKET,
            Key: key
        }));

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export const generateSignedUrl = async (key: string, isOriginal: boolean): Promise<string> => {
    return getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: isOriginal ? process.env.ORIGINAL_BUCKET : process.env.RESIZED_BUCKET,
            Key: key,
        }),
        { expiresIn: 600 }
    )
}
