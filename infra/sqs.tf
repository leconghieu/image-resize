# Dead Letter Queue
resource "aws_sqs_queue" "resize_dlq" {
  name = "resize-dlq"
}

resource "aws_sqs_queue" "resize_queue" {
  name                       = "resize-queue"
  visibility_timeout_seconds = 60

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.resize_dlq.arn
    maxReceiveCount     = 3
  })
}
