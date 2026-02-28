variable "name" { type = string }
variable "origin_domain_name" { type = string }
variable "aliases" { type = list(string) default = [] }
