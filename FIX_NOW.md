# 🔧 FIX IT NOW - Step by Step

## Problem: "Cannot Reach" Error

Let's fix this RIGHT NOW!

## Step 1: Check What's Running

Open PowerShell and run:
```powershell
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8000"
```

## Step 2: Kill Everything (Fresh Start)

```powershell
# Kill all Python processes
taskkill /F /IM python.exe

# Kill all Node processes  
taskkill /F /IM node.exe
```

## Step 3: Start Backend FIRST

Open Terminal 1:
```bash
cd backend
venv\Scripts\activate
python main.py
```

**WAIT** until you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 4: Test Backend

Open browser: **http://localhost:8000/health**

Should see: `{"status": "healthy"}`

If NOT working → Backend issue, check Terminal 1 for errors

## Step 5: Start Frontend

Open Terminal 2 (NEW terminal, keep Terminal 1 running):
```bash
cd public
python server.py
```

**WAIT** until you see:
```
Frontend server running at http://localhost:3000
```

## Step 6: Test Frontend

Open browser: **http://localhost:3000**

Should see: SnuggleNest homepage

---

## Alternative: Use Python's Built-in Server

If `server.py` doesn't work, use Python's HTTP server:

**Terminal 2:**
```bash
cd public
python -m http.server 3000
```

Then open: **http://localhost:3000**

---

## Still Not Working?

### Option A: Use Different Ports

**Backend** - Change port in `backend/.env`:
```
PORT=8001
```

**Frontend** - Use port 3001:
```bash
cd public
python -m http.server 3001
```

Then open: **http://localhost:3001**

### Option B: Open HTML Directly

Just double-click: `public/index.html`

It will open in browser (but API calls might fail due to CORS)

---

## Quick Test Script

Save this as `test-connection.bat`:

```batch
@echo off
echo Testing connections...
echo.
echo Testing Backend (port 8000)...
curl http://localhost:8000/health
echo.
echo Testing Frontend (port 3000)...
curl http://localhost:3000
pause
```

Run it to see what's working!

---

## MOST COMMON FIX

**90% of the time, the issue is:**

1. Backend not running → Start it!
2. Frontend not running → Start it!
3. Wrong port → Check which ports are actually in use
4. Firewall blocking → Temporarily disable to test

---

## EMERGENCY: Just Open HTML Files

If servers won't start, just open files directly:

1. Navigate to `public` folder
2. Double-click `index.html`
3. It opens in browser (limited functionality, but you can see the page!)

---

## Need More Help?

Check:
- Terminal 1 (Backend) - Any error messages?
- Terminal 2 (Frontend) - Any error messages?
- Browser Console (F12) - Any errors?
- Windows Firewall - Blocking ports?

