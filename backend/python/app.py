from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from datetime import date, datetime

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Powar Python Data Processor",
    description="FastAPI backend for large data processing operations with master data support",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'powar_db'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Response models
class HealthResponse(BaseModel):
    status: str
    service: str

class DataResponse(BaseModel):
    success: bool
    count: int = None
    data: List[Dict[str, Any]] = None
    error: str = None

class ErrorResponse(BaseModel):
    success: bool
    error: str

class MasterStateResponse(BaseModel):
    id: int
    state_name: str

class MasterDistrictResponse(BaseModel):
    id: int
    master_state_id: int
    dist_name: str

class MasterTahsilResponse(BaseModel):
    id: int
    master_dist_id: int
    tahsil_name: str

class MasterProfessionResponse(BaseModel):
    id: int
    employee_type: str

class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    dob: Optional[date] = None
    profile_url: Optional[str] = None
    gender: str
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    tahsil_id: Optional[int] = None
    address_line: Optional[str] = None
    about: Optional[str] = None
    profession_id: Optional[int] = None
    business_description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

def get_db_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        logger.error(f"Database connection error: {err}")
        return None

@app.get("/api/python/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", service="python-data-processor")

# Master Data Endpoints
@app.get("/api/python/master/states", response_model=DataResponse, tags=["Master Data"])
async def get_all_states():
    """Fetch all states from master_state table"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = "SELECT id, state_name FROM master_state ORDER BY state_name"
        
        df = pd.read_sql(query, connection)
        connection.close()
        
        states_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(states_data)} states")
        return DataResponse(
            success=True,
            count=len(states_data),
            data=states_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching states: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch states data: {str(e)}"
        )

@app.get("/api/python/master/districts/{state_id}", response_model=DataResponse, tags=["Master Data"])
async def get_districts_by_state(state_id: int):
    """Fetch districts by state ID from master_dist table"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = """
        SELECT id, master_state_id, dist_name 
        FROM master_dist 
        WHERE master_state_id = %s 
        ORDER BY dist_name
        """
        
        df = pd.read_sql(query, connection, params=[state_id])
        connection.close()
        
        districts_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(districts_data)} districts for state {state_id}")
        return DataResponse(
            success=True,
            count=len(districts_data),
            data=districts_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching districts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch districts data: {str(e)}"
        )

@app.get("/api/python/master/tahsils/{district_id}", response_model=DataResponse, tags=["Master Data"])
async def get_tahsils_by_district(district_id: int):
    """Fetch tahsils by district ID from master_tahsil table"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = """
        SELECT id, master_dist_id, tahsil_name 
        FROM master_tahsil 
        WHERE master_dist_id = %s 
        ORDER BY tahsil_name
        """
        
        df = pd.read_sql(query, connection, params=[district_id])
        connection.close()
        
        tahsils_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(tahsils_data)} tahsils for district {district_id}")
        return DataResponse(
            success=True,
            count=len(tahsils_data),
            data=tahsils_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching tahsils: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tahsils data: {str(e)}"
        )

@app.get("/api/python/master/professions", response_model=DataResponse, tags=["Master Data"])
async def get_all_professions():
    """Fetch all professions from master_profession table"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = "SELECT id, employee_type FROM master_profession ORDER BY employee_type"
        
        df = pd.read_sql(query, connection)
        connection.close()
        
        professions_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(professions_data)} professions")
        return DataResponse(
            success=True,
            count=len(professions_data),
            data=professions_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching professions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch professions data: {str(e)}"
        )

