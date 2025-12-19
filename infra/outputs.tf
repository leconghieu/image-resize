output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

output "s3_bucket_original" {
  value = "https://${aws_s3_bucket.original_images.bucket_regional_domain_name}"
}

output "s3_bucket_resized" {
  value = "https://${aws_s3_bucket.resized_images.bucket_regional_domain_name}"
}
