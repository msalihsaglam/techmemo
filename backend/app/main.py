from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # CORS için gerekli
from sqlalchemy.orm import Session
from .core.database import get_db
from sqlalchemy import text
from pydantic import BaseModel

app = FastAPI(title="TechMemo API")

# --- CORS AYARLARI ---
# Bu blok, mobil uygulamanın backend ile sorunsuz konuşmasını sağlar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm IP adreslerine izin ver (Test aşaması için)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, OPTIONS vb. tüm metodlara izin ver
    allow_headers=["*"],
)

# Gelen verinin kalıbı (Schema)
class CaseCreate(BaseModel):
    title: str
    intent: str
    system_tag: str = "Genel"
    author_name: str = "Anonim Mühendis"

@app.get("/cases")
def get_cases(db: Session = Depends(get_db)):
    # Veritabanından vakaları çekiyoruz
    query = text("SELECT id, title, intent, system_tag as system, author_name as author, points, is_resolved as status FROM cases")
    result = db.execute(query).mappings().all()
    
    formatted_result = []
    for row in result:
        case = dict(row)
        case['status'] = 'resolved' if case['status'] else 'open'
        case['id'] = str(case['id'])
        formatted_result.append(case)
        
    return formatted_result

@app.post("/cases")
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    # Yeni vaka ekleme sorgusu
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
    
    # Yeni eklenen kaydın ID'sini geri dönüyoruz
    return {"message": "Vaka başarıyla kaydedildi!", "id": str(result.fetchone()[0])}