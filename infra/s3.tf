data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "original_images" {
  bucket = "original-bucket-${data.aws_caller_identity.current.account_id}"

  tags = {
    Project = "image-resize"
    Env     = "Dev"
  }
}

resource "aws_s3_bucket" "resized_images" {
  bucket = "resized-bucket-${data.aws_caller_identity.current.account_id}"

  tags = {
    Project = "image-resize"
    Env     = "Dev"
  }
}
