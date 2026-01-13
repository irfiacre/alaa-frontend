# import modal

# LawDeepSeekModel = modal.Cls.from_name("law-deepseek-r1", "LawDeepSeekModel")

# model = LawDeepSeekModel()
# result = model.generate.remote("Explain to me article 170?")
# print(result)

import requests

response = requests.post(
    "https://irfiacre-dev--law-deepseek-r1-lawdeepseekmodel-web-generate.modal.run",
    json={
        "prompt": "What is the article 152?",
    }
)

print(response.text)
