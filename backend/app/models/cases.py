from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True) # 4-5 kelimelik özet
    intent = Column(String) # 'solution' or 'problem'
    description = Column(String, nullable=True) # Detaylar
    system_tag = Column(String) # Dinamik ürün ağacı etiketi
    project_name = Column(String, nullable=True)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))

    # İlişkiler
    author = relationship("User", back_populates="cases")