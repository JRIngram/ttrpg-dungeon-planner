# dnd5e-dungeon-planner

An application for planning dungeons in Dungeons & Dragons 5e.

Tech Stack:

- Database: PostgreSQL
- Server: Python + Flask

## Set-up

- Set up a postgreSQL database
- Create a .env file in `server/`. Copy the fields from `.env.example` and fill out the variables for your postgreSQL instance. This will allow the server to connect to the database.

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

## Tests

### Server

```bash
cd ./server/flaskr/
pytest
```

### Client

Unit tests:

```
cd client/
npm run test
```
