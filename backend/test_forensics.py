import httpx
import asyncio
import json

async def test_forensics():
    url = "http://localhost:8000/api/forensic-audit"
    payload = {
        "url": "https://github.com/lucidrains/vit-pytorch"
    }
    
    print(f"Checking {url} with {payload['url']}...")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(url, json=payload)
            print(f"Status: {resp.status_code}")
            if resp.status_code == 200:
                print("Success! Response:")
                print(json.dumps(resp.json(), indent=2))
            else:
                print(f"Error ({resp.status_code}): {resp.text}")
        except Exception as e:
            print(f"Fetch failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_forensics())
