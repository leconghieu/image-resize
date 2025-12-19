resource "aws_apigatewayv2_api" "http_api" {
  name          = "upload-image-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "upload_api_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.upload_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_resized_image_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_resized_image.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "upload_api_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /upload"
  target    = "integrations/${aws_apigatewayv2_integration.upload_api_integration.id}"
}

resource "aws_apigatewayv2_route" "get_image_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /image/{imageId}/{width}"
  target    = "integrations/${aws_apigatewayv2_integration.get_resized_image_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}
