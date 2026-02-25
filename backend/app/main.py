from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .core.database import get_db
from sqlalchemy import text

app = FastAPI(title="TechMemo API")

@app.get("/cases")
def get_cases(db: Session = Depends(get_db)):
    # Şimdilik direkt SQL sorgusu ile verileri çekelim (Hızlı test için)
    query = text("SELECT id, title, intent, system_tag as system, author_name as author, points, is_resolved as status FROM cases")
    result = db.execute(query).mappings().all()
    
    # SQL'deki boolean status'u bizim UI'daki 'resolved'/'open' formatına çevirelim
    formatted_result = []
    for row in result:
        case = dict(row)
        case['status'] = 'resolved' if case['status'] else 'open'
        case['id'] = str(case['id']) # UUID'yi string'e çeviriyoruz
        formatted_result.append(case)
        
    return formatted_result