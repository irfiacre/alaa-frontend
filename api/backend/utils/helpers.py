import pandas as pd

STATEMENT_PATH = 'data/bank_statement.csv'

def count_track(file_path:str , count:int = None):
    """
    Method to keep track of the length of the records
    """
    if count:
        with open(file_path, 'w') as f:
            f.write(str(count))
        return None
    with open(file_path, 'r') as f:
        content = f.read().strip()
        return int(content)
    
def to_camel_case(text):
    arr = text.split(" ")
    txt1 = arr[0].lower()
    txt2= arr[-1].capitalize()
    
    return txt1 if txt2.lower() == txt1 else f'{txt1}{txt2}'

def format_statement_data():
    df = pd.read_csv(STATEMENT_PATH)
    df = df.where(pd.notna(df), None)
    df.columns = [to_camel_case(col) for col in df.columns]
    
    return df.to_dict(orient='records')
