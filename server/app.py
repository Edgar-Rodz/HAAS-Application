import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from utils import get_db

import usersDatabase
import projectsDatabase
import hardwareDatabase
# Initialize Flask app
app = Flask(__name__, static_folder="build")
CORS(app)  # This will allow all origins

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path) -> str:
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    # Placeholder main page logic
    return jsonify({"message": "Main page work in progress"})
    
# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Attempt to add the user using the usersDatabase module
    result = usersDatabase.addUser(username, password)
    status_code = 200 if "success" in result else 400

    return jsonify(result)

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Attempt to log in the user using the usersDatabase module
    result = usersDatabase.login(username, password)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')
    project_name = data.get('projectName')

    # Attempt to join the project using the usersDatabase module
    result = usersDatabase.joinProject(username, project_name)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')

    # Fetch the user's projects using the usersDatabase module
    result = usersDatabase.getUserProjectsList(username)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    # Extract data from request
    data = request.get_json()
    project_name = data.get('projectName')
    description = data.get('description')

    # Attempt to create the project using the projectsDatabase module
    result = projectsDatabase.createProject(project_name, description)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    # Extract data from request
    data = request.get_json()
    project_name = data.get('projectName')

    # Fetch project information using the projectsDatabase module
    result = projectsDatabase.queryProject(project_name)
    status_code = 200 if "success" in result else 400
    # Return a JSON response    
    return jsonify(result)

# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    # Extract data from request
    data = request.get_json()
    project_name = data.get('projectName')
    hw_set_name = data.get('hwName')
    qty = str(data.get('quantity'))
    username = data.get('username')
    
    # Attempt to check out the hardware using the projectsDatabase module
    result = projectsDatabase.checkOutHW(project_name, hw_set_name, qty, username)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    # Extract data from request
    data = request.get_json()
    project_name = data.get('projectName')
    hw_set_name = data.get('hwName')
    qty = str(data.get('quantity'))
    username = data.get('username')

    # Attempt to check in the hardware using the projectsDatabase module
    result = projectsDatabase.checkInHW(project_name, hw_set_name, qty, username)
    status_code = 200 if "success" in result else 400
    # Return a JSON response    
    return jsonify(result)


# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    # Extract data from request
    data = request.get_json()
    hw_set_name = data.get('hwName')
    capacity = str(data.get('capacity'))

    # Attempt to create the hardware set using the hardwareDatabase module
    result = hardwareDatabase.createHardwareSet(hw_set_name, capacity)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for getting all hardware names
@app.route('/get_all_hw_names', methods=['GET'])
def get_all_hw_names():
    # Fetch all hardware names using the hardwareDatabase module
    result = hardwareDatabase.getAllHwNames()
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    # Extract data from request
    data = request.get_json()
    hw_set_name = data.get('hwName')

    # Fetch hardware set information using the hardwareDatabase module
    result = hardwareDatabase.queryHardwareSet(hw_set_name)
    status_code = 200 if "success" in result else 400
    # Return a JSON response
    return jsonify(result)

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Fetch all projects from the HardwareCheckout.Projects collection
    db = get_db()
    projects_collection = db['projects']

    # Get all project data
    all_projects = list(projects_collection.find({}))

    for project in all_projects:
        del project['_id']

    # Return a JSON response with the projects list
    return jsonify({"success": all_projects})

# Main entry point for the application

if __name__ == "__main__":
    # Run the Flask app, ensuring it reads from environment variables
    app.run(debug=True)
