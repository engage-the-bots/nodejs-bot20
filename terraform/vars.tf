variable "slackbot_resource_name" {
  type        = string
  default     = ""
  description = "Resource-based name for the slackbot"
}

// Credentials
variable "slackbot_token" {
  type        = string
  default     = ""
  description = "Slackbot token used to authenticate with the Slack API"
}

variable "slack_signing_secret" {
  type        = string
  default     = ""
  description = "Secret used to verify the authenticity of requests from Slack to the Slackbot"
}

// AWS provider configs
variable "role_arn" {
  type        = string
  description = "The AWS IAM Role ARN for provisioning resources into the AWS account."
}

variable "aws_region" {
  type        = string
  description = "Operating region of the AWS Provider."
}

// Others
variable "tags" {
  type        = map(string)
  description = "Resource tags to attach to provisioned resources"
}
