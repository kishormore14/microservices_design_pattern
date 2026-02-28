resource "aws_eks_cluster" "this" {
  count    = var.provider_type == "eks" ? 1 : 0
  name     = var.name
  role_arn = "arn:aws:iam::123456789012:role/${var.name}-eks-role"
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids = var.private_subnet_ids
  }
}

resource "aws_eks_node_group" "default" {
  count           = var.provider_type == "eks" ? 1 : 0
  cluster_name    = aws_eks_cluster.this[0].name
  node_group_name = "${var.name}-default"
  node_role_arn   = "arn:aws:iam::123456789012:role/${var.name}-eks-node-role"
  subnet_ids      = var.private_subnet_ids
  scaling_config {
    desired_size = 2
    max_size     = 5
    min_size     = 2
  }
  instance_types = ["t3.medium"]
}

locals {
  cluster_endpoint = var.provider_type == "eks" ? aws_eks_cluster.this[0].endpoint : "configure-for-${var.provider_type}"
}
