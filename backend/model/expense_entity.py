from datetime import date
from configure_db import db 
from model.user_entity import User  

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    amount = db.Column(db.Float, nullable=False)  
    category = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(160), nullable=True)
    date = db.Column(db.Date, nullable=False, default=date.today)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Expense {self.category}>'
