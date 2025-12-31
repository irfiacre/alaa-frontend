# Used to make a dataset that is compatible with the model "DeepSeek-R1-Distill-Qwen-7B".

"""
Approach:

0. Understand the template to pass to the model.
{
  "instruction": "...",
  "input": "....",
  "output": "...",
  "domain": "..._law",
  "language": "en"
}
Format:
{
  "instruction": "Explain in legal terms",
  "input": "On the topic <chapter title>, what does the official gazete say about <article title>",
  "output": "<information about following the title>"
}
1. Process the PDF file.
2. Finalize the dataset & Push it to hugging face.
"""

import json
from unittest import result
import pypdf
from enchant.checker import SpellChecker

reader = pypdf.PdfReader('data/raw/offences_and_penalties_in_general_2018.pdf')

english_spell_check = SpellChecker("en_GB")

def validate_english_phrase(phrase:str)-> bool:
    english_spell_check.set_text(phrase)
    for err in english_spell_check:
        if err.word:
            return False
    return True

def build_article_summary() -> list:
    """
    Returns a list of english text
    """
    part_title = ""
    chapter_title = "" 
    title_title = ""
    result = []
    for page in reader.pages[:12]:
        page_text = page.extract_text()
        split_text = page_text.split("\n \n")
        for text in split_text:
            temp = text.strip().split(":")
            if len(temp) <= 1:
                continue
            text_title = temp[0].strip().capitalize()
            text_definition = temp[1].strip().split("\n")
            text_phrase = f'{text_title}: {"".join(text_definition).capitalize()}'
            if not validate_english_phrase(text_phrase):
                continue
            if "part" in text_phrase.lower():
                part_title = text_phrase
                continue
            elif "title" in text_phrase.lower():
                title_title = text_phrase
                continue
            elif "chapter" in text_phrase.lower():
                chapter_title = text_phrase
                continue
            dataset_dict = {
                    "instruction": "Explain the summary of the law articles, as mentioned in the Rwandan Official Gazette no. Special of 27/09/2018",
                    "input": f"What is {temp[0]} of {part_title}, {title_title}, {chapter_title}?",
                    "output": f"{text_phrase}"
            }
            result.append(dataset_dict)
    return result

if __name__=="__main__":
    print(json.dumps(build_article_summary()))