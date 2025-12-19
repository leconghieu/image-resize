resource "aws_lambda_function" "resize_image" {
  function_name = "resize-image"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 60

  role             = aws_iam_role.lambda_role.arn
  filename         = "${path.root}/../dist/image-resize/index.zip"
  source_code_hash = filebase64sha256("${path.root}/../dist/image-resize/index.zip")

  environment {
    variables = {
      ORIGINAL_BUCKET = aws_s3_bucket.original_images.bucket
      RESIZED_BUCKET  = aws_s3_bucket.resized_images.bucket
    }
  }
}

resource "aws_lambda_function" "upload_api" {
  function_name = "upload-image-api"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 60

  role             = aws_iam_role.lambda_role.arn
  filename         = "${path.root}/../dist/api/index.zip"
  source_code_hash = filebase64sha256("${path.root}/../dist/api/index.zip")

  environment {
    variables = {
      ORIGINAL_BUCKET = aws_s3_bucket.original_images.bucket
      RESIZED_BUCKET  = aws_s3_bucket.resized_images.bucket
      QUEUE_URL       = aws_sqs_queue.resize_queue.url
    }
  }
}

resource "aws_lambda_function" "get_resized_image" {
  function_name = "get-resized-image"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 60

  role             = aws_iam_role.lambda_role.arn
  filename         = "${path.root}/../dist/get-image/index.zip"
  source_code_hash = filebase64sha256("${path.root}/../dist/get-image/index.zip")

  environment {
    variables = {
      ORIGINAL_BUCKET = aws_s3_bucket.original_images.bucket
      RESIZED_BUCKET  = aws_s3_bucket.resized_images.bucket
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_trigger_lambda" {
  event_source_arn = aws_sqs_queue.resize_queue.arn
  function_name    = aws_lambda_function.resize_image.arn
  batch_size       = 1
}

resource "aws_lambda_permission" "api_gateway_upload_api" {
  statement_id  = "AllowApiGatewayInvokeUploadApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upload_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*"
}

resource "aws_lambda_permission" "api_gateway_get_image_api" {
  statement_id  = "AllowApiGatewayInvokeGetImageApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_resized_image.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*"
}
