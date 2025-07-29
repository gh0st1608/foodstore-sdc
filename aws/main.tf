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

  environment {
    variables = {
      NODE_ENV = "dev"
    }
  }

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
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

  environment {
    variables = {
      NODE_ENV = "dev"
    }
  }

  tags = merge(local.common_tags, {
    Service = "order"
  })
}

# API Gateway REST
resource "aws_api_gateway_rest_api" "foodstore_api" {
  name        = "foodstore-api"
  description = "REST API for FoodStore"
  tags        = local.common_tags
}

# /auth
resource "aws_api_gateway_resource" "auth" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_rest_api.foodstore_api.root_resource_id
  path_part   = "auth"
}

# /auth/login
resource "aws_api_gateway_resource" "auth_login" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_resource.auth.id
  path_part   = "login"
}

resource "aws_api_gateway_method" "auth_login_post" {
  rest_api_id   = aws_api_gateway_rest_api.foodstore_api.id
  resource_id   = aws_api_gateway_resource.auth_login.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_login_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.foodstore_api.id
  resource_id             = aws_api_gateway_resource.auth_login.id
  http_method             = aws_api_gateway_method.auth_login_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.auth_lambda.invoke_arn
}

# /auth/register
resource "aws_api_gateway_resource" "auth_register" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_resource.auth.id
  path_part   = "register"
}

resource "aws_api_gateway_method" "auth_register_post" {
  rest_api_id   = aws_api_gateway_rest_api.foodstore_api.id
  resource_id   = aws_api_gateway_resource.auth_register.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_register_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.foodstore_api.id
  resource_id             = aws_api_gateway_resource.auth_register.id
  http_method             = aws_api_gateway_method.auth_register_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.auth_lambda.invoke_arn
}

resource "aws_lambda_permission" "auth_permission" {
  statement_id  = "AllowAPIGatewayInvokeAuth"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.foodstore_api.execution_arn}/*/*"
}

# /orders
resource "aws_api_gateway_resource" "orders" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_rest_api.foodstore_api.root_resource_id
  path_part   = "orders"
}

resource "aws_api_gateway_method" "orders_post" {
  rest_api_id   = aws_api_gateway_rest_api.foodstore_api.id
  resource_id   = aws_api_gateway_resource.orders.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "orders_post_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.foodstore_api.id
  resource_id             = aws_api_gateway_resource.orders.id
  http_method             = aws_api_gateway_method.orders_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.orders_lambda.invoke_arn
}

resource "aws_lambda_permission" "orders_permission" {
  statement_id  = "AllowAPIGatewayInvokeOrders"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.orders_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.foodstore_api.execution_arn}/*/*"
}

# Deploy
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.auth_login_lambda,
    aws_api_gateway_integration.auth_register_lambda,
    aws_api_gateway_integration.orders_post_lambda,
  ]
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  stage_name  = "dev"
}

output "auth_login_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/auth/login"
}

output "auth_register_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/auth/register"
}

output "orders_api_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/orders"
}
