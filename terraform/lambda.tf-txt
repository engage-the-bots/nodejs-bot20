locals {
  account_id = data.aws_caller_identity.current.account_id
}

/* LABMDA FUNCTION */
data "archive_file" "slackbot_handler_src" {
  type        = "zip"
  source_dir  = "${path.module}/../slackbot-event-handler"
  output_path = "${path.module}/dist/slackbot_event_handler.zip"
}

resource "aws_lambda_function" "slackbot_event_handler" {
  function_name    = "${var.slackbot_resource_name}-slackbot-event-handler"
  description      = "Handle incoming slack events"
  filename         = data.archive_file.slackbot_handler_src.output_path
  source_code_hash = data.archive_file.slackbot_handler_src.output_base64sha256
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "src/app.handler"
  runtime          = "nodejs18.x"
  memory_size      = 256
  timeout          = 5
  environment {
    variables = {
      SLACKBOT_TOKEN       = var.slackbot_token
      SLACK_SIGNING_SECRET = var.slack_signing_secret
    }
  }
  tags = var.tags
}

/* ROLE, PERMISSIONS, and POLICY */
resource "aws_iam_role" "lambda_execution_role" {
  name               = "${var.slackbot_resource_name}-slackbot-event-handler-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_service_role_assume_policy.json
  tags               = var.tags
}

data "aws_iam_policy_document" "lambda_service_role_assume_policy" {
  version = "2012-10-17"
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_execution_role_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_execution_role_policy.arn
}

resource "aws_iam_policy" "lambda_execution_role_policy" {
  name   = "${var.slackbot_resource_name}-slackbot-event-handler-service-role-policy"
  policy = data.aws_iam_policy_document.lambda_execution_role_policy_doc.json
  tags   = var.tags
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "lambda_execution_role_policy_doc" {
  version = "2012-10-17"
  statement {
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:${var.aws_region}:${local.account_id}:*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:${var.aws_region}:${local.account_id}:*"]
  }
}

/* LAMBDA URL */
resource "aws_lambda_function_url" "handler_endpoint" {
  function_name      = aws_lambda_function.slackbot_event_handler.function_name
  authorization_type = "NONE"
}
