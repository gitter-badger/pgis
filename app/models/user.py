from app import db
from sqlalchemy.dialects.postgresql import JSON

class User(db.Model):
    id 	            = db.Column(db.Integer, primary_key=True)
    email               = db.Column(db.String)
    password            = db.Column(db.String) 
    authenticated       = db.Column(db.Boolean, default=False) 
    action_permissions  = db.Column(JSON)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id
