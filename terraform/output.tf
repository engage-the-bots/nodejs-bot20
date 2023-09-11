output "slackbot_handler_invocation_url" {
  description = "The endpoint of the slackbot-handler lambda function"
  value       = aws_lambda_function_url.handler_endpoint.function_url
}
