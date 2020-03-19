"""
Fetch exercises from wger.de
"""

import json
from os import path
from sys import exit
from tqdm import tqdm

import requests

try:
    import langdetect

    USE_LANGDETECT = True
except ModuleNotFoundError:
    if (
        "n"
        in input(
            "Couldn't load langdetect module. Continue without language detection? [Y/n] "
        ).lower()
    ):
        exit()
    USE_LANGDETECT = False

ENGLISH_LANGUAGE = 2  # language id for English
OUT_FILE_NAME = "wger_exercises.json"


def fetch_exercises_json() -> dict:
    response = requests.get(
        "https://wger.de/api/v2/exerciseinfo/?format=json&limit=1000"
    )
    if response.status_code != 200:
        print(
            "Server returned status %s while fetching exercises"
            % (response.status_code)
        )
        exit()
    return response.json()["results"]


def format_exercises(exercises: dict) -> dict:
    formatted = []
    for e in tqdm(exercises):
        if "name" not in e or len(e["name"]) == 0:
            continue
        if "language" in e:
            if e["language"] != ENGLISH_LANGUAGE:
                continue
        elif USE_LANGDETECT:
            try:
                if langdetect.detect(e["description"]) != "en":
                    continue
            except langdetect.lang_detect_exception.LangDetectException:
                pass
        formatted.append(
            {
                "name": e["name"],
                "category": e["category"]["name"],
                "description": e["description"],
                "muscles": [m["name"] for m in e["muscles"] + e["muscles_secondary"]],
                "equipment": [eq["name"] for eq in e["equipment"]],
            }
        )
    return formatted


def save_exercises() -> None:
    if path.exists(OUT_FILE_NAME):
        overwrite = input("%s already exists, overwrite? [y/N] " % (OUT_FILE_NAME))
        if "y" not in overwrite.lower():
            return
    print("Downloading exercises...")
    exercises = format_exercises(fetch_exercises_json())
    with open(OUT_FILE_NAME, "w") as file:
        json.dump(exercises, file, indent=4)
    print("\nSaved as %s" % (OUT_FILE_NAME))


if __name__ == "__main__":
    save_exercises()
