# provider.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {}
 
  /* backend "s3" {
    bucket                  = "tf-awesome-backend-cargocomperu-dev"
    key                     = "terraform.tfstate"
    workspace_key_prefix    = "workspaces"
    region                  = "us-east-1"
    profile                 = "tf-awesome"
  } */
}

provider "aws" {
  region     = var.region # o tu región preferida
  access_key = var.access_key
  secret_key = var.secret_key
}