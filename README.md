# dnd5e-dungeon-planner

An application for planning dungeons in Dungeons & Dragons 5e.

Tech Stack:

- Database: PostgreSQL
- Server: Python + Flask

## Set-up

- Set up a postgreSQL database. This can be done manually or by running `docker compose up -d`. When running in Docker create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance.
- Create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance. This will allow the server to connect to the database. **Note:** When running in docker, the host should be the name of the container, i.e. dungeon-planner-db.
- Create a `.env.local` file in `client/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the client to the server.

### Server

#### .venv

Create a .venv folder:

- On macOS / Linux: `python3 -m venv .venv`
- On Windows: `py -3 -m venv .venv`

Activate the environment:

- On macOS / Linux: `. .venv/bin/activate`
- On Windows: `.venv\Scripts\activate`

Install dependencies from requirements.txt:

- `pip install -r requirements.txt`

## Running

### Server

```bash
cd ./server/flaskr/
flask run
```

To run the linter, run from server:
`pylint --rcfile=pylintrc . --recursive=true`

### Client
1. Run `npm run tailwind:build`
2. Run `npm run dev` for a non-production build and `NEXT_DEBUG=true npm run build && npm run start` for a production build.

## Tests

### Server

```bash
cd ./server/flaskr/
pytest
```

#### Bruno
Bruno is being used as a tool to test our HTTP end points. The bruno collection can be seen at `TTRPG-Planner-Bruno`.

### Client

Unit tests:

```
cd client/
npm run test
```
