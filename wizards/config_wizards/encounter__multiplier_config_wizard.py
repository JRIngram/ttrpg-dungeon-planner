import questionary
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

def create_entry_row():
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

def main():
    intro()
    questionary.press_any_key_to_continue().ask()
    config_row = create_entry_row()
    print(config_row)