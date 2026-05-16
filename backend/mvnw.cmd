#!/bin/sh

# Batch file for Windows (mvnw.cmd) - for cross-platform support
@REM Maven Wrapper script for Windows

setlocal enabledelayedexpansion
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper
set MAVEN_JAR=%MAVEN_HOME%\maven-wrapper.jar

if not exist %MAVEN_JAR% (
    mkdir %MAVEN_HOME%
    powershell -Command "(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%MAVEN_JAR%'"
)

java -jar %MAVEN_JAR% %*
