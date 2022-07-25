# test-app

First you have to create a `.env` file in the root directory of this project. Add environment-specific variables on new
lines in the form of `NAME=VALUE`. For example:

```dosini
SERVER_PORT=8000
DATABASE_PASSWORD=admin
DATABASE_USERNAME=admin
DATABASE_PORT=5432
DATABASE_NAME=db
DATABASE_TYPE=postgres
DATABASE_HOST=db-postgres // It's variable depends of db container name. If db container name db-postgres, you have to use this name for host db in the project
```

Second you can start project with commands `docker compose build` and `docker compose up`.

And finally go to url `localhost:8000/swagger/`.
