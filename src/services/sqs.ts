import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const sendResizeMessage = async (originalS3Key: string, safeName: string) => {
    const sqs = new SQSClient({});
    await sqs.send(new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify({
            originalS3Key,
            safeName,
        })
    }))
}
