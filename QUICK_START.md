# LiftLink Quick Start Guide
## Get Running in 5 Minutes

### 🚀 **Your Supabase is Already Connected!**
✅ Database: `https://zwlnjacnepcwpphfnxww.supabase.co`  
✅ Tables: users, rides, ride_requests, reviews, vehicles  
✅ Environment variables: Already configured  

---

## 📋 **Step 1: Install Node.js (if not installed)**

### Windows:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and **check "Add to PATH"**
4. Restart your terminal/command prompt

### Mac:
```bash
# With Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
```

### Verify Installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## 📋 **Step 2: Run the Setup Script**

### Windows:
```cmd
# Double-click setup.bat or run in command prompt:
setup.bat
```

### Mac/Linux:
```bash
# Make executable and run:
chmod +x setup.sh
./setup.sh
```

### Manual Setup (if scripts don't work):
```bash
# Navigate to frontend directory
cd liftlink-frontend

# Install dependencies
npm install

# If that fails, try:
npm install --legacy-peer-deps
```

---

## 📋 **Step 3: Start the Development Server**

```bash
cd liftlink-frontend
npm run dev
```

**Your app will be running at: [http://localhost:3000](http://localhost:3000)**

---

## 🎯 **What You Should See**

### ✅ **Success Indicators:**
- App loads without errors
- You can see the LiftLink landing page
- Navigation works (Find a Ride, Offer a Ride, etc.)
- Registration/login forms appear
- No red error messages in browser console

### ❌ **Common Issues & Solutions:**

#### **"npm is not recognized"**
- Node.js not installed or not in PATH
- Reinstall Node.js and restart terminal

#### **"Cannot find module" errors**
- Dependencies not installed
- Run `npm install` in liftlink-frontend directory

#### **Supabase connection errors**
- Should not happen - already configured!
- Check browser console for specific errors

#### **Port 3000 already in use**
```bash
npm run dev -- -p 3001
# Then go to http://localhost:3001
```

---

## 🧪 **Test Your Setup**

### **1. Basic Functionality Test**
- [ ] App loads at http://localhost:3000
- [ ] Click "Sign Up" - form should appear
- [ ] Click "Find a Ride" - search page should load
- [ ] No errors in browser console (F12 → Console)

### **2. Database Connection Test**
- [ ] Try to register a new account
- [ ] Should redirect to dashboard after signup
- [ ] Check Supabase dashboard for new user

### **3. Navigation Test**
- [ ] All menu items work
- [ ] Pages load without errors
- [ ] Mobile view works (resize browser)

---

## 🔧 **Next Steps After Setup**

### **Immediate Priorities (This Week):**
1. **Add sample data** for testing
2. **Implement payment integration** (Stripe)
3. **Add real-time notifications**
4. **Improve mobile responsiveness**
5. **Fix any bugs you find**

### **Get API Keys (Optional but Recommended):**

#### **Google Maps API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "Maps JavaScript API"
4. Create credentials (API key)
5. Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

#### **Stripe API (for payments):**
1. Go to [Stripe](https://stripe.com/)
2. Create account
3. Get test API keys from dashboard
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

## 📊 **Development Workflow**

### **Daily Routine:**
```bash
# Start development
cd liftlink-frontend
npm run dev

# Make changes to code
# Browser auto-refreshes

# Test your changes
# Check browser console for errors

# When done
Ctrl+C  # Stop the server
```

### **Before Making Changes:**
```bash
# Check for TypeScript errors
npm run build

# Run linting
npm run lint
```

---

## 🆘 **Getting Help**

### **If Something Doesn't Work:**
1. **Check browser console** (F12 → Console) for errors
2. **Check terminal output** for server errors
3. **Try restarting** the development server
4. **Clear browser cache** and refresh

### **Common Commands:**
```bash
# Restart development server
Ctrl+C
npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build
```

---

## ✅ **You're Ready When:**
- [ ] App runs without errors
- [ ] You can register/login
- [ ] All pages load correctly
- [ ] Mobile view works
- [ ] Ready to start development!

**🎉 Congratulations! LiftLink is now running on your machine!**

**Next**: Follow the `IMMEDIATE_PRIORITIES.md` for your development roadmap.
