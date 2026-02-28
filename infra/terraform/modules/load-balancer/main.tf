resource "aws_lb" "alb" {
  name               = "${var.name}-alb"
  load_balancer_type = "application"
  internal           = var.internal
  subnets            = var.public_subnet_ids
}

resource "aws_lb" "nlb" {
  name               = "${var.name}-nlb"
  load_balancer_type = "network"
  internal           = var.internal
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "http_tg" {
  name     = "${var.name}-http"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check {
    path = "/healthz"
  }
}

resource "aws_lb_listener" "alb_https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = "arn:aws:acm:us-east-1:123456789012:certificate/replace-me"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.http_tg.arn
  }
}
