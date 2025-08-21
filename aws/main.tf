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

# -----------------------------
# DynamoDB
# -----------------------------
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

resource "aws_dynamodb_table" "orders" {
  name         = "Orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "orderId"

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = merge(local.common_tags, {
    Service = "order"
  })
}



resource "aws_lambda_function" "auth_lambda" {
  function_name = "foodstore-auth-service"
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "${path.module}/dummy_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy_lambda.zip")

  timeout = 60

  environment {
    variables = {
      NODE_ENV = var.env
      JWT_SECRET= var.access_key
      JWT_REFRESH_SECRET= var.access_key
      ACCESS_KEY_ID= var.access_key
      SECRET_ACCESS_KEY= var.secret_key
      REGION= var.region
      EVENT_USER_REGISTERED_TOPIC= aws_sns_topic.user_registered_topic.arn
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

resource "aws_lambda_function" "order_lambda" {
  function_name = "foodstore-orders-service"
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "${path.module}/dummy_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy_lambda.zip")

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }

  environment {
    variables = {
      NODE_ENV = var.env
      ORDERS_TABLE = var.order_table
      EVENT_ORDER_CREATED_TOPIC = aws_sns_topic.order_created_topic.arn
      REGION= var.region
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

resource "aws_lambda_permission" "auth_login_permission" {
  statement_id  = "AllowInvokeAuthLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.foodstore_api.execution_arn}/${var.env}/POST/auth/login"
}

resource "aws_lambda_permission" "auth_register_permission" {
  statement_id  = "AllowInvokeAuthRegister"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.foodstore_api.execution_arn}/${var.env}/POST/auth/register"
}

# /orders
resource "aws_api_gateway_resource" "order" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_rest_api.foodstore_api.root_resource_id
  path_part   = "orders"
}

# /order/register
resource "aws_api_gateway_resource" "order_register" {
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  parent_id   = aws_api_gateway_resource.order.id
  path_part   = "register"
}

resource "aws_api_gateway_method" "order_register_post" {
  rest_api_id   = aws_api_gateway_rest_api.foodstore_api.id
  resource_id   = aws_api_gateway_resource.order_register.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "order_register_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.foodstore_api.id
  resource_id             = aws_api_gateway_resource.order_register.id
  http_method             = aws_api_gateway_method.order_register_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.auth_lambda.invoke_arn
}

resource "aws_lambda_permission" "order_register_permission" {
  statement_id  = "AllowInvokeOrderRegister"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.order_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.foodstore_api.execution_arn}/${var.env}/POST/orders/register"
}

# Deploy
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.auth_login_lambda,
    aws_api_gateway_integration.auth_register_lambda,
    aws_api_gateway_integration.order_register_lambda,
  ]
  rest_api_id = aws_api_gateway_rest_api.foodstore_api.id
  stage_name  = var.env

    triggers = {
    redeployment = sha1(jsonencode({
      login    = aws_api_gateway_integration.auth_login_lambda.id
      register = aws_api_gateway_integration.auth_register_lambda.id
      orders   = aws_api_gateway_integration.order_register_lambda.id
    }))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------
# SNS Topic y Lambda Notification
# -----------------------------

resource "aws_sns_topic" "user_registered_topic" {
  name = "user-registered-topic"
  tags = merge(local.common_tags, {
    Service = "notification"
  })
}

resource "aws_sns_topic" "order_created_topic" {
  name = "order-created-topic"
  tags = merge(local.common_tags, {
    Service = "order"
  })
}


resource "aws_lambda_function" "notification_lambda" {
  function_name = "foodstore-notification-service"
  handler       = "lambda-handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "${path.module}/dummy_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy_lambda.zip")

  timeout = 60

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }

  environment {
    variables = {
      NODE_ENV = var.env
    }
  }

  tags = merge(local.common_tags, {
    Service = "notification"
  })
}

resource "aws_sns_topic_subscription" "notification_user_registered_sub" {
  topic_arn = aws_sns_topic.user_registered_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notification_lambda.arn
}

resource "aws_sns_topic_subscription" "notification_order_created_sub" {
  topic_arn = aws_sns_topic.order_created_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notification_lambda.arn
}

resource "aws_lambda_permission" "allow_sns_to_invoke_notification_user_registered" {
  statement_id  = "AllowExecutionFromSNSUserRegistered"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.user_registered_topic.arn
}

resource "aws_lambda_permission" "allow_sns_to_invoke_notification_order_created" {
  statement_id  = "AllowExecutionFromSNSOrderCreated"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.order_created_topic.arn
}


output "user_registered_topic_arn" {
  value = aws_sns_topic.user_registered_topic.arn
}

output "order_created_topic_arn" {
  value = aws_sns_topic.order_created_topic.arn
}

output "auth_login_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/auth/login"
}

output "auth_register_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/auth/register"
}

output "orders_api_url" {
  value = "${aws_api_gateway_deployment.api_deployment.invoke_url}/orders/register"
}
