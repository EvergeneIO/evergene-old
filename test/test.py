import requests
r = requests.get('https://evergene.io/api/hug')
result = r.json()
print(result)