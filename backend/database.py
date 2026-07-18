import os
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv
from werkzeug.local import LocalProxy
from flask import g, has_app_context
from config import Config

load_dotenv()

# Database Pool Configuration
db_config = {
    "host": Config.DB_HOST,
    "user": Config.DB_USER,
    "password": Config.DB_PASSWORD,
    "database": Config.DB_NAME,
    "port": Config.DB_PORT,
    "autocommit": True,
    "connection_timeout": 600
}

# Initialize Thread-Safe Connection Pool
pool = MySQLConnectionPool(
    pool_name="fitsage_pool",
    pool_size=10,
    **db_config
)

def run_migrations():
    conn = pool.get_connection()
    try:
        cursor = conn.cursor()
        
        # Initialize base tables if empty
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password VARCHAR(200) NOT NULL,
                age INT DEFAULT NULL,
                gender VARCHAR(20) DEFAULT NULL,
                height INT DEFAULT NULL,
                weight INT DEFAULT NULL,
                goal VARCHAR(100) DEFAULT NULL,
                diet VARCHAR(100) DEFAULT NULL,
                budget INT DEFAULT NULL,
                activity VARCHAR(100) DEFAULT NULL,
                equipment VARCHAR(100) DEFAULT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                fitness_level VARCHAR(50) DEFAULT 'Beginner',
                allergies TEXT DEFAULT NULL,
                injuries TEXT DEFAULT NULL,
                workout_duration INT DEFAULT 45,
                profile_completed BOOLEAN DEFAULT FALSE,
                initial_setup_completed BOOLEAN DEFAULT FALSE,
                workout_status VARCHAR(20) DEFAULT 'pending',
                meal_status VARCHAR(20) DEFAULT 'pending',
                recommendations_status VARCHAR(20) DEFAULT 'pending',
                insights_status VARCHAR(20) DEFAULT 'pending',
                workout_location VARCHAR(50) DEFAULT NULL,
                medical_conditions TEXT DEFAULT NULL,
                water_goal VARCHAR(50) DEFAULT NULL,
                sleep_hours VARCHAR(50) DEFAULT NULL,
                last_login_date DATE DEFAULT NULL,
                current_streak INT DEFAULT 0,
                longest_streak INT DEFAULT 0,
                bmr FLOAT DEFAULT NULL,
                calories_target INT DEFAULT 2000,
                ai_insights TEXT DEFAULT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS workouts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                workout_plan TEXT NOT NULL,
                profile_hash VARCHAR(64) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS meals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                meal_plan TEXT NOT NULL,
                profile_hash VARCHAR(64) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS progress_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                weight FLOAT NOT NULL,
                water_intake INT DEFAULT 0,
                calories_consumed INT DEFAULT 0,
                workout_completed BOOLEAN DEFAULT FALSE,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY user_date_idx (user_id, date)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS coach_chat (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_message TEXT NOT NULL,
                ai_response LONGTEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                session_id VARCHAR(50) DEFAULT 'default',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        conn.commit()
        
        # Check and create role column
        cursor.execute("SHOW COLUMNS FROM users LIKE 'role'")
        if not cursor.fetchone():
            print("Migration: 'role' column is missing. Adding it to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'")
            conn.commit()
            print("Migration: Successfully added 'role' column to 'users' table.")
            
        # Check and create fitness_level column
        cursor.execute("SHOW COLUMNS FROM users LIKE 'fitness_level'")
        if not cursor.fetchone():
            print("Migration: 'fitness_level' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN fitness_level VARCHAR(50) DEFAULT 'Beginner'")
            conn.commit()
            print("Migration: Successfully added 'fitness_level' column.")
            
        # Check and create allergies column
        cursor.execute("SHOW COLUMNS FROM users LIKE 'allergies'")
        if not cursor.fetchone():
            print("Migration: 'allergies' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN allergies TEXT DEFAULT NULL")
            conn.commit()
            print("Migration: Successfully added 'allergies' column.")
            
        # Check and create injuries column
        cursor.execute("SHOW COLUMNS FROM users LIKE 'injuries'")
        if not cursor.fetchone():
            print("Migration: 'injuries' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN injuries TEXT DEFAULT NULL")
            conn.commit()
            print("Migration: Successfully added 'injuries' column.")
            
        # Check and create workout_duration column
        cursor.execute("SHOW COLUMNS FROM users LIKE 'workout_duration'")
        if not cursor.fetchone():
            print("Migration: 'workout_duration' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN workout_duration INT DEFAULT 45")
            conn.commit()
            print("Migration: Successfully added 'workout_duration' column.")

        # Onboarding migrations
        cursor.execute("SHOW COLUMNS FROM users LIKE 'profile_completed'")
        if not cursor.fetchone():
            print("Migration: 'profile_completed' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'initial_setup_completed'")
        if not cursor.fetchone():
            print("Migration: 'initial_setup_completed' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN initial_setup_completed BOOLEAN DEFAULT FALSE")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'workout_status'")
        if not cursor.fetchone():
            print("Migration: 'workout_status' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN workout_status VARCHAR(20) DEFAULT 'pending'")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'meal_status'")
        if not cursor.fetchone():
            print("Migration: 'meal_status' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN meal_status VARCHAR(20) DEFAULT 'pending'")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'recommendations_status'")
        if not cursor.fetchone():
            print("Migration: 'recommendations_status' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN recommendations_status VARCHAR(20) DEFAULT 'pending'")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'insights_status'")
        if not cursor.fetchone():
            print("Migration: 'insights_status' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN insights_status VARCHAR(20) DEFAULT 'pending'")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'workout_location'")
        if not cursor.fetchone():
            print("Migration: 'workout_location' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN workout_location VARCHAR(50) DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'medical_conditions'")
        if not cursor.fetchone():
            print("Migration: 'medical_conditions' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN medical_conditions TEXT DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'water_goal'")
        if not cursor.fetchone():
            print("Migration: 'water_goal' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN water_goal VARCHAR(50) DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'sleep_hours'")
        if not cursor.fetchone():
            print("Migration: 'sleep_hours' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN sleep_hours VARCHAR(50) DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'last_login_date'")
        if not cursor.fetchone():
            print("Migration: 'last_login_date' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN last_login_date DATE DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'current_streak'")
        if not cursor.fetchone():
            print("Migration: 'current_streak' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN current_streak INT DEFAULT 0")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'longest_streak'")
        if not cursor.fetchone():
            print("Migration: 'longest_streak' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN longest_streak INT DEFAULT 0")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'bmr'")
        if not cursor.fetchone():
            print("Migration: 'bmr' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN bmr FLOAT DEFAULT NULL")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'calories_target'")
        if not cursor.fetchone():
            print("Migration: 'calories_target' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN calories_target INT DEFAULT 2000")
            conn.commit()

        cursor.execute("SHOW COLUMNS FROM users LIKE 'ai_insights'")
        if not cursor.fetchone():
            print("Migration: 'ai_insights' column is missing. Adding it...")
            cursor.execute("ALTER TABLE users ADD COLUMN ai_insights TEXT DEFAULT NULL")
            conn.commit()

        # Check and create profile_hash in workouts table
        cursor.execute("SHOW COLUMNS FROM workouts LIKE 'profile_hash'")
        if not cursor.fetchone():
            print("Migration: 'profile_hash' column is missing in 'workouts' table. Adding it...")
            cursor.execute("ALTER TABLE workouts ADD COLUMN profile_hash VARCHAR(64) DEFAULT NULL")
            conn.commit()
            print("Migration: Successfully added 'profile_hash' to 'workouts' table.")

        # Check and create profile_hash in meals table
        cursor.execute("SHOW COLUMNS FROM meals LIKE 'profile_hash'")
        if not cursor.fetchone():
            print("Migration: 'profile_hash' column is missing in 'meals' table. Adding it...")
            cursor.execute("ALTER TABLE meals ADD COLUMN profile_hash VARCHAR(64) DEFAULT NULL")
            conn.commit()
            print("Migration: Successfully added 'profile_hash' to 'meals' table.")

        # Check and create coach_summary table
        cursor.execute("SHOW TABLES LIKE 'coach_summary'")
        if not cursor.fetchone():
            print("Migration: 'coach_summary' table is missing. Creating it...")
            cursor.execute("""
                CREATE TABLE coach_summary (
                    user_id INT PRIMARY KEY,
                    summary TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            print("Migration: Successfully created 'coach_summary' table.")

        # Check and create ai_generations table
        cursor.execute("SHOW TABLES LIKE 'ai_generations'")
        if not cursor.fetchone():
            print("Migration: 'ai_generations' table is missing. Creating it...")
            cursor.execute("""
                CREATE TABLE ai_generations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    generation_type VARCHAR(50),
                    model_name VARCHAR(50),
                    temperature FLOAT,
                    generation_time_ms INT,
                    cache_hit BOOLEAN,
                    profile_hash VARCHAR(64),
                    status VARCHAR(20),
                    error_message TEXT DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            print("Migration: Successfully created 'ai_generations' table.")

        # Check and create session_id column in coach_chat table
        cursor.execute("SHOW COLUMNS FROM coach_chat LIKE 'session_id'")
        if not cursor.fetchone():
            print("Migration: 'session_id' column is missing in 'coach_chat' table. Adding it...")
            cursor.execute("ALTER TABLE coach_chat ADD COLUMN session_id VARCHAR(50) DEFAULT 'default'")
            conn.commit()
            print("Migration: Successfully added 'session_id' to 'coach_chat' table.")

        print("Migration: Database migrations completed successfully.")
        cursor.close()
    except Exception as e:
        print(f"Migration Error: {e}")
    finally:
        conn.close()

run_migrations()

def get_db_connection():
    if not has_app_context():
        # Fallback for standalone CLI/scripts outside request context
        if not hasattr(get_db_connection, "_fallback_db") or not get_db_connection._fallback_db.is_connected():
            get_db_connection._fallback_db = pool.get_connection()
        return get_db_connection._fallback_db

    if 'db_conn' not in g:
        g.db_conn = pool.get_connection()
    return g.db_conn

def get_db_cursor():
    if not has_app_context():
        # Fallback for standalone CLI/scripts outside request context
        if not hasattr(get_db_cursor, "_fallback_cursor") or not get_db_cursor._fallback_cursor:
            conn = get_db_connection()
            get_db_cursor._fallback_cursor = conn.cursor()
        return get_db_cursor._fallback_cursor

    if 'db_cursor' not in g:
        g.db_cursor = get_db_connection().cursor()
    return g.db_cursor

# Teardown callback to release resources back to pool at the end of each request
def teardown_db(exception=None):
    db_cursor = g.pop('db_cursor', None)
    db_conn = g.pop('db_conn', None)
    
    if db_cursor:
        try:
            db_cursor.close()
        except Exception:
            pass
    if db_conn:
        try:
            db_conn.close()
        except Exception:
            pass

# Proxies that delegate calls to the thread-local/request-local connection and cursor
db = LocalProxy(get_db_connection)
cursor = LocalProxy(get_db_cursor)

print("Database Connection Pool Initialized Successfully")