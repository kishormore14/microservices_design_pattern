variable "project" {
  type        = string
  description = "Project slug"
  default     = "hrms"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "cluster_provider" {
  description = "Managed K8s provider selector: eks | gke | aks"
  type        = string
  default     = "eks"
}

variable "vpc_cidr" {
  type    = string
  default = "10.60.0.0/16"
}

variable "cdn_aliases" {
  type    = list(string)
  default = ["app.dev.hrms.internal"]
}
