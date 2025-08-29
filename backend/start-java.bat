@echo off
echo Starting Java Backend for Small Operations and Data Formatting...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java is not installed or not in PATH
    echo Please install Java 17+ and try again
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if errorlevel 1 (
    echo Error: Maven is not installed or not in PATH
    echo Please install Maven 3.6+ and try again
    pause
    exit /b 1
)

REM Navigate to Java directory
cd java

REM Clean and compile the project
echo Building Java project...
mvn clean compile

REM Start the Java backend
echo Starting Java backend on port 8080...
echo.
mvn spring-boot:run

pause
