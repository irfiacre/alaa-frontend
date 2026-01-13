import modal

LawDeepSeekModel = modal.Cls.from_name("law-deepseek-r1", "LawDeepSeekModel")

model = LawDeepSeekModel()
result = model.generate.remote("Explain to me article 170?")
print(result)
