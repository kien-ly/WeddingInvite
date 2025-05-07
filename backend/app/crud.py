from sqlalchemy.orm import Session
from . import models, schemas

# --- Wish CRUD ---
def get_wish(db: Session, wish_id: int):
    return db.query(models.Wish).filter(models.Wish.id == wish_id).first()

def get_wishes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Wish).order_by(models.Wish.created_at.desc()).offset(skip).limit(limit).all()

def create_wish(db: Session, wish: schemas.WishCreate):
    db_wish = models.Wish(name=wish.name, wish_text=wish.wish_text)
    db.add(db_wish)
    db.commit()
    db.refresh(db_wish)
    return db_wish

# --- Confirmation CRUD ---
def get_confirmation(db: Session, confirmation_id: int):
    return db.query(models.Confirmation).filter(models.Confirmation.id == confirmation_id).first()

def get_confirmations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Confirmation).order_by(models.Confirmation.created_at.desc()).offset(skip).limit(limit).all()

def create_confirmation(db: Session, confirmation: schemas.ConfirmationCreate):
    db_confirmation = models.Confirmation(
        name=confirmation.name,
        attending=confirmation.attending,
        guests_count=confirmation.guests_count,
        message=confirmation.message
    )
    db.add(db_confirmation)
    db.commit()
    db.refresh(db_confirmation)
    return db_confirmation