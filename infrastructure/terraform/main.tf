# Configuração do Provedor de Nuvem (Exemplo AWS)
provider "aws" {
  region = "us-east-1"
}

# Declaração de um servidor virtual (Instância EC2) via Código
resource "aws_instance" "servidor_feirinha" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "Servidor-Feirinha-Shop-Prod"
  }
}