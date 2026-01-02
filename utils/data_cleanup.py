import pypdf
from enchant.checker import SpellChecker
import re
import pandas as pd

DATASET_DIR = "data/datasets/"
PDF_FILE='data/raw/offences_and_penalties_in_general_2018.pdf'

reader = pypdf.PdfReader(PDF_FILE)

english_spell_check = SpellChecker("en_GB")

def validate_english_phrase(phrase:str)-> bool:
    """
    Validates whether the given phrase is in correct English, using a spell checker. and Logs the phrase to a file if it contains an unknown word (other than ones containing 'rwanda').
    
    :params phrase: The text (type: str) to check validate.
    :returns True if the phrase passes the check, otherwise returns False.
    """
    english_spell_check.set_text(phrase)
    for err in english_spell_check:
        if err.word and "rwanda" not in err.word:
            with open("logs/log.txt", "a", encoding='utf-8') as log_file:
                log_file.write(phrase + "\n")
            return False
    return True

def build_dataset_dict(
        gazette: str, 
        part: str, 
        title: str, 
        chapter: str,
        section: str, 
        sub_section: str, 
        article_text_list: list
    )-> dict:
    """
    Builds the necessary dict to use for the dataset.

    :params gazette: The gazette title (type: str).
    :params part: The part that law article belongs in (type: str).
    :params title: The title that law article belongs in (type: str).
    :params chapter: The chapter that law article belongs in (type: str).
    :params section: The section that law article belongs in (type: str).
    :params sub_section: The sub section that law article belongs in (type: str).
    :params article_text_list: The section title (type: list).
    :returns: dict required.
    """
    return {
        "instruction": f"Explain the law article, as mentioned in the Rwandan {gazette}",
        "input": f"How is the {article_text_list[0]} of {part}, {title}, {chapter} {section} {sub_section} explained?",
        "output": f"{''.join(article_text_list)}"
    }

def build_article_dataset() -> list:
    """
    Builds the dataset.

    :returns: a list of all dicts we want in the dictionary
    """
    result = article_text = []
    part_title = chapter_title = title_title = section_title = sub_section_title = gazette_title = law_text = law_date = ""

    page_one_text = reader.pages[0].extract_text()
    page_one_split_text = page_one_text.split("\n")
    
    for text in page_one_split_text:
        if text.lower().startswith("official gazette no"):
            gazette_title = text.strip().capitalize()
        elif text.lower().startswith("law determining"):
            law_text = text.strip().capitalize()
        elif re.search(r"of \d{2}/\d{2}/\d{4}", text.lower().strip()):
            law_date += text.strip()
    
    metadata = {
        "instruction": f"Explain the Law {law_date} as mentioned in the Rwandan {gazette_title}",
        "input": f"What is the summary about this Law {law_date}?",
        "output": f"{law_date}, is a {law_text.lower()}"
    }
    result.append(metadata)
    for page in reader.pages[44:]:
        page_text = page.extract_text()
        split_text = page_text.split("\n \n")
        for text in split_text:
            temp = text.strip().split("\n")
            valid_english_statements = []
            for text in temp:
                if (
                    not validate_english_phrase(text)
                    or text.lower().startswith("official gazette no")
                    or text.strip().isdigit()
                ):
                    continue
                valid_english_statements.append(text)
            if not valid_english_statements or not valid_english_statements[0]:
                continue
            text_phrase = ''.join(valid_english_statements)
            if text_phrase.lower().startswith('part'):
                part_title = text_phrase.capitalize()
                continue
            elif text_phrase.lower().startswith('title'):
                title_title = text_phrase.capitalize()
                continue
            elif text_phrase.lower().startswith('chapter'):
                chapter_title = text_phrase.capitalize()
                continue
            elif text_phrase.lower().startswith('section'):
                section_title = text_phrase.capitalize()
                sub_section_title = ""
                continue
            elif text_phrase.lower().startswith('subsection'):
                sub_section_title = text_phrase.capitalize()
                continue
            if text_phrase.lower().startswith('article'):
                if text_phrase in article_text:
                    continue
                if len(article_text) > 1:
                    result.append(build_dataset_dict(gazette_title, part_title, title_title, chapter_title,section_title, sub_section_title, article_text))
                article_text = []
            article_text.append(text_phrase)
    return result

if __name__=="__main__":
    result = build_article_dataset()
    df = pd.DataFrame(result)
    df.to_csv(f'{DATASET_DIR}/law_dataset.csv', index=False)
