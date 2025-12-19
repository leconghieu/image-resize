import { SQSEvent } from "aws-lambda";
import { resize } from "../utils/resize";
import { getImage, uploadToS3 } from "../services/s3";
import { WIDTHS } from "../utils/resize";

export const handler = async (event: SQSEvent) => {
    try {
        for (const record of event.Records) {
            const { originalS3Key, safeName } = JSON.parse(record.body);
            
            console.log(`▶️ Start resizing ${originalS3Key}`);
            
            const orginalImage = await getImage(originalS3Key, true);

            const buffer = Buffer.from(
                await orginalImage.Body!.transformToByteArray()
            );

            for (const width of WIDTHS) {
                const resized = await resize(buffer, width);
                await uploadToS3(
                    resized,
                    "image/jpeg",
                    `resized_image/${width}/${safeName}.jpeg`,
                    false
                );

                console.log(`✅ Resized resized_image/${width}/${safeName}.jpeg`);
            }
        }
    } catch (err) {
        console.log(err)
    }
}
