import uuid

from utils import get_db  # Assuming get_db is defined in app.py or utils.py
import projectsDatabase  # Import the projectsDatabase module for managing project relations

'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''

# Function to add a new user
def addUser(username, password):
    db = get_db()
    users_collection = db['users']

    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return {"error": "Username already exists"}

    user_id = str(uuid.uuid4())
    # Create a new user entry
    user_data = {
        'username': username,
        'userId': user_id,
        'password': password,  # In a real app, make sure to hash passwords!
        'projects': []  # Empty list of projects initially
    }
    users_collection.insert_one(user_data)
    return {"success": "User created successfully"}

# Function to log in a user
def login(username, password):
    db = get_db()
    users_collection = db['users']

    # Query the user
    user = users_collection.find_one({"username": username})
    if not user:
        return {"error": "Invalid username or password"}

    # Check if password matches (in a real app, make sure to hash passwords and verify securely)
    if user['password'] != password:
        return {"error": "Invalid username or password"}

    return {"success": "Login successful"}

# Function to add a user to a project
def joinProject(username, projectName):
    db = get_db()
    users_collection = db['users']

    # Find the user
    user = users_collection.find_one({"username": username})
    print(username, user)
    if not user:
        return {"error": "User not found"}

    # Check if user is already part of the project
    if projectName in user['projects']:
        return {"error": "User is already part of this project"}

    # Check if the project exists
    project_check = projectsDatabase.queryProject(projectName)
    if "error" in project_check:
        return project_check  # If project not found, return the error

    # Add user to the project and update user record
    users_collection.update_one({"username": username}, {"$push": {"projects": projectName}})

    # Also add the user to the project in projectsDatabase
    projectsDatabase.addUser(projectName, username)

    return {"success": f"User {username} added to project {projectName}"}

# Function to get the list of projects for a user
def getUserProjectsList(username):
    db = get_db()
    users_collection = db['users']

    # Find the user
    user = users_collection.find_one({"username": username})
    if not user:
        return {"error": "User not found"}

    # Return the list of project IDs
    return {"success": user['projects']}
