locals {
  common_tags = {
    Project     = "FoodStore"
    Environment = "dev"
    Owner       = "erick"
    Team        = "Backend"
    CostCenter  = "CC0001"
    Terraform   = "true"
  }
}

resource "null_resource" "create_dummy_zip" {
  provisioner "local-exec" {
    command = <<EOT
      mkdir -p dummy_lambda
      echo 'exports.handler = async () => "Init";' > dummy_lambda/index.js
      zip -j dummy_lambda.zip dummy_lambda/index.js
    EOT
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}


resource "aws_iam_role" "lambda_exec" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = ""
      }
    ]
  })

  tags = local.common_tags
}


resource "aws_dynamodb_table" "users" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
    read_capacity   = 5
    write_capacity  = 5
  }

  tags = merge(local.common_tags, {
    Service = "auth"
  })
}


resource "aws_lambda_function" "auth_lambda" {
  function_name = "foodstore-auth-service"
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "${path.module}/dummy_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy_lambda.zip")
  #filename      = var.auth_zip_path
  #s3_bucket = var.auth_lambda_bucket
  #s3_key    = var.auth_lambda_key

  environment {
    variables = {
      NODE_ENV = "dev"
    }
  }

  tags = merge(local.common_tags, {
    Service = "auth"
  })
}

resource "aws_lambda_function" "orders_lambda" {
  function_name = "foodstore-orders-service"
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "${path.module}/dummy_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy_lambda.zip")
  #filename      = var.orders_zip_path
  #s3_bucket = var.orders_lambda_bucket
  #s3_key    = var.orders_lambda_key

  environment {
    variables = {
      NODE_ENV = "dev"
    }
  }

  tags = merge(local.common_tags, {
    Service = "order"
  })
}