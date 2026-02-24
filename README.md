# Собрать проект

npm run build

# Запустить бота

npm run start:prod

# Или в режиме разработки

npm run dev

## Запуск с Docker

# Собрать Docker образ

docker build -t mr-helper .

# Запустить контейнер

docker run -d --name mr-helper --env-file .env mr-helper

# Или использовать docker-compose

docker-compose up -d
