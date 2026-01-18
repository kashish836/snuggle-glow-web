# 🔧 Troubleshooting Guide - "Site Can't Be Reached"

## Quick Diagnosis

### Check 1: Are Both Services Running?

**Backend Check:**
- Open: http://localhost:8000/health
- Should see: `{"status": "healthy"}`
- ✅ If yes → Backend is running
- ❌ If no → Backend not running

**Frontend Check:**
- Open: http://localhost:5173
- Should see: SnuggleNest homepage
- ✅ If yes → Frontend is running
- ❌ If no → Frontend not running

---

## Common Issues & Solutions

### Issue 1: Frontend Not Running

**Symptoms:**
- "This site can't be reached" on http://localhost:5173
- Backend works fine

**Solution:**
```bash
# Open a new terminal/command prompt
npm install
npm run dev
```

**Or use the batch file:**
- Double-click `start-frontend.bat`

---

### Issue 2: Backend Not Running

**Symptoms:**
- "This site can't be reached" on http://localhost:8000
- Frontend shows connection errors

**Solution:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

**Or use the batch file:**
- Double-click `start-backend.bat`

---

### Issue 3: Wrong Port

**Symptoms:**
- Services running but wrong port
- Vite might use different port if 5173 is taken

**Solution:**
1. Check terminal output for actual port
2. Look for: `Local: http://localhost:XXXX`
3. Use that port instead

**Or change port:**
- Edit `vite.config.ts` to set specific port
- Or kill process using port 5173

---

### Issue 4: Firewall/Antivirus Blocking

**Symptoms:**
- Services running but can't connect
- Works on localhost but not from network

**Solution:**
1. Check Windows Firewall
2. Allow Python and Node.js through firewall
3. Temporarily disable antivirus to test

---

### Issue 5: Port Already in Use

**Symptoms:**
- Error: "Port 8000/5173 already in use"
- Services won't start

**Solution:**

**For Backend (port 8000):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=8001
```

**For Frontend (port 5173):**
- Vite will auto-use next available port
- Check terminal for actual port
- Or kill process: `taskkill /PID <PID> /F`

---

### Issue 6: CORS Errors in Browser Console

**Symptoms:**
- Browser console shows CORS errors
- API calls failing

**Solution:**
1. Check `backend/.env` has:
   ```
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
2. Restart backend after changing `.env`
3. Clear browser cache

---

### Issue 7: Environment Variables Not Set

**Symptoms:**
- Frontend can't connect to backend
- API calls failing

**Solution:**
1. Check `.env` file exists in root
2. Should contain:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
3. Restart frontend after changing `.env`

---

## Step-by-Step Recovery

### Complete Reset:

1. **Stop All Services:**
   - Close all terminal windows
   - Kill processes: `taskkill /F /IM python.exe` and `taskkill /F /IM node.exe`

2. **Start Backend:**
   ```bash
   cd backend
   venv\Scripts\activate
   python main.py
   ```
   Wait for: "Uvicorn running on http://0.0.0.0:8000"

3. **Start Frontend (new terminal):**
   ```bash
   npm run dev
   ```
   Wait for: "Local: http://localhost:5173/"

4. **Test:**
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:5173

---

## Verify Everything Works

### Test Backend:
```bash
# In browser or curl:
http://localhost:8000/health
# Should return: {"status": "healthy"}

http://localhost:8000/docs
# Should show Swagger UI
```

### Test Frontend:
```bash
# In browser:
http://localhost:5173
# Should show SnuggleNest homepage
```

### Test Connection:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login/register
4. Check if API calls are being made
5. Look for errors

---

## Still Not Working?

### Check Logs:

**Backend Terminal:**
- Look for error messages
- Check for import errors
- Verify database connection

**Frontend Terminal:**
- Look for compilation errors
- Check for missing dependencies
- Verify Vite is running

**Browser Console (F12):**
- Check for JavaScript errors
- Look for network errors
- Check CORS issues

---

## Quick Commands Reference

```bash
# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Kill process on port
taskkill /PID <PID> /F

# Start backend
cd backend && venv\Scripts\activate && python main.py

# Start frontend
npm run dev

# Install dependencies
npm install
cd backend && venv\Scripts\activate && pip install -r requirements.txt
```

---

## Need More Help?

1. Check `RUN_PROJECT.md` for detailed setup
2. Check `FRONTEND_BACKEND_CONNECTION.md` for connection issues
3. Verify all files from setup are present
4. Check Python and Node.js versions are correct

---

## Most Common Fix

**90% of issues are solved by:**
1. Making sure both services are running
2. Using correct URLs (localhost, not 127.0.0.1)
3. Checking browser console for errors
4. Restarting both services

**Try this first:**
```bash
# Terminal 1
cd backend
venv\Scripts\activate
python main.py

# Terminal 2 (new terminal)
npm run dev
```

Then open: http://localhost:5173

