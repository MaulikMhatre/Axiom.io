from fastapi.testclient import TestClient
from main import app, DBUser, SessionLocal
from PyPDF2 import PdfWriter
import io
import json

# 1. Create a real PDF
writer = PdfWriter()
writer.add_blank_page(width=72, height=72)
pdf_io = io.BytesIO()
writer.write(pdf_io)
pdf_io.seek(0)
pdf_bytes = pdf_io.read()

client = TestClient(app)
db = SessionLocal()
test_email = "tester_audit@axiom.io"

# 2. Reset the DB user's profile data
user = db.query(DBUser).filter(DBUser.email == test_email).first()
if not user:
    db.add(DBUser(username="tester_audit", email=test_email, hashed_password="pw", profile_data={}))
    db.commit()
else:
    user.profile_data = {}
    db.commit()

print("Sending 'resume.pdf' to /api/upload-resume...")
response = client.post(
    "/api/upload-resume",
    data={"email": test_email},
    files={"file": ("resume.pdf", pdf_bytes, "application/pdf")}
)

print(f"\nStatus Code: {response.status_code}")
if response.status_code != 200:
    print("Error:", response.text)
else:
    print("\nAPI Response payload:", json.dumps(response.json(), indent=2))
    
    # 3. Check Database Persistence
    db.expire_all()
    user = db.query(DBUser).filter(DBUser.email == test_email).first()
    print("\n--- DB Persistence Check ---")
    print("DBUser.profile_data column contents:")
    print(json.dumps(user.profile_data, indent=2))
    
    if "resume" in user.profile_data:
        print("\n✅ SUCCESS: 'resume' object successfully persisted in database!")
    else:
        print("\n❌ FAILURE: 'resume' object NOT found in database.")
