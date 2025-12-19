import { APIGatewayEvent } from "aws-lambda";
import { WIDTHS } from "../utils/resize";
import { checkObjectExists, generateSignedUrl } from "../services/s3";

export const handler = async (event: APIGatewayEvent) => {
    const imageId = event.pathParameters?.imageId || "";
    const width = event.pathParameters?.width;

    if (!imageId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Image's id is missing" }),
        }
    }
    
    if (!width || !WIDTHS.includes(Number(width))) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Image's width is invalid" }),
        }
    }

    try {
        const key = `resized_image/${width}/${imageId}.jpeg`;
        const objectExists = await checkObjectExists(key);
        let presignedUrl;

        if (objectExists) {
            presignedUrl = await generateSignedUrl(key, false);

            return {
                statusCode: 301,
                headers: {
                    location: presignedUrl,
                }
            }; 
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Image not found" }),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal service error" }),
        }
    }
}
