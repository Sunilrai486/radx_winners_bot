from flask import Flask
from flask_cors import CORS

from app.routes.juniorbot import juniorbot_module
from app.routes.taskmaster import taskmaster_module

# Initialize Flask API
app = Flask(__name__)

CORS(app)

# Initialize Base Flask API
@app.route('/')
def hello_world():
    return 'Hello, World!'

app.register_blueprint(juniorbot_module, url_prefix="/juniorbot")
app.register_blueprint(taskmaster_module, url_prefix="/taskmaster")

# Run API Server
if __name__ == '__main__':
    app.run(debug=True)