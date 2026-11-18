# Imagem base oficial do Node.js leve baseada em Alpine Linux
FROM node:18-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos de gerenciamento de dependências
COPY package.json package-lock.json ./

# Instalar as dependências de produção/projeto
RUN npm install

# Copiar todo o restante do código fonte e pastas para o contêiner
COPY . .

# Expor a porta padrão em que a aplicação Express roda
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]