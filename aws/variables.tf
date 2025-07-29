variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "region" {
  type = string
}

variable "access_key" {
  type = string
  sensitive = true
}

variable "secret_key" {
  type = string
  sensitive = true
}

variable "bucket_name_app" {
  type = string
}

variable "key_pair_name" {
  type = string
}

/* variable "auth_zip_path" {
  description = "Ruta al archivo ZIP del microservicio de autenticación"
  type        = string
}

variable "orders_zip_path" {
  description = "Ruta al archivo ZIP del microservicio de órdenes"
  type        = string
} */
