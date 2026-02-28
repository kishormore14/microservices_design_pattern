bucket         = "hrms-terraform-state"
key            = "platform/dev/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "hrms-terraform-locks"
encrypt        = true
