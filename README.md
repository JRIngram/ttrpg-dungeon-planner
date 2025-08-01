# dnd5e-dungeon-planner

An application for planning dungeons in TTRPGs.

Tech Stack:
- Client: Next.js
- Server: Python + Django
- Database: PostgreSQL

## Set-up

- Set up a postgreSQL database. This can be done manually or by running `docker compose up -d`. When running in Docker create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance.
- Create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance. This will allow the server to connect to the database. **Note:** When running in docker, the host should be the name of the container, i.e. dungeon-planner-db.
- Create a `.env.local` file in `client/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the client to the server.

### Server

#### .venv

Change directory to the server: `cd server/`

Create a .venv folder:
- On macOS / Linux: `python3 -m venv .venv`
- On Windows: `py -3 -m venv .venv`

Activate the environment:
- On macOS / Linux: `. .venv/bin/activate`
- On Windows: `.venv\Scripts\activate`

Install dependencies from requirements.txt:
- `pip install -r requirements.txt`

#### Migrations
If running locally, run the database migrations: `python3 manage.py migrate`.

**Note:** This happens automatically if you are running the app using docker compose.

## Running
If you are running this application using docker, simply run `docker compose up`.

### Server
```bash
cd ./server
python3 manage.py runserver
```

### Client
1. Run `npm run tailwind:build`
2. Run `npm run dev` for a non-production build and `NEXT_DEBUG=true npm run build && npm run start` for a production build.

## Tests

### Server

#### Bruno
Bruno is being used as a tool to test our HTTP end points. The bruno collection can be seen at `TTRPG-Planner-Bruno`.

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