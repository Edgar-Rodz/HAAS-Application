# Flask Settings
FLASK_ENV = 'development'
FLASK_DEBUG = 1
FLASK_RUN_HOST = '0.0.0.0'
FLASK_RUN_PORT = 8086

# Load MongoDB configuration from environment variables
MONGODB_USER = 'christezeng'
MONGODB_PASSWORD = 'ow74wZ5iU0nEeDEk'
MONGODB_HOST = f"mongodb+srv://{MONGODB_USER}:{MONGODB_PASSWORD}@userinfo.sjiia.mongodb.net/?retryWrites=true&w=majority&appName=Userinfo"
MONGODB_DATABASE = 'testdb'