@app.get("/api/python/master/location-hierarchy", response_model=DataResponse, tags=["Master Data"])
async def get_location_hierarchy():
    """Fetch complete location hierarchy (states -> districts -> tahsils)"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        # Fetch states with their districts and tahsils
        query = """
        SELECT 
            s.id as state_id,
            s.state_name,
            d.id as district_id,
            d.dist_name,
            t.id as tahsil_id,
            t.tahsil_name
        FROM master_state s
        LEFT JOIN master_dist d ON s.id = d.master_state_id
        LEFT JOIN master_tahsil t ON d.id = t.master_dist_id
        ORDER BY s.state_name, d.dist_name, t.tahsil_name
        """
        
        df = pd.read_sql(query, connection)
        connection.close()
        
        # Group the data into hierarchical structure
        hierarchy = {}
        for _, row in df.iterrows():
            state_id = row['state_id']
            district_id = row['district_id']
            tahsil_id = row['tahsil_id']
            
            if state_id not in hierarchy:
                hierarchy[state_id] = {
                    'id': state_id,
                    'state_name': row['state_name'],
                    'districts': {}
                }
            
            if district_id and district_id not in hierarchy[state_id]['districts']:
                hierarchy[state_id]['districts'][district_id] = {
                    'id': district_id,
                    'dist_name': row['dist_name'],
                    'tahsils': []
                }
            
            if tahsil_id:
                tahsil_data = {
                    'id': tahsil_id,
                    'tahsil_name': row['tahsil_name']
                }
                hierarchy[state_id]['districts'][district_id]['tahsils'].append(tahsil_data)
        
        # Convert to list format
        hierarchy_list = []
        for state in hierarchy.values():
            state_data = {
                'id': state['id'],
                'state_name': state['state_name'],
                'districts': list(state['districts'].values())
            }
            hierarchy_list.append(state_data)
        
        logger.info(f"Successfully fetched location hierarchy with {len(hierarchy_list)} states")
        return DataResponse(
            success=True,
            count=len(hierarchy_list),
            data=hierarchy_list
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching location hierarchy: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch location hierarchy: {str(e)}"
        )

# User Profile Endpoints
@app.get("/api/python/users", response_model=DataResponse, tags=["Users"])
async def get_all_users():
    """Fetch all users with their profile information"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = """
        SELECT 
            u.id,
            u.email_id,
            u.mobile_no,
            u.role,
            u.created_at,
            u.updated_at,
            up.first_name,
            up.middle_name,
            up.last_name,
            up.dob,
            up.profile_url,
            up.gender,
            up.state_id,
            up.district_id,
            up.tahsil_id,
            up.address_line,
            up.about,
            up.profession_id,
            up.business_description,
            s.state_name,
            d.dist_name,
            t.tahsil_name,
            p.employee_type as profession_type
        FROM Users u
        LEFT JOIN user_profile up ON u.id = up.user_id
        LEFT JOIN master_state s ON up.state_id = s.id
        LEFT JOIN master_dist d ON up.district_id = d.id
        LEFT JOIN master_tahsil t ON up.tahsil_id = t.id
        LEFT JOIN master_profession p ON up.profession_id = p.id
        ORDER BY u.created_at DESC
        """
        
        df = pd.read_sql(query, connection)
        connection.close()
        
        users_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(users_data)} users")
        return DataResponse(
            success=True,
            count=len(users_data),
            data=users_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users data: {str(e)}"
        )

@app.get("/api/python/users/{user_id}", response_model=DataResponse, tags=["Users"])
async def get_user_details(user_id: int):
    """Fetch detailed information for a specific user"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = """
        SELECT 
            u.id,
            u.email_id,
            u.mobile_no,
            u.role,
            u.created_at,
            u.updated_at,
            up.first_name,
            up.middle_name,
            up.last_name,
            up.dob,
            up.profile_url,
            up.gender,
            up.state_id,
            up.district_id,
            up.tahsil_id,
            up.address_line,
            up.about,
            up.profession_id,
            up.business_description,
            s.state_name,
            d.dist_name,
            t.tahsil_name,
            p.employee_type as profession_type
        FROM Users u
        LEFT JOIN user_profile up ON u.id = up.user_id
        LEFT JOIN master_state s ON up.state_id = s.id
        LEFT JOIN master_dist d ON up.district_id = d.id
        LEFT JOIN master_tahsil t ON up.tahsil_id = t.id
        LEFT JOIN master_profession p ON up.profession_id = p.id
        WHERE u.id = %s
        """
        
        df = pd.read_sql(query, connection, params=[user_id])
        connection.close()
        
        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user_data = df.to_dict('records')[0]
        
        logger.info(f"Successfully fetched user details for ID: {user_id}")
        return DataResponse(
            success=True,
            data=[user_data]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user details: {str(e)}"
        )

@app.get("/api/python/users/by-location/{state_id}", response_model=DataResponse, tags=["Users"])
async def get_users_by_state(state_id: int):
    """Fetch users by state ID"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        query = """
        SELECT 
            u.id,
            u.email_id,
            u.mobile_no,
            u.role,
            u.created_at,
            up.first_name,
            up.middle_name,
            up.last_name,
            up.profile_url,
            up.gender,
            s.state_name,
            d.dist_name,
            t.tahsil_name
        FROM Users u
        LEFT JOIN user_profile up ON u.id = up.user_id
        LEFT JOIN master_state s ON up.state_id = s.id
        LEFT JOIN master_dist d ON up.district_id = d.id
        LEFT JOIN master_tahsil t ON up.tahsil_id = t.id
        WHERE up.state_id = %s
        ORDER BY u.created_at DESC
        """
        
        df = pd.read_sql(query, connection, params=[state_id])
        connection.close()
        
        users_data = df.to_dict('records')
        
        logger.info(f"Successfully fetched {len(users_data)} users from state {state_id}")
        return DataResponse(
            success=True,
            count=len(users_data),
            data=users_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching users by state: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users by state: {str(e)}"
        )

# Analytics Endpoints
@app.get("/api/python/analytics", response_model=DataResponse, tags=["Analytics"])
async def get_analytics():
    """Fetch analytics data for dashboard"""
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )
        
        # Query to fetch analytics data
        queries = {
            'total_users': "SELECT COUNT(*) as count FROM Users",
            'total_profiles': "SELECT COUNT(*) as count FROM user_profile",
            'total_states': "SELECT COUNT(*) as count FROM master_state",
            'total_districts': "SELECT COUNT(*) as count FROM master_dist",
            'total_tahsils': "SELECT COUNT(*) as count FROM master_tahsil",
            'total_professions': "SELECT COUNT(*) as count FROM master_profession",
            'users_by_role': "SELECT role, COUNT(*) as count FROM Users GROUP BY role",
            'users_by_gender': "SELECT up.gender, COUNT(*) as count FROM user_profile up GROUP BY up.gender",
            'users_by_profession': "SELECT p.employee_type, COUNT(*) as count FROM user_profile up JOIN master_profession p ON up.profession_id = p.id GROUP BY p.employee_type"
        }
        
        analytics_data = {}
        for key, query in queries.items():
            df = pd.read_sql(query, connection)
            if key in ['users_by_role', 'users_by_gender', 'users_by_profession']:
                analytics_data[key] = df.to_dict('records')
            else:
                analytics_data[key] = df['count'].iloc[0]
        
        connection.close()
        
        logger.info("Successfully fetched analytics data")
        return DataResponse(
            success=True,
            data=[analytics_data]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics data: {str(e)}"
        )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PYTHON_PORT', 5000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
