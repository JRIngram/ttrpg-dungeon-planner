from encounter__multiplier_config_wizard import main

import questionary

encounter_multiplier_wizard = "Encounter Multiplier"
encounter_rating_wizard = "Encounter XP Rating"

selected_wizard = questionary.select(
    "Which config wizard would you like to run?",
    choices=[encounter_multiplier_wizard, encounter_rating_wizard]
).ask()

if selected_wizard == encounter_multiplier_wizard:
    main()
if selected_wizard == encounter_rating_wizard:
    print("Still to be built...")