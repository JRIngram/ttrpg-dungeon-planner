import questionary
import requests
from dotenv import load_dotenv
import os
from string import Template
from validators import mandatory_numerical_validator, numerical_validator

load_dotenv()

SERVER_HOST = os.getenv('SERVER_HOST')
SERVER_PORT = os.getenv('SERVER_PORT')
URL = f"http://{SERVER_HOST}:{SERVER_PORT}/dungeonPlanner/encounterMultiplierConfigRow"

def intro() -> None:
    """
    Outputs the introduction rubric
    """
    print("###########################")
    print("# Encounter Config Wizard #")
    print("###########################")
    print("\f")
    print("This is a utility for creating configurations for encounter multipliers - where having multiple enemies in an encounter causes the total xp to be multiplied to account for there being more monsters and thus more turns.")
    print("You will be prompted to enter a min, max and multiplier. Each entry is as a row for the overall config.");
    print("Min and max refer to the number of enemies that apply for that config.")
    print("For example, { min: 2, max: 4, multiplier: 2}, means that if there are 2 - 4 monsters (inclusive) in an encounter, then the overall xp for that encounter will be multiplied by 2.")
    print("Prompting will continue until you create an entry with no max value. Once this has happened, the previously entered config will be wiped and replaced with the new config.")
    print("Please enter only numerical values.")

def create_entry_row() -> dict[str, int | None]:
    multiplier = questionary.text("What is the multiplier for this row?", validate=mandatory_numerical_validator).ask()
    min = questionary.text("What is the minimum monster count for this multiplier?", validate=mandatory_numerical_validator).ask()
    max = handle_max()
    config_row = {"min": int(min), "max": int(max) if max is not "" else None, "multiplier": float(multiplier)}
    return config_row

def handle_max() -> str:
    """
    Handles the loop logic for entering max values
    """
    exit_confirm = "No"
    max = ""
    while exit_confirm == "No" and max == "":
        max = questionary.text("What is the maximum monster count for this multiplier? (Leave blank for final entry)", validate=numerical_validator).ask()
        if max == "":
            exit_confirm = confirm_empty_max()
    return max

def confirm_empty_max() -> str:
    """
    Creates a toggle to confirm that the empty max value is intentional
    """
    exit_confirm = questionary.select(
        "You have entered nothing for max. This will be the final row you enter. Is this correct?",
        choices=["Yes", "No"]
    ).ask()

    return exit_confirm

def build_config():
    """
    Builds a list of config rows, built from entry rows
    """
    exit_config_builder = False
    config_rows = []
    while exit_config_builder is False:
        print(f"\n## ROW {len(config_rows) + 1} ##")
        config_row = create_entry_row()
        config_rows.append(config_row)
        row_max = config_row.get("max")
        if not row_max:
            exit_config_builder = True;
    return config_rows

def confirm_deletion() -> bool:
    selected_wizard = questionary.select(
        "Continuing will delete existing Encounter Multiplier Configs. Are you happy to confinue?",
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
    print(URL)
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

def config_has_conflicts(config_rows: list[dict[str, int]]) -> bool:
    """
    Detects conflicts in config rows and returns True if conflicts are present.

    A conflict is defined as two rows affecting the same number of monsters.

    e.g. Say we had two rows: 
        - { min: 1, max: 5, multiplier: 5}
        - { min: 2, max: 3, multiplier: 2}
    This would class as a confllict, as a monster count of 2 and 3 are affected by two different multipliers.

    The following would result in no conflicts:
        - { min: 1, max: 1, multiplier: 5}
        - { min: 2, max: 3, multiplier: 2}
        - { min: 4, max: 5, multiplier: 5}
    """
    def sort_by_min(row):
        return row["min"]
    config_rows.sort(key=sort_by_min)
    
    conflict_list = []
    largest_max_index = None
    largest_max = None

    for idx, row in enumerate(config_rows):
        if idx != 0:
            if row["min"] <= largest_max:
                conflict_list.append([config_rows[idx], config_rows[largest_max_index]])

            if row["max"] is not None and row["max"] > largest_max:
                largest_max = row["max"]
                largest_max_index = idx
        else:
            largest_max = row["max"]
            largest_max_index = idx
    
    conflicts_present = len(conflict_list) > 0
    if conflicts_present:
        print("The following conflicts are present")
        for conflict in conflict_list:
            def format_conflict(conflict):
                return f"{conflict["min"]} -> {conflict["max"]}"
            print(format_conflict(conflict[0]), " conflicts with ", format_conflict(conflict[1]))
    return conflicts_present

def main():
    intro()
    questionary.press_any_key_to_continue().ask()
    encounter_multiplier_config_rows = build_config()
    confirmed_deletion = confirm_deletion()
    if  config_has_conflicts(encounter_multiplier_config_rows) == False:
        if confirmed_deletion is True:
            existing_config_rows = get_existing_configs()
            delete_existing_config_rows(existing_config_rows)
            post_config(encounter_multiplier_config_rows)
        else:
            print("Config update cancelled")
    else:
        print("Aborting config update due to conflicts.")
