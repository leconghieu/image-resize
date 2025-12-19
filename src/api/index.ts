import { APIGatewayEvent } from "aws-lambda";
import { fileTypeFromBuffer } from "file-type";
import { generateFileName } from "../utils/fileHelpers";
import { generateSignedUrl, uploadToS3 } from "../services/s3";
import { sendResizeMessage } from "../services/sqs";

export const handler = async (event: APIGatewayEvent) => {
    try {
        if (!event.body || !event.isBase64Encoded) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid request body" })
            }
        }

        const buffer = Buffer.from(event.body, "base64");
        const fileType = await fileTypeFromBuffer(buffer);

        if (!fileType || !fileType.mime.startsWith("image/")) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "The file should be image." }),
            }
        }

        const originalName = event.headers['x-filename'] ?? "image";
        const {s3Key, safeName} = generateFileName(originalName, fileType.ext);

        await uploadToS3(buffer, fileType.mime, s3Key);
        await sendResizeMessage(s3Key, safeName);

        return {
            statusCode: 200,
            body: JSON.stringify({
                original: await generateSignedUrl(s3Key, true),
                imageId: safeName,
            })
        }
    } catch (error) {
        console.log(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal service error" }),
        }
    } 
}
