### PROVIDERS ###
aws_region   = "us-west-2"
role_arn = "arn:aws:iam::{{aws_account_id}}:role/{{role_name}}"

### Slackbot ###
slackbot_resource_name = "hello-bolt--{{some_identifier}}"
slack_signing_secret = "d9e7b0b0b0b0b0b0b0b0b0b0b0b0b0b0"
slackbot_token = "xoxb-000000000000-000000000000-00000000000"

### STANDARD VARS ###
tags = {
  # standard tags
  ProductCategory   = "Engage"
  ProductFamily     = "Slackbots"
  Product           = "Hello Bolt"
  Lifecycle         = "sandbox"
  TechContact       = "{{somebody}}"
  AdminContact      = "mldelaro"
  Repo              = "https://github.com/engage-the-bots/hello-bolt-nodejs"
}
