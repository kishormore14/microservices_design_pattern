locals {
  env  = terraform.workspace
  name = "${var.project}-${local.env}"
}

module "vpc" {
  source               = "../../modules/vpc"
  name                 = local.name
  cidr                 = var.vpc_cidr
  availability_zones   = ["us-east-1a", "us-east-1b"]
  private_subnet_cidrs = ["10.60.1.0/24", "10.60.2.0/24"]
  public_subnet_cidrs  = ["10.60.101.0/24", "10.60.102.0/24"]
}

module "k8s_cluster" {
  source             = "../../modules/k8s-cluster"
  name               = local.name
  provider_type      = var.cluster_provider
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  kubernetes_version = "1.31"
}

module "load_balancer" {
  source            = "../../modules/load-balancer"
  name              = local.name
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "postgres" {
  source                 = "../../modules/postgres"
  name                   = local.name
  subnet_ids             = module.vpc.private_subnet_ids
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  instance_class         = "db.t4g.micro"
  allocated_storage      = 20
}

module "redis" {
  source             = "../../modules/redis"
  name               = local.name
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.vpc.default_security_group_id]
  node_type          = "cache.t4g.micro"
}

module "object_storage" {
  source      = "../../modules/object-storage"
  bucket_name = "${local.name}-artifacts"
}

module "cdn" {
  source             = "../../modules/cdn"
  name               = local.name
  origin_domain_name = module.load_balancer.alb_dns_name
  aliases            = var.cdn_aliases
}

module "backup_dr" {
  source            = "../../modules/backup-dr"
  name              = local.name
  rds_arn           = module.postgres.arn
  backup_bucket_arn = module.object_storage.bucket_arn
}
