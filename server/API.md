# API Documentation

## **General Information**
This API allows users to manage hardware sets and projects, including creating, querying, and updating hardware and project information. The API uses MongoDB for database operations and is built with Flask.

### Base URL
The base URL for this API will depend on your host configuration.
localhost:8086/

## **User Management API**

### **1. Add User**
- **Endpoint**: `/add_user`
- **Method**: `POST`
- **Description**: Registers a new user by saving the username and a hashed password to the database.
- **Request Body**:
  ```json
  {
      "username": "new_user",
      "password": "user_password"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "message": "User created successfully!"
    }
    ```
  - **Failure** (Username already exists):
    ```json
    {
        "error": "Username already exists"
    }
    ```

---

### **2. User Login**
- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user by verifying the username and password.
- **Request Body**:
  ```json
  {
      "username": "new_user",
      "password": "user_password"
  }
  ```
- **Response**:
  - **Success** (Returns session details):
    ```json
    {
        "message": "Login successful",
    }
    ```
  - **Failure** (Invalid username/password):
    ```json
    {
        "error": "Invalid username or password"
    }
    ```
---

### **3. User Add Project**
- **Endpoint**: `/join_project`
- **Method**: `POST`
- **Description**: User create a project or join a existed project
- **Request Body**:
  ```json
  {
      "username": "new_user",
      "projectName": "project_name"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "message": "User {userId} added to project {projectId}"
    }
    ```
  - **Failure** (Username existed in the project):
    ```json
    {
        "error": "User is already part of this project"
    }
    ```
  - **Failure** (Username Not Found):
    ```json
    {
        "error": "User not found"
    }
    ```

  - ****Failure** (Project not found):
    ```json
    {
        "error": "Project not found"
    }
    ```

### **4. Get User's Added Project**
- **Endpoint**: `/get_user_projects_list`
- **Method**: `POST`
- **Description**: User create a project or join a existed project
- **Request Body**:
  ```json
  {
      "username": "username",
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": "[projects]"
    }
    ```
  - **Failure** (Username Not Found):
    ```json
    {
        "error": "User not found"
    }
    ```

---

## **Project Management API**

### **1. Create Project**
- **Endpoint**: `/create_project`
- **Method**: `POST`
- **Description**: Creates a new project with the specified name and description.
- **Request Body**:
  ```json
  {
      "projectName": "Name of the Project",
      "description": "description of the project
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": "Project created successfully"
    }
    ```
  - **Failure**:
    ```json
    {
        "error": "Error message"
    }
    ```

### **2. Get Project Info**
- **Endpoint**: `/get_project_info`
- **Method**: `POST`
- **Description**: Get information of a project with the specified name.
- **Request Body**:
  ```json
  {
      "projectName": "Name of the Project"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": {
            "description": "the description of test-project-1",
            "hwSets": {},
            "projectId": "fake-project-id",
            "projectName": "test-project-1",
            "users": []
        }
    }
    ```
  - **Failure** (Project Name not found):
    ```json
    {
        "error": "Project not found"
    }
    ```

### **3. Checkout Resource for a Project**
- **Endpoint**: `/check_out`
- **Method**: `POST`
- **Description**: Checkout Hardware
- **Request Body**:
  ```json
  {
      "projectName": "Name of the Project",
      "hwSetName": "Hardware Set Name",
      "quantity": "number of checkout hardware",
      "username": "username for the action"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": {
            "description": "the description of test-project-1",
            "hwSets": {},
            "projectId": "fake-project-id",
            "projectName": "test-project-1",
            "users": []
        }
    }
    ```
  - **Failure** (Input Quantity is a string):
    ```json
    {
        "error": "Quantity must be a number"
    }
    ```
  - **Failure** (User not authorized):
    ```json
    {
        "error": "User not authorized for this project"
    }
    ```
  - **Failure** (No enough available hardware):
    ```json
    {
        "error": "Not enough {hwSetName} available. Available units: {hardware['availability']}"
    }
    ```
  - **Failure** (Input Quantity is a positive number):
    ```json
    {
        "error": "Quantity must be a positive number"
    }
    ```
  - **Failure** (Project Name not found):
    ```json
    {
        "error": "Project not found"
    }
    ```

### **4. Checkin Resource for a Project**
- **Endpoint**: `/check_in`
- **Method**: `POST`
- **Description**: Checkin Hardware
- **Request Body**:
  ```json
  {
      "projectName": "Name of the Project",
      "hwSetName": "Hardware Set Name",
      "quantity": "number of checkin hardware",
      "username": "username for the action"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": {
            "description": "the description of test-project-1",
            "hwSets": {},
            "projectId": "fake-project-id",
            "projectName": "test-project-1",
            "users": []
        }
    }
    ```
  - **Failure** (Input Quantity is a string):
    ```json
    {
        "error": "Quantity must be a positive number"
    }
    ```
  - **Failure** (User not authorized):
    ```json
    {
        "error": "User not authorized for this project"
    }
    ```
  - **Failure** (Total number exceed capacity):
    ```json
    {
        "error": "Cannot check in more units than currently checked out. Current usage of {hwSetName}: {current_usage}"
    }
    ```
  - **Failure** (Input Quantity is a positive number):
    ```json
    {
        "error": "Quantity must be a positive number"
    }
    ```
  - **Failure** (Project Name not found):
    ```json
    {
        "error": "Project not found"
    }
    ```

---
## **Hardware Management API**

### **1. Create Hardware Set**
- **Endpoint**: `/create_hardware_set`
- **Method**: `POST`
- **Description**: Creates a new hardware set with the specified name and capacity.
- **Request Body**:
  ```json
  {
      "hwSetName": "Name of the hardware set",
      "capacity": 100
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
        "success": "Hardware set created successfully"
    }
    ```
  - **Failure** (Input Capacity is a string):
    ```json
    {
        "error": "Capacity must be a number"
    }
    ```
  - **Failure** (Input Capacity is a positive number):
    ```json
    {
        "error": "Capacity must be a positive number"
    }
    ```
  - **Failure** (Hardware Set Name Existed):
    ```json
    {
        "error": "Hardware set already exists"
    }
    ```

### **2. Get all hardware names**
- **Endpoint**: `/get_all_hw_names`
- **Method**: `GET`
- **Description**: Get all hardware names
- **Response**:
  - **Success**:
    ```json
    {
        "success": [
            "test-hardware-1"
        ]
    }
    ```
  - **Failure**
    ```json
    {
        "error": "Message"
    }
    ```
### **3. Get hardware info**
- **Endpoint**: `/get_hw_info`
- **Method**: `POST`
- **Description**: Get the hardware info
- **Response**:
  - **Success**:
    ```json
    {
        {
            "success": {
                "availability": 100,
                "capacity": 100,
                "hwName": "test-hardware-1"
            }
        }
    }
    ```
  - **Failure** (Hardware Set not found)
    ```json
    {
        "error": "Hardware set not found"
    }
    ```

### **4. Check Inventory**
- **Endpoint**: `/api/inventory`
- **Method**: `GET`
- **Description**: Fetches the current inventory of all projects, including the hardware sets associated with each project.
- **Response**:
  ```json
  {
      "success": [
          {
              "projectId": "123",
              "projectName": "Project Name",
              "hwSets": {
                  "HW1": 10,
                  "HW2": 5
              },
              "users": ["user1", "user2"]
          },
          ...
      ]
  }
  ```

---