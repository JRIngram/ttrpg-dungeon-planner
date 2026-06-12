# Contributing

Thank for you taking an interest in contributing to this repository, your interest is greatly appreciated.

Please read the [README.md](./README.md) before continuing with this document. This include information on the tech stack and how to get the system up and running. For the licence, please see [LICENCE.md](./LICENCE.md).

Contributions come in many forms and we are happy for contributions. We are happy for documentation updates, bug reports and fixes, feature suggestions and implementation, UX/UI improvements and more. The main starting point for contributing is likely to be either via raising an issue or via commenting on an issue.

The best way to get assistance is via creating an issue, and we - or a member of the community - will get back to you.

## Issues

If you are coming to raise an issue then please first check if the issue already exists. If not then feel free to [raise an issue on GitHub](https://github.com/JRIngram/ttrpg-dungeon-planner/issues) and ensure you follow the issue templates provided.

## AI Usage

This project is not against AI being used for development or contributions; we are however against AI slop being produced.

The guidance for this is clear: you are responsible for the code you are contributing to this project. Whether or not an LLM is producing the contribution, you must understand the contribution and it must follow the constraints set out in this project guidelines.

## Review Process

The review process of a PR - or any other contribution is as follows.

First, either raise a PR or comment on the relevant issue with the contribution (if the contribution is not a code change).

Please ensure that the PR template is filled out; if it is not then the PR will be rejected.

@JIngram will then review the PR and provide feedback. We cannot provide timeframes for this, but know that we will look at it as soon as we are able. A PR is deemed ready for review when the PR template is filled out and all of the CI/CD checks are passing.

Stale PRs will firstly recieve a chaser comment, requesting an update - either a merge, a code update or a timeframe for merging. If no response is recieved then the PR will be rejected. We cannot provide specific timeframes for this, but it should be expected that your PR will be rejected if it has had no activity for a year.

Maintaining this project is voluntary work as is contributing; everyone in this process should be treated with respect. We are always happy for both an interest in this project and for contributions. Please see the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for more information.

## Development Guidelines

### Project Structure

The project is pslit into four parts, currently:

- Client: Next.js frontend.
- Server: DjangoREST backend.
- Wizards: Python scripts for interacting with the Server.
- DB: env files used for setting up the PostgreSQL database.

### Code Style

Coding style is enforce by `pylint`, `prettier` and `eslint`.

If you believe that the code style enforcement tools are wrongly enforcing a rule and you require it to be ignored then ignore it for the next line or the most limited lines of code as possible and add some documentation outlining why this ignoring of the rules is required in this case.

### Commit Style

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep the commit history readable and to enable automated changelog generation and version bumping by using [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version).

We enforce this by using `commitlint`.

A utility exists for building semantic commits called `commitizen` which can be ran from the root of the project using `npm run commit`.

This formats the commits like an semantic commit, which has the following structure:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

| Part        | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| **type**    | What kind of change this is (see below)                                      |
| **scope**   | The area of the codebase affected, in parentheses (optional but encouraged)  |
| **summary** | A brief description in the present tense, lowercase, no full stop at the end |
| **body**    | Explain _why_ the change was made, not just _what_ changed                   |
| **footer**  | Used for breaking change notices or linking issues (e.g. `Closes #42`)       |

The types of commits available are as follows:

| Type       | When to use                                                         |
| ---------- | ------------------------------------------------------------------- |
| `feat`     | A new feature                                                       |
| `fix`      | A bug fix                                                           |
| `docs`     | Documentation changes only                                          |
| `style`    | Formatting, whitespace, missing semicolons — no logic changes       |
| `refactor` | Code restructuring that neither fixes a bug nor adds a feature      |
| `perf`     | A change that improves performance                                  |
| `test`     | Adding or updating tests                                            |
| `build`    | Changes to the build system or external dependencies                |
| `ci`       | Changes to CI/CD configuration and scripts                          |
| `chore`    | Routine tasks, tooling, or config that don't affect production code |
| `revert`   | Reverts a previous commit                                           |

#### Examples

**Simple features:**

```
feat(dungeon): add dungeon summary component
```

**With a body:**

```
feat(markdown-export): add markdown export endpoint and return summary

allow the user to export the created dungeons to a markdown file which can
then be used in external tools for editing

Closes #43
```

**Breaking change:**

```
feat(server)!: move server from flask to Django

BREAKING CHANGE: Flask has been replaced with Django on the server.
Update all dependencies.
```

### Tests

#### Server

##### Bruno

Bruno is being used as a tool to test our HTTP end points. The bruno collection can be seen at `TTRPG-Planner-Bruno`.

##### Linter

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

##### Unit tests

To run unit tests against the server, run the following command: `python manage.py test`

Note that this will create a test database that will be torn down at the end of the test run. This creates and destroys test tables in the database defined in your .env files. This means that when running locally the env file should have the host as `localhost` and when running in a container the host name should be the container that runs the database, e.g. `dungeon-planner-db`. The credentials to log into the database should also be those used to log in to the database on the host.

#### Client

Unit tests:

```
cd client/
npm run test
```

### Database Migrations

If you want to create additional database migrations within the server, perform the following actions.

Firstly, you will want to update the models within the django application. [See the documentation here](https://docs.djangoproject.com/en/5.2/topics/db/models/).

Once the models have been updated, create the migrations. [See the documentation here](https://docs.djangoproject.com/en/5.2/ref/django-admin/#django-admin-makemigrations). Ultimately the command you will want to run is: `python3 manage.py makemigrations dungeonPlanner -n <MIGRATION_NAME>`

Finally, run the new migrations: `python3 manage.py migrate`
