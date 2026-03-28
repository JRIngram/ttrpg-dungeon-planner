import re

def numerical_validator(answer: str):
    """
    Checks that an answer contains only numerical characters
    """
    if re.search("^[0-9.]*$", answer) is None:
        return "Please enter numerical values only."
    return True

def mandatory_numerical_validator(answer: str):
    """
    Checks that an answer contains only numerical characters and is not an empty string
    """
    if(len(answer) == 0):
            return "This answer is mandatory"
    return numerical_validator(answer)