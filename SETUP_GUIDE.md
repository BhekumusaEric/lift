# LiftLink Setup Guide
## Get Your Development Environment Running

### 🚀 **Prerequisites**

#### **1. Install Node.js**
- Go to [https://nodejs.org/](https://nodejs.org/)
- Download and install the **LTS version** (recommended)
- Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### **2. Install Git (if not already installed)**
- Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Mac: `brew install git` or download from git-scm.com
- Linux: `sudo apt install git` or equivalent

#### **3. Code Editor**
- **VS Code** (recommended): [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Install these extensions:
  - TypeScript and JavaScript Language Features
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - Auto Rename Tag

---

### 🛠 **Project Setup**

#### **Step 1: Install Dependencies**
```bash
# Navigate to the frontend directory
cd liftlink-frontend

# Install all dependencies
npm install

# If you get errors, try:
npm install --legacy-peer-deps
```

#### **Step 2: Environment Configuration**
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your actual values
```

**Required API Keys:**

1. **Supabase** (Database & Auth)
   - Go to [https://supabase.com/](https://supabase.com/)
   - Create a free account
   - Create a new project
   - Go to Settings → API
   - Copy your Project URL and anon public key

2. **Google Maps** (Optional for now)
   - Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create a project
   - Enable Maps JavaScript API
   - Create credentials (API key)

3. **Stripe** (For payments - can skip initially)
   - Go to [https://stripe.com/](https://stripe.com/)
   - Create account
   - Get test API keys from dashboard

#### **Step 3: Database Setup**
```bash
# If you have Supabase CLI installed:
npx supabase start

# Or manually run the SQL migrations in Supabase dashboard:
# Go to SQL Editor and run the files in supabase/migrations/
```

#### **Step 4: Start Development Server**
```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)

---

### 🔧 **Common Issues & Solutions**

#### **Issue: "npm is not recognized"**
**Solution**: Node.js not installed properly
- Reinstall Node.js from official website
- Restart your terminal/command prompt
- Make sure to check "Add to PATH" during installation

#### **Issue: "Module not found" errors**
**Solution**: Dependencies not installed
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### **Issue: Supabase connection errors**
**Solution**: Check environment variables
- Make sure .env.local exists
- Verify your Supabase URL and key are correct
- Check for typos in variable names

#### **Issue: Port 3000 already in use**
**Solution**: Use different port
```bash
npm run dev -- -p 3001
```

---

### 📱 **Testing Your Setup**

#### **1. Basic Functionality Test**
- [ ] App loads without errors
- [ ] Navigation works
- [ ] Registration form appears
- [ ] No console errors in browser

#### **2. Database Connection Test**
- [ ] Can create an account
- [ ] Can log in/out
- [ ] Profile data saves
- [ ] No authentication errors

#### **3. UI/UX Test**
- [ ] Responsive on mobile
- [ ] All buttons work
- [ ] Forms validate properly
- [ ] Loading states appear

---

### 🚀 **Next Steps After Setup**

#### **Week 1 Priorities**
1. **Fix any setup issues**
2. **Add sample data** for testing
3. **Implement payment integration**
4. **Add real-time notifications**
5. **Improve mobile responsiveness**

#### **Development Workflow**
```bash
# Daily development routine
git pull origin main          # Get latest changes
npm run dev                   # Start development server
# Make your changes
npm run build                 # Test production build
git add .                     # Stage changes
git commit -m "Description"   # Commit changes
git push origin main          # Push to repository
```

#### **Code Quality Checks**
```bash
# Check for TypeScript errors
npm run build

# Run linting
npm run lint

# Format code
npx prettier --write .
```

---

### 📊 **Development Milestones**

#### **Week 1: Foundation**
- [ ] Development environment working
- [ ] All core pages load without errors
- [ ] Basic user authentication works
- [ ] Database connection established
- [ ] Mobile responsiveness improved

#### **Week 2: Core Features**
- [ ] Payment integration working
- [ ] Real-time notifications implemented
- [ ] Ride creation/search functional
- [ ] User profiles complete
- [ ] Safety features added

#### **Week 3: Polish**
- [ ] Professional design implemented
- [ ] Performance optimized
- [ ] All user flows tested
- [ ] Demo script prepared
- [ ] Beta users recruited

#### **Week 4: Launch Ready**
- [ ] All features working flawlessly
- [ ] Investor materials prepared
- [ ] User feedback collected
- [ ] Metrics tracking implemented
- [ ] Ready for funding discussions

---

### 🆘 **Getting Help**

#### **Technical Issues**
- Check the browser console for errors
- Look at the terminal output for server errors
- Search Stack Overflow for specific error messages
- Check the official documentation for each technology

#### **Resources**
- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Chakra UI**: [https://chakra-ui.com/docs](https://chakra-ui.com/docs)
- **TypeScript**: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)

#### **Community Support**
- Next.js Discord
- Supabase Discord
- Stack Overflow
- GitHub Issues

---

### ✅ **Ready to Start?**

1. **Install Node.js** from nodejs.org
2. **Open terminal** in your project directory
3. **Run `npm install`** in liftlink-frontend folder
4. **Copy and configure** .env.local file
5. **Run `npm run dev`** to start development
6. **Open browser** to http://localhost:3000

**You're ready to build the future of ride-sharing! 🚗💨**
