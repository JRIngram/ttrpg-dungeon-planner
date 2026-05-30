# ttrpg-dungeon-planner

An application for planning dungeons in TTRPGs.

Tech Stack:

- Client: Next.js
- Server: Python + Django
- Database: PostgreSQL

## Set-up

- Set up a postgreSQL database. This can be done manually or by running `docker compose up -d`. When running in Docker create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance.
- Create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance. This will allow the server to connect to the database. **Note:** When running in docker, the host should be the name of the container, i.e. dungeon-planner-db.
- Create a `.env.local` file in `client/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the client to the server.
- Create a `.env` file in `wizards/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the scripts to the server.
- Before contributing, ensure you have run `npm i` at the root so that husky hooks can run pre-commit

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

## API Endpoints

The server provides the following main API endpoints:

### Dungeon Endpoints

- `GET /dungeon` - List all dungeons
- `POST /dungeon` - Create a new dungeon
- `GET /dungeon/<id>` - Get a specific dungeon
- `PUT /dungeon/<id>` - Update a dungeon
- `DELETE /dungeon/<id>` - Delete a dungeon
- `GET /dungeon/<id>/export/json` - Export a dungeon as JSON with all rooms, monsters, and traps

### Room Endpoints

- `GET /room` - List all rooms
- `POST /room` - Create a new room
- `GET /room/<id>` - Get a specific room
- `PUT /room/<id>` - Update a room
- `DELETE /room/<id>` - Delete a room

### Monster Endpoints

- `GET /monster` - List all monsters
- `POST /monster` - Create a new monster
- `GET /monster/<id>` - Get a specific monster
- `PUT /monster/<id>` - Update a monster
- `DELETE /monster/<id>` - Delete a monster

### Trap Endpoints

- `GET /trap` - List all traps
- `POST /trap` - Create a new trap
- `GET /trap/<id>` - Get a specific trap
- `PUT /trap/<id>` - Update a trap
- `DELETE /trap/<id>` - Delete a trap

### JSON Export Format

The `/dungeon/<id>/export/json` endpoint returns a comprehensive JSON structure:

```json
{
  "dungeon": {
    "id": 1,
    "name": "Dungeon Name",
    "summary": "Dungeon description",
    "level_min": 1,
    "level_max": 5,
    "player_count": 4
  },
  "rooms": [
    {
      "id": 1,
      "name": "Room Name",
      "description": "Room description",
      "dungeon": 1,
      "monsters": [
        {
          "id": 1,
          "name": "Goblin",
          "xp": 50,
          "quantity": 3
        }
      ],
      "traps": [
        {
          "id": 1,
          "name": "Pit Trap",
          "effect": "1d6 damage",
          "quantity": 1
        }
      ]
    }
  ]
}
```

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
