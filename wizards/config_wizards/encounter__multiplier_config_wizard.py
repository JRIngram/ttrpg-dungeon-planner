import questionary
import requests
from validators import mandatory_numerical_validator, numerical_validator

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
    config_row = {"min": min, "max": max, "multiplier": multiplier}
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
        print("\n## ROW ", len(config_rows) + 1, " ##")
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

        
# TODO - DO IT PROPERLY
url = 'http://localhost:8000/dungeonPlanner/encounterMultiplierConfigRow'

def handle_response_status_code(response: requests.Response):
    """
    Throws an error if status code is 4xx or 5xx
    """
    if response.ok == False:
        print("Throwing", response.status_code,  " error for ", response.url)
        response.raise_for_status()

def get_existing_configs():
    get_response = requests.get(url=url)
    handle_response_status_code(get_response)

    response_json = get_response.json()
    return response_json

def delete_existing_config_rows(existing_config_rows: list[dict[str, int]]):
    print("Deleting existing config...")
    for row in existing_config_rows:
        url_with_delete_id = str(url) + "/" + str(row.get("id"))
        delete_response = requests.delete(url=url_with_delete_id)
        handle_response_status_code(delete_response)

    print("Existing config deleted!")



def post_config(config_row: list[dict[str, int]]):
    print("Uploading config...")
    for row in config_row:
        payload = row
        post_response = requests.post(url=url, data=payload)
        handle_response_status_code(post_response)
    print("Config uploaded!")

def main():
    intro()
    questionary.press_any_key_to_continue().ask()
    encounter_multiplier_config_rows = build_config()
    # TODO ADD VALIDATION
    # i.e. ensure that there are no row conflicts
    confirmed_deletion = confirm_deletion()
    if confirmed_deletion is True:
        existing_config_rows = get_existing_configs()
        delete_existing_config_rows(existing_config_rows)
        post_config(encounter_multiplier_config_rows)
    else:
        print("Config update cancelled")
