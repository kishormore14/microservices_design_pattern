resource "aws_backup_vault" "this" {
  name = "${var.name}-vault"
}

resource "aws_backup_plan" "this" {
  name = "${var.name}-plan"
  rule {
    rule_name         = "daily-rds"
    target_vault_name = aws_backup_vault.this.name
    schedule          = "cron(0 5 * * ? *)"
    lifecycle {
      delete_after = 35
    }
  }
}

resource "aws_backup_selection" "rds" {
  name         = "${var.name}-rds-selection"
  iam_role_arn = "arn:aws:iam::123456789012:role/${var.name}-backup-role"
  plan_id      = aws_backup_plan.this.id
  resources    = [var.rds_arn]
}

resource "aws_s3_bucket_lifecycle_configuration" "backup" {
  bucket = replace(var.backup_bucket_arn, "arn:aws:s3:::", "")
  rule {
    id     = "backup-lifecycle"
    status = "Enabled"
    expiration {
      days = 90
    }
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}
