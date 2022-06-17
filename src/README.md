## Books API

To build and run the api, run 'docker-compose up --build' in the project root

# Running migrations

In a new terminal, cd into src, then

npx sequelize-cli db:migrate


# Seeding the database

You can seed the Books and Authors tables with some example data, by runnning:

npx sequelize-cli db:seed:all
