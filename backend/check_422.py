import requests

url = "http://localhost:8000/api/upload-resume"
files = {'file': ('test.pdf', b'%PDF-1.4fake', 'application/pdf')}
data = {'email': 'test@example.com'}

response = requests.post(url, files=files, data=data)
print("Status Code:", response.status_code)
print("Response JSON:", response.text[:200])
