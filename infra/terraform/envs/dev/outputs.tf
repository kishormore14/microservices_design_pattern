output "cluster_endpoint" {
  value = module.k8s_cluster.cluster_endpoint
}

output "postgres_endpoint" {
  value = module.postgres.endpoint
}

output "redis_endpoint" {
  value = module.redis.endpoint
}

output "artifact_bucket" {
  value = module.object_storage.bucket_id
}

output "alb_dns_name" {
  value = module.load_balancer.alb_dns_name
}

output "nlb_dns_name" {
  value = module.load_balancer.nlb_dns_name
}

output "cloudfront_domain" {
  value = module.cdn.distribution_domain_name
}

output "backup_vault" {
  value = module.backup_dr.backup_vault_name
}
