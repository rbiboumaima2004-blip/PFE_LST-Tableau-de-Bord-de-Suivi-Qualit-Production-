import os
from groq import Groq
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.sensor import SensorReading

router = APIRouter()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

@router.post("/query")
async def ai_query(
    question: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    try:
        recent_readings = (
            db.query(SensorReading)
            .order_by(SensorReading.timestamp.desc())
            .limit(30)
            .all()
        )
        context = "\n".join([
            f"{r.ligne} - {r.sensor_name}: {r.value} {r.unit}"
            for r in recent_readings
        ])

        system_prompt = (
            "You are OCPAI, an intelligent assistant for OCP Morocco fertilizer production.\n"
            "Production lines: PN=Neutralization, Granulateur=Granulation, Lavage=Washing, "
            "Sechage=Drying, Enrobage=Coating, PRODUIT FINI=Finished Product.\n\n"
            "ABSOLUTE RULES:\n"
            "1. ALWAYS respond in the SAME language as the question. No exceptions.\n"
            "   - French question -> French answer\n"
            "   - Arabic question -> Arabic answer\n"
            "   - English question -> English answer\n"
            "   - Darija question -> Darija answer\n"
            "2. If the question is not about OCP production, respond normally as a general assistant.\n"
            "3. Your name is OCPAI.\n"
            "4. Be natural, intelligent and professional."
        )

        user_prompt = (
            f"Current plant sensor data:\n{context}\n\nQuestion: {question}"
        )

        chat = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        return {"answer": chat.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}