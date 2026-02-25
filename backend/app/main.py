from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .core.database import get_db
from sqlalchemy import text
from pydantic import BaseModel
import logging

app = FastAPI(title="TechMemo API")

# Loglama ekleyelim ki terminalde hatayı net görelim
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CaseCreate(BaseModel):
    title: str
    intent: str
    system_tag: str = "Genel"
    author_name: str = "Anonim Mühendis"

@app.get("/cases")
def get_cases(db: Session = Depends(get_db)):
    try:
        # Sorguda karışıklığı önlemek için kolonları ham halleriyle çekiyoruz
        query = text("SELECT id, title, intent, system_tag, author_name, points, is_resolved FROM cases ORDER BY created_at DESC")
        result = db.execute(query).mappings().all()
        
        formatted_result = []
        for row in result:
            case = dict(row)
            # Frontend'in beklediği anahtar isimlerini burada güvenli oluşturuyoruz
            formatted_result.append({
                "id": str(case['id']),
                "title": case['title'],
                "intent": case['intent'],
                "system": case['system_tag'],
                "author": case['author_name'],
                "points": case['points'] if case['points'] is not None else 0,
                "status": 'resolved' if case['is_resolved'] else 'open'
            })
            
        return formatted_result
    except Exception as e:
        logger.error(f"Get Cases Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cases")
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    try:
        query = text("""
            INSERT INTO cases (title, intent, system_tag, author_name)
            VALUES (:title, :intent, :system_tag, :author_name)
            RETURNING id
        """)
        
        result = db.execute(query, {
            "title": case.title,
            "intent": case.intent,
            "system_tag": case.system_tag,
            "author_name": case.author_name
        })
        db.commit()
        
        row = result.fetchone()
        return {"message": "Vaka başarıyla kaydedildi!", "id": str(row[0])}
    except Exception as e:
        db.rollback()
        logger.error(f"Create Case Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))