import os
from groq import AsyncGroq

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """Tu es un assistant IA expert en production d engrais pour OCP Group Maroc.
Tu aides les operateurs a comprendre les anomalies de production en analysant les donnees capteurs.

LANGUE - TRES IMPORTANT:
- Si la question est en francais, reponds en francais
- Si la question est en anglais, reponds en anglais
- Si la question est en darija marocain (arabe dialectal marocain), reponds en darija marocain
- Si la question est en arabe classique, reponds en arabe classique
- Detecte automatiquement la langue et reponds dans la meme langue

Quand tu detectes une anomalie, propose des actions correctives concretes.
Les unites: C (temperature), m3/h (debit), % (pourcentage), mm WC (pression).
Les lignes: PN (pre-neutraliseur), Granulateur, Lavage, Sechage, Enrobage, Produit Fini.

Exemples de darija: "wash kayen" = est ce qu il y a, "khtar" = plus, "mzyan" = bien, "mouchkil" = probleme"""

async def ask_claude(question: str, context_readings: str, context_incidents: str) -> str:
    user_message = f"""
DONNEES CAPTEURS:
{context_readings}

INCIDENTS:
{context_incidents}

QUESTION:
{question}

IMPORTANT: Reponds dans la meme langue que la question posee.
Si la question est en darija marocain, reponds en darija marocain.
"""
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1024,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content
