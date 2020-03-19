"""
Fetch exercises from bodybuilding.com
"""

import json
import re
from os import path
from sys import exit
from tqdm import tqdm

import requests
from lxml import html

OUT_FILE_NAME = "bbcom_exercises.json"
MAX_PAGE = 70  # There are a lot more pages than this but they all have no ratings


def fetch_exercise_names():
    print("Getting exercise list...")
    names = []
    for i in tqdm(range(1, MAX_PAGE)):
        response = requests.get(
            "https://www.bodybuilding.com/exercises/finder/%d" % (i,)
        )
        if response.status_code != 200:
            print(
                "Server returned status %s while fetching exercises page %d"
                % (response.status_code, i)
            )
            exit()
        names.extend(
            [
                s[1]
                for s in re.finditer(
                    r'"/exercises/([A-Za-z\-]*)"', str(response.content)
                )
                if s[1] != "finder" and s[1] != "search"
            ]
        )
    return names


def save_exercise_urls():
    names = [
        "https://www.bodybuilding.com/exercises/" + n + "\n"
        for n in fetch_exercise_names()
    ]
    with open("bbcom_urls.txt", "w") as file:
        file.writelines(names)


def load_exercise_urls(download: bool = True):
    if not path.exists("bbcom_urls.txt"):
        if download:
            save_exercise_urls()
        else:
            print("bbcom_urls.txt doesn't exist, can't load urls")
            return
    with open("bbcom_urls.txt", "r") as file:
        return [l.rstrip() for l in file.readlines()]


def fetch_exercise(url: str):
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to fetch exercise from %s.: %d" % (url, response.status_code))
        exit()
    page = html.fromstring(response.content)
    details = {}
    for s in [
        [i.lstrip().rstrip() for i in x.text_content().split(":")]
        for x in page.xpath('//ul[@class="bb-list--plain"]/li')
    ]:
        details[s[0]] = s[1]
    exercise = {
        "name": page.xpath("//h1/text()")[0].lstrip().rstrip(),
        "type": details.get("Type"),
        "muscle": details.get("Main Muscle Worked"),
        "equipment": details.get("Equipment"),
        "level": details.get("Level"),
        "benefits": [s.lstrip().rstrip() for s in page.xpath("//ol/li/text()")],
        "images": [
            s.lstrip().rstrip() for s in page.xpath('//img[@class="ExImg"]/@src')
        ],
    }
    try:
        exercise["description"] = (
            page.xpath('//div[@class="ExDetail-shortDescription grid-10"]/p/text()')[0]
            .lstrip()
            .rstrip()
        )
    except (IndexError, TypeError):
        exercise["description"] = None
    try:
        exercise["rating"] = float(
            page.xpath('//div[@class="ExRating-badge"]/text()')[0].lstrip().rstrip()
        )
    except (IndexError, TypeError):
        exercise["rating"] = None
    return exercise


def save_exercises() -> None:
    last_save = 0
    save_freq = 10
    exercises = []
    urls = load_exercise_urls()
    print("Getting exercises...")
    for i, url in enumerate(tqdm(urls)):
        exercises.append(fetch_exercise(url))
        if i - last_save > save_freq:
            last_save = i
            with open(OUT_FILE_NAME, "a") as file:
                json.dump(exercises, file, indent=4)

    with open(OUT_FILE_NAME, "a") as file:
        json.dump(exercises, file, indent=4)


if __name__ == "__main__":
    save_exercises()
