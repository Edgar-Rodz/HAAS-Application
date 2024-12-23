# projectsDatabase.py
import json
import uuid

# Import necessary libraries and modules
from utils import get_db  # Assuming get_db is defined in app.py or utils.py
import hardwareDatabase  # Import the correct hardwareDatabase module

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},  # hwSetName : usage
    'users': [user1, user2, ...]
}
'''

# Function to query a project by its ID
def queryProject(project_name):
    db = get_db()
    projects_collection = db['projects']
    project = projects_collection.find_one({"projectName": project_name})
    
    if not project:
        return {"error": "Project not found"}
    
    del project['_id']
    return {"success": project}  # Returning the project object in a success message

# Function to create a new project
def createProject(projectName, description):
    db = get_db()
    projects_collection = db['projects']

    # Check if project already exists
    if projects_collection.find_one({"projectName": projectName}):
        return {"error": "Project Name already exists"}

    project_id = str(uuid.uuid4())
    # Create new project entry
    project_data = {
        'projectName': projectName,
        'projectId': project_id,
        'description': description,
        'hwSets': {},  # Initialize hardware sets as empty
        'users': []    # No users initially
    }
    projects_collection.insert_one(project_data)
    return {"success": "Project created successfully"}

# Function to add a user to a project
def addUser(projectName, userId):
    db = get_db()
    projects_collection = db['projects']

    # Find the project
    project = projects_collection.find_one({"projectName": projectName})
    if not project:
        return {"error": "Project not found"}

    # Add user to the project if not already added
    if userId in project['users']:
        return {"error": "User already added to the project"}
    
    projects_collection.update_one({"projectName": projectName}, {"$push": {"users": userId}})
    return {"success": "User added to project"}

# Function to update hardware usage in a project
def updateUsage(projectName, hwSetName, qty):
    db = get_db()
    projects_collection = db['projects']

    # Find the project
    project = projects_collection.find_one({"projectName": projectName})
    if not project:
        return {"error": "Project not found"}

    # Update the hardware usage in the project
    if hwSetName in project['hwSets']:
        new_qty = project['hwSets'][hwSetName] + qty
    else:
        new_qty = qty
    
    if (new_qty == 0):
        projects_collection.update_one(
            {"projectName": projectName},
            {"$unset": {f"hwSets.{hwSetName}": qty}}
        )
    else:
        projects_collection.update_one(
            {"projectName": projectName},
            {"$set": {f"hwSets.{hwSetName}": new_qty}}
        )
    return {"success": f"Hardware {hwSetName} updated with {qty} units"}

# Function to check out hardware for a project
def checkOutHW(projectName, hwSetName, qty, username):
    if not qty.isdigit():
        return {"error": "Quantity must be a positive number"}
    
    qty = int(qty)
    if qty <= 0:
        return {"error": "Quantity must be a positive number for checkout"}

    db = get_db()
    projects_collection = db['projects']

    # Find the project
    project = projects_collection.find_one({"projectName": projectName})
    if not project:
        return {"error": "Project not found"}

    # Check if user is part of the project
    if username not in project['users']:
        return {"error": "User not authorized for this project"}

    # Check availability of hardware (handled by hardwareDatabase)
    hardware = hardwareDatabase.queryHardwareSet(hwSetName)
    
    if "error" in hardware:
        return {"error": hardware["error"]}
    
    hardware = hardware['success']
    
    if not hardware or hardware['availability'] < qty:
        return {"error": f"Not enough {hwSetName} available. Available units: {hardware['availability']}"}

    # Check out the hardware and update the project
    hardwareDatabase.requestSpace(hwSetName, qty)
    updateUsage(projectName, hwSetName, qty)
    return {"success": f"{qty} units of {hwSetName} checked out by {username}"}

# Function to check in hardware for a project
def checkInHW(projectName, hwSetName, qty, username):
    if not qty.isdigit():
        return {"error": "Quantity must be a positive number"}
    
    qty = int(qty)
    if qty <= 0:
        return {"error": "Quantity must be a positive number for checkout"}

    db = get_db()
    projects_collection = db['projects']

    # Find the project
    project = projects_collection.find_one({"projectName": projectName})
    if not project:
        return {"error": "Project not found"}

    # Check if user is part of the project
    if username not in project['users']:
        return {"error": "User not authorized for this project"}
    
    hardware = hardwareDatabase.queryHardwareSet(hwSetName)
    if "error" in hardware:
        return {"error": hardware["error"]}

    # Check the current usage of the hardware in the project
    current_usage = project['hwSets'].get(hwSetName, 0)
    if qty > current_usage:
        return {"error": f"Cannot check in more units than currently checked out. Current usage of {hwSetName}: {current_usage}"}

    # Check in the hardware and update the project
    hardwareDatabase.updateAvailability(hwSetName, qty)
    updateUsage(projectName, hwSetName, -qty)  # Reduce the hardware usage in the project
    return {"success": f"{qty} units of {hwSetName} checked in by {username}"}

