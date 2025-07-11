# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from crawler_utils import analyze_url
from sqlmodel import Session, SQLModel, create_engine
from models import URLResult
from typing import List
from fastapi.middleware.cors import CORSMiddleware  



DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, echo=True)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # veya geçici olarak ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uygulama başlarken tabloyu oluştur
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)



class URLRequest(BaseModel):
    url: HttpUrl

@app.post("/analyze")
def analyze(request: URLRequest):
    try:
        result = analyze_url(str(request.url))

        # heading bilgilerini al
        h = result["headings"]

        data = URLResult(
            url=str(request.url),
            title=result["title"],
            html_version=result["html_version"],
            h1=h.get("h1", 0),
            h2=h.get("h2", 0),
            h3=h.get("h3", 0),
            h4=h.get("h4", 0),
            h5=h.get("h5", 0),
            h6=h.get("h6", 0),
            internal_links=result["internal_links"],
            external_links=result["external_links"],
            has_login_form=result["has_login_form"]
        )

        with Session(engine) as session:
            session.add(data)
            session.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/results", response_model=List[URLResult])
def get_results():
    with Session(engine) as session:
        results = session.query(URLResult).all()
        return results
