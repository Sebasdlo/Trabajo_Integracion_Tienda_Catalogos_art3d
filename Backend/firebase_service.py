import firebase_admin
from firebase_admin import credentials, db
import uuid
import os
from dotenv import load_dotenv

load_dotenv()


class FirebaseService:
    def __init__(self):
        # Initialize Firebase app if not already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate("firebase.json")
            firebase_admin.initialize_app(cred, {
                'databaseURL': "https://art-3d-6fc32-default-rtdb.firebaseio.com/"
            })

        self.ref = db.reference('figuras')

    def create_figura(self, figura_data):
        figura_id = str(uuid.uuid4())
        self.ref.child(figura_id).set(figura_data)
        return figura_id

    def get_figura(self, figura_id):
        return self.ref.child(figura_id).get()

    def get_all_figuras(self):
        return self.ref.get()

    def update_figura(self, figura_id, update_data):
        self.ref.child(figura_id).update(update_data)
        return True

    def delete_figura(self, figura_id):
        self.ref.child(figura_id).delete()
        return True
