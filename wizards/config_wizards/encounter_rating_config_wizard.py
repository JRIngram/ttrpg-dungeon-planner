import questionary
import requests
from dotenv import load_dotenv
import os
from string import Template
from validators import mandatory_numerical_validator, numerical_validator

load_dotenv()

SERVER_HOST = os.getenv('SERVER_HOST')
SERVER_PORT = os.getenv('SERVER_PORT')
URL = f"http://{SERVER_HOST}:{SERVER_PORT}/dungeonPlanner/encounterRatingConfigRow"

def intro() -> None:
    """
    Outputs the introduction rubric
    """
    print("###########################")
    print("# Encounter Rating Wizard #")
    print("###########################")
    print("\f")
    print("This is a utility for creating configurations for encounter ratings - which determine how difficult an encounter is based on the adjusted XP and player levels.")
    print("You will be prompted to enter a the XP thresholds for easy, medium, hard, and extreme difficulty ratings.")
    print("Each entry represents the XP thresholds for a specific player level.")
    print("Prompting will continue until you choose to exit. Once this has happened, the previously entered config will be wiped and replaced with the new config.")
    print("Please enter only numerical values.")
    print("\f")

def create_entry_row(level: int) -> dict[str, int | None]:
    easy = handle_xp_threshold("easy", True)

    if easy == "":
        return {
            "level": level,
            "easy": None,
            "medium": None,
            "hard": None,
            "extreme": None
        }
    
    medium = handle_xp_threshold("medium", False)
    hard = handle_xp_threshold("hard", False)
    extreme = handle_xp_threshold("extreme", False)
    
    config_row = {
        "level": level,
        "easy": int(easy) if easy != "" else None,
        "medium": int(medium) if medium != "" else None,
        "hard": int(hard) if hard != "" else None,
        "extreme": int(extreme) if extreme != "" else None
    }
    return config_row

def handle_xp_threshold(difficulty: str, exit_prompt: bool) -> str:
    """
    Handles the input for XP thresholds, allowing empty values
    """
    exit_prompt_str = "(Leave blank to stop adding encounter ratings)"
    validator = numerical_validator if exit_prompt == True else mandatory_numerical_validator

    return questionary.text(
        f"What is the {difficulty} XP threshold for this level? {exit_prompt_str if exit_prompt == True else ""}",
        validate=validator
    ).ask()

def build_config():
    """
    Builds a list of config rows, built from entry rows
    """
    exit_config_builder = False
    config_rows = []
    
    while exit_config_builder is False:
        level = len(config_rows) + 1
        print(f"\n## Level {level} ##")
        config_row = create_entry_row(level)
        
        # Exit if the first prompt (easy) is empty
        if config_row["easy"] is None:
            exit_config_builder = True
            print("Exiting config builder...")
        else:
            config_rows.append(config_row)
    
    return config_rows

def confirm_deletion() -> bool:
    selected_wizard = questionary.select(
        "Continuing will delete existing Encounter Rating Configs. Are you happy to continue?",
        choices=["Yes", "No"]
    ).ask()

    if selected_wizard == "Yes":
        return True
    if selected_wizard == "No":
        return False

def handle_response_status_code(response: requests.Response):
    """
    Throws an error if status code is 4xx or 5xx
    """
    if response.ok == False:
        print(f"Throwing {response.status_code} error for {response.url}")
        response.raise_for_status()

def get_existing_configs():
    get_response = requests.get(url=URL)
    handle_response_status_code(get_response)

    response_json = get_response.json()
    return response_json

def delete_existing_config_rows(existing_config_rows: list[dict[str, int]]):
    print("Deleting existing config...")
    for row in existing_config_rows:
        url_with_delete_id = str(URL) + "/" + str(row.get("id"))
        delete_response = requests.delete(url=url_with_delete_id)
        handle_response_status_code(delete_response)

    print("Existing config deleted!")


def post_config(config_rows: list[dict[str, int]]):
    print("Uploading config...")
    for row in config_rows:
        payload = row
        post_response = requests.post(url=URL, data=payload)
        handle_response_status_code(post_response)
    print("Config uploaded!")

def main():
    intro()
    questionary.press_any_key_to_continue().ask()
    encounter_rating_config_rows = build_config()
    confirmed_deletion = confirm_deletion()
    if confirmed_deletion is True:
        existing_config_rows = get_existing_configs()
        delete_existing_config_rows(existing_config_rows)
        post_config(encounter_rating_config_rows)
    else:
        print("Config update cancelled")