# hardwareDatabase.py

# Import necessary libraries and modules
from utils import get_db  # Assuming get_db is defined in app.py or utils.py

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

# Function to create a new hardware set
def createHardwareSet(hwSetName, initCapacity):
    # Ensure the capacity is a positive number
    if not initCapacity.isdigit():
        return {"error": "Capacity must be a number"}
    
    initCapacity = int(initCapacity)
    
    if initCapacity <= 0:
        return {"error": "Capacity must be a positive number"}

    db = get_db()
    hw_collection = db['hardwareSets']

    # Check if hardware set already exists
    if hw_collection.find_one({"hwName": hwSetName}):
        return {"error": "Hardware set already exists"}

    # Create a new hardware set entry
    hw_data = {
        'hwName': hwSetName,
        'capacity': initCapacity,
        'availability': initCapacity  # Initially, availability equals capacity
    }
    hw_collection.insert_one(hw_data)
    return {"success": "Hardware set created successfully"}

# Function to query a hardware set by its name
def queryHardwareSet(hwSetName):
    db = get_db()
    hw_collection = db['hardwareSets']

    # Query and return the hardware set
    hw_set = hw_collection.find_one({"hwName": hwSetName})
    
    if not hw_set:
        return {"error": "Hardware set not found"}
    
    del hw_set['_id']

    return {"success": hw_set}

# Function to update the availability of a hardware set
def updateAvailability(hwSetName, qty):
    if qty <= 0:
        return {"error": "Quantity must be a positive number"}

    db = get_db()
    hw_collection = db['hardwareSets']

    # Find the hardware set
    hw_set = hw_collection.find_one({"hwName": hwSetName})
    if not hw_set:
        return {"error": "Hardware set not found"}

    new_availability = hw_set['availability'] + qty

    # Ensure the new availability does not exceed the capacity
    if new_availability > hw_set['capacity']:
        return {"error": f"New availability ({new_availability}) exceeds capacity ({hw_set['capacity']})"}

    # Update the availability of the hardware set
    hw_collection.update_one({"hwName": hwSetName}, {"$set": {"availability": new_availability}})
    return {"success": f"Availability updated successfully. New availability: {new_availability}"}

# Function to request space (check out hardware) from a hardware set
def requestSpace(hwName, amount):
    if amount <= 0:
        return {"error": "Amount must be a positive number"}

    db = get_db()
    hw_collection = db['hardwareSets']

    # Find the hardware set
    hw_set = hw_collection.find_one({"hwName": hwName})
    if not hw_set:
        return {"error": "Hardware set not found"}

    # Check if enough availability exists to fulfill the request
    if hw_set['availability'] < amount:
        return {"error": f"Not enough hardware available. Available: {hw_set['availability']}"}

    # Update the availability after the request (reduce availability)
    new_availability = hw_set['availability'] - amount
    hw_collection.update_one({"hwName": hwName}, {"$set": {"availability": new_availability}})
    return {"success": f"{amount} units of {hwName} checked out successfully. New availability: {new_availability}"}

# Function to get all hardware set names
def getAllHwNames():
    db = get_db()
    hw_collection = db['hardwareSets']

    # Get and return a list of all hardware set names
    hw_names = hw_collection.find({}, {"hwName": 1, "_id": 0})
    hw_name_list = [hw['hwName'] for hw in hw_names]
    
    return {"success": hw_name_list}
