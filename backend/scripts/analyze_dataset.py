import pandas as pd
import os

train_path = r"d:\Ujjwal\College\Major Project\MoodMate\DataSet Model Training\trainr.csv"
val_path = r"d:\Ujjwal\College\Major Project\MoodMate\DataSet Model Training\validationr.csv"
test_path = r"d:\Ujjwal\College\Major Project\MoodMate\DataSet Model Training\testr.csv"

def get_info(path, name):
    df = pd.read_csv(path)
    print(f"--- {name} ---")
    print(f"Total Rows: {len(df)}")
    print(f"Label Distribution:\n{df['label'].value_counts()}")
    print("-" * 20)

get_info(train_path, "Train")
get_info(val_path, "Validation")
get_info(test_path, "Test")
