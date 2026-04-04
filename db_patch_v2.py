import sqlite3
import os

db_path = "backend/axiom_users.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    columns_to_add = ["resume_data", "linkedin_data", "github_data"]
    for col in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} JSON DEFAULT '{{}}'")
            print(f"Success: {col} column added.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Notice: {col} column already exists.")
            else:
                print(f"Error adding {col}: {e}")
    conn.commit()
    conn.close()
else:
    print("Notice: db file not found.")
