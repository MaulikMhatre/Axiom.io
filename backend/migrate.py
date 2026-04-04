import sqlite3

# Path to your existing database
db_path = "./axiom_users.db"

def add_leetcode_column():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        print("Adding leetcode_data column to users table...")
        # SQLite doesn't have a specific JSON type, it uses TEXT for JSON
        cursor.execute("ALTER TABLE users ADD COLUMN leetcode_data JSON DEFAULT '{}'")
        conn.commit()
        print("Migration successful!")
    except sqlite3.OperationalError as e:
        print(f"Error: {e} (The column might already exist)")
    finally:
        conn.close()

if __name__ == "__main__":
    add_leetcode_column()