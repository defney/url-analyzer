# models.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class URLResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str
    title: str
    html_version: str
    h1: int
    h2: int
    h3: int
    h4: int
    h5: int
    h6: int
    internal_links: int
    external_links: int
    has_login_form: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
