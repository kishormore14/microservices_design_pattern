variable "name" { type = string }
variable "provider_type" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "kubernetes_version" { type = string }
