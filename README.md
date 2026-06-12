# ttrpg-dungeon-planner

Tabletop role-playing game (TTRPG) Dungeon Planner is an open source tool for creating and planning dungeons for TTRPG games.

Whilst it was created for personal usage, it has been open sourced to allow others to use and contribute to. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute.

The core focus of the TTRPG dungeon planner is the creation of dungeons, rooms within them and the denizens and traps that lurk within the dungeon.

This README will walk you through the set-up and usage of the TTRPG Dungeon Planner.

The tech stack this project uses is as follows:

- Client: TypeScript & React & Next.js
- Server: Python 3 & Django
- Database: PostgreSQL
- Containerisation: Docker

Please check the `package.json` files and `requirements.txt` files for specific versioning numbers.

TTRPG Dungeon Planner was created and is maintained by J Ingram. See [LICENSE.md](./LICENCE.md) for details on permitted usage.

This project uses [semantic versioning](https://semver.org/). Our Changelog is generated from [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Ensure that when PRs are squashed and merged that they follow the conventional format. The changelog can be viewed at [CHANGELOG.md](./CHANGELOG.md).

## Set-up

- Set up a PostgreSQL database. This can be done manually or by running `docker compose up --build`. When running in Docker create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your PostgreSQL instance. Likewise, ensure a `.env` file is present in `db/`.
- Create a `.env` file in `server/`. Copy the fields from `.env.example` and fill out the variables for your PostgreSQL instance. This will allow the server to connect to the database. **Note:** When running in docker, the host should be the name of the container, i.e. dungeon-planner-db.
- Ensure a `.env` file is present in `db/`. Copy the fields from `.env.example` and fill out the variables for your PostgreSQL instance.
- Create a `.env.local` file in `client/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the client to the server.
- Create a `.env` file in `wizards/`. Copy the fields from `.env.example` and fill out the variables to allow for a connection from the scripts to the server.
- Before contributing, ensure you have run `npm i` at the root so that husky hooks, commitizen (if using) and commitlint can run.

**Note:** `docker compose up --build` is the recommended method of running this application. Below details methods without the usage of docker.

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

## Usage

Once the application is up and running, most of the usage can be handled via the web user-interface. However, at the time of writing two features must be handled via terminal "wizards". These are "[encounter multipliers](#encounter-multipliers)" and "[encounter ratings](#encounter-ratings)", see "[wizards](#wizards)" section below.

When first opening the application you will want to create traps and monsters on the respective pages. Each of these pages is a simple form which walks the user through the creation of one or more traps / monsters.

Once this has been completed, you will then likely want to navigate to the "Dungeons" page. This page consists of two parts: Dungeons and Rooms.

To get to the "Room" section, you will first need to create a dungeon using the form. Once a dungeon has been created, you can then navigate to the "Rooms" tab within the Dungeon. This is also a form that will allow a user to create one or more rooms inside a dungeon. Each room will be given a rating of either `trivial`, `easy`, `medium`, `hard` or `extreme`. These ratings are based on the two aforementioned "encounter multipliers" and "encounter ratings".

Created dungeons can be exported into two formats: markdown and JSON.

### Wizards

Two operations cannot currently be performed via the web user-interface: the creation of "encounter ratings" and "encounter multipliers". Instead, these are performed via command-line wizards. Both wizards are accessed via a single command-line script. To run these wizards perform the follow actions:

1. Navigate to the `wizards/` directory.
2. Create a .venv folder: On macOS / Linux: `python3 -m venv .venv`; on Windows: `py -3 -m venv .venv`
3. Run `.venv/bin/activate` (note: you may need to run `chmod u+x .venv/bin/activate` if you are getting a permissions denied error).
4. Run `pip install -r requirements.txt`
5. Run `python3 config_wizards/main.py`

#### Encounter Multipliers

Encounter multipliers multiply the total xp of an encounter based off of how many monsters are present in an encounter. This allows for the scaling of encounters based on the number of enemies and therefore the number of actions enemy combatants have versus the number of actions player characters (PCs) have.

Encounter multipliers account for the tactical complexity of fighting multiple enemies at once.

#### Encounter Ratings

An encounter's difficulty rating is determined by six factors:

- The minimum, maximum, and average expected level of the player characters (PCs).
- The expected number of PCs in the party.
- The number of monsters in the encounter.
- The encounter multiplier, which accounts for the tactical complexity of fighting multiple enemies at once.

There are five possible difficulty tiers: `trivial`, `easy`, `medium`, `hard`, and `extreme`.

The rating represents how challenging a given encounter would feel to a party of a certain level; in other words: "a party of level L would find an encounter worth X adjusted XP to be `difficulty`".

The calculation works as follows:

1. Compute the adjusted XP by applying the encounter multiplier to the raw monster XP total.
2. Divide the adjusted XP by the expected number of PCs to get the per-character XP burden.
3. Compare that value against the XP thresholds for each difficulty tier, which are determined by the party's level.

The setup wizard guides the user through configuring these thresholds. For each player level, it walks the user through the XP cutoffs that correspond to each of the five rating tiers, so the system can accurately classify any encounter your party might face.

## API Endpoints

Please see the [Bruno collection files](https://github.com/JRIngram/ttrpg-dungeon-planner/tree/main/TTRPG-Planner-Bruno) for a non-exhaustive list of the API endpoints.
