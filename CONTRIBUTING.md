## Tests

### Server

#### Bruno

Bruno is being used as a tool to test our HTTP end points. The bruno collection can be seen at `TTRPG-Planner-Bruno`.

#### Linter

To run the linter for the server run the following:

```bash
cd server # if not already in the server directory
pylint --rcfile=pylintrc . --recursive=true --load-plugins pylint_django dungeonPlanner
```

To run autopep8, to automatically fix formatting issues on the server, run:

```bash
cd server # if not already in the server directory
autopep8 --in-place --aggressive --recursive --max-line-length 100 dungeonPlanner ttrpgPlanner
```

#### Unit tests

To run unit tests against the server, run the following command: `python manage.py test`

Note that this will create a test database that will be torn down at the end of the test run. This creates and destroys test tables in the database defined in your .env files. This means that when running locally the env file should have the host as `localhost` and when running in a container the host name should be the container that runs the database, e.g. `dungeon-planner-db`. The credentials to log into the database should also be those used to log in to the database on the host.

### Client

Unit tests:

```
cd client/
npm run test
```

## Database Migrations

If you want to create additional database migrations within the server, perform the following actions.

Firstly, you will want to update the models within the django application. [See the documentation here](https://docs.djangoproject.com/en/5.2/topics/db/models/).

Once the models have been updated, create the migrations. [See the documentation here](https://docs.djangoproject.com/en/5.2/ref/django-admin/#django-admin-makemigrations). Ultimately the command you will want to run is: `python3 manage.py makemigrations dungeonPlanner -n <MIGRATION_NAME>`

Finally, run the new migrations: `python3 manage.py migrate`
