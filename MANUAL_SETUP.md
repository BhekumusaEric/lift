# LiftLink Manual Setup Guide
## Run These Commands on Your Machine

### 🎯 **Since Node.js is installed, let's get LiftLink running!**

---

## 📋 **Step 1: Open Terminal/Command Prompt**

### **Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or press `Win + X`, select "Command Prompt" or "PowerShell"

### **Mac:**
- Press `Cmd + Space`, type "Terminal", press Enter

### **Linux:**
- Press `Ctrl + Alt + T`

---

## 📋 **Step 2: Navigate to Project Directory**

```bash
# Navigate to your LiftLink project
cd C:\Users\Administrator\lift

# Verify you're in the right place
dir
# You should see: liftlink-frontend, supabase, setup.bat, etc.
```

---

## 📋 **Step 3: Verify Node.js Installation**

```bash
# Check Node.js version
node --version
# Should show: v18.x.x or v20.x.x

# Check npm version
npm --version
# Should show: 9.x.x or 10.x.x
```

**If these commands don't work:**
1. Restart your terminal/command prompt
2. Make sure Node.js was installed with "Add to PATH" checked
3. Reinstall Node.js from [https://nodejs.org/](https://nodejs.org/)

---

## 📋 **Step 4: Install Dependencies**

```bash
# Navigate to frontend directory
cd liftlink-frontend

# Install all dependencies
npm install

# If that fails, try:
npm install --legacy-peer-deps

# If still failing, try:
npm cache clean --force
npm install
```

**Expected output:**
- Should download and install packages
- Might take 2-5 minutes
- Should end with "added X packages" message

---

## 📋 **Step 5: Start Development Server**

```bash
# Start the development server
npm run dev

# Alternative if above doesn't work:
npx next dev
```

**Expected output:**
```
> liftlink-frontend@0.1.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

## 📋 **Step 6: Open in Browser**

1. **Open your web browser**
2. **Go to:** [http://localhost:3000](http://localhost:3000)
3. **You should see:** LiftLink landing page

---

## ✅ **Success Indicators**

### **✅ What You Should See:**
- LiftLink landing page loads
- Navigation menu works (Find a Ride, Offer a Ride, etc.)
- "Sign Up" and "Sign In" buttons work
- Page is mobile-responsive
- No error messages

### **✅ Test Basic Functionality:**
1. **Click "Sign Up"** - Registration form should appear
2. **Try to register** - Should work with your Supabase database
3. **Click "Find a Ride"** - Search page should load
4. **Check mobile view** - Resize browser window

---

## 🚨 **Troubleshooting**

### **Issue: "npm is not recognized"**
**Solution:**
1. Restart terminal/command prompt
2. Verify Node.js installation: Download from [nodejs.org](https://nodejs.org/)
3. Make sure "Add to PATH" was checked during installation

### **Issue: "Cannot find module" errors**
**Solution:**
```bash
# Delete node_modules and reinstall
rmdir /s node_modules
del package-lock.json
npm install
```

### **Issue: "Port 3000 already in use"**
**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
# Then go to http://localhost:3001
```

### **Issue: Supabase connection errors**
**Solution:**
- Check `.env.local` file exists in liftlink-frontend folder
- Verify Supabase credentials are correct
- Check browser console (F12) for specific errors

### **Issue: Page loads but looks broken**
**Solution:**
```bash
# Stop server (Ctrl+C) and restart
npm run dev

# Clear browser cache
# Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

---

## 🎯 **Once Running Successfully**

### **Immediate Next Steps:**
1. **Test user registration** - Create an account
2. **Explore all pages** - Make sure everything works
3. **Check mobile view** - Resize browser window
4. **Test ride creation** - Try posting a ride
5. **Check for errors** - Open browser console (F12)

### **Optional API Keys (for enhanced features):**

#### **Google Maps API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project and enable Maps JavaScript API
3. Get API key
4. Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

#### **Stripe API (for payments):**
1. Go to [Stripe](https://stripe.com/)
2. Create account and get test keys
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

## 📞 **If You Need Help**

### **Commands to Share:**
If you run into issues, run these and share the output:

```bash
# Check versions
node --version
npm --version

# Check if in right directory
pwd
dir

# Check if dependencies installed
npm list --depth=0

# Check for errors
npm run build
```

### **Browser Console:**
- Press F12 in browser
- Go to "Console" tab
- Look for red error messages
- Share any errors you see

---

## 🎉 **Success!**

**Once you see the LiftLink landing page loading properly, you're ready to start development!**

**Next steps:**
1. Follow `IMMEDIATE_PRIORITIES.md` for development roadmap
2. Start implementing payment integration
3. Add real-time features
4. Begin user testing

**You're on your way to building a competitor to Uber and Bolt! 🚗💨**
