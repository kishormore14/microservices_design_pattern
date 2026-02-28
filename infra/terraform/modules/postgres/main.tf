resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "this" {
  identifier             = "${var.name}-postgres"
  engine                 = "postgres"
  engine_version         = "16.4"
  instance_class         = var.instance_class
  allocated_storage      = var.allocated_storage
  username               = "hrms"
  manage_master_user_password = true
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = var.vpc_security_group_ids
  storage_encrypted      = true
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.name}-postgres-final"
}
