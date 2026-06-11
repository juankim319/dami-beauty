@echo off
cd /d "%~dp0..\backend"
echo Deploying Firestore + Storage rules to dami-beauty-353b0...
python scripts\deploy_firebase_rules.py
if errorlevel 1 (
  echo.
  echo Deploy failed. If DNS/network error, check internet and retry.
  echo Alternative: scripts\deploy-firebase-rules-cli.cmd
  exit /b 1
)
echo.
echo Success. Check Firebase Console - Storage - Rules tab.
