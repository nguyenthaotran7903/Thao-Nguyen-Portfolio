# 🚀 Thảo Nguyên Trần's Portfolio - Quick Start Card

## ✅ What You Got

A **professional portfolio website** built with **Next.js** showcasing:
- ✨ 6 major projects (research, risk analysis, data visualization)
- 💼 2 professional experiences (Hung Vuong University, Agribank)
- 🛠 50+ technical skills & methodologies  
- 🎓 Education & certifications
- 🔍 Search & filter projects by keyword/tag
- 📱 Mobile-responsive design
- 🌙 Dark mode support
- ⚡ Fast, SEO-optimized

---

## 📦 Files You Received

```
thao-portfolio/
├── data.json                 👈 EDIT THIS for content
├── app/page.jsx             (Main component)
├── app/page.module.css      (Styling)
├── app/layout.jsx
├── app/globals.css
├── package.json
├── next.config.js
├── .gitignore
├── README.md                (Full guide)
└── [Done! Ready to use]
```

---

## 🎯 5-Minute Setup

### Step 1: Prerequisites
```bash
# Download & install Node.js from nodejs.org (choose LTS)
# Then verify:
node --version    # Should show v18+ or v20+
npm --version     # Should show 9+
```

### Step 2: Install & Run
```bash
cd thao-portfolio
npm install       # Takes 1-2 min
npm run dev       # Starts server
# Open: http://localhost:3000
```

### Step 3: Edit Content
1. Open `data.json`
2. Update `profile`, `experience`, `projects`, `skills`
3. Save → Browser auto-refreshes

### Step 4: Deploy (Free!)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thao-portfolio.git
git push -u origin main
```

Then:
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Click "Deploy"
5. **Your site is live!** 🎉

Domain: `https://thao-portfolio.vercel.app`

---

## 📝 Content Structure (data.json)

### Profile Section
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your.email@gmail.com",
    "linkedin": "https://linkedin.com/in/...",
    "bio": "Your bio here..."
  }
}
```

### Add a Project
```json
{
  "id": 7,
  "title": "Project Title",
  "category": "Category",
  "year": 2024,
  "context": "Brief description",
  "methodology": ["Step 1", "Step 2"],
  "results": ["Result 1", "Result 2"],
  "tools": ["Python", "SQL"],
  "tags": ["tag1", "tag2"]
}
```

### Update Skills
```json
{
  "technical_tools": {
    "programming": ["Python", "R", "SQL"],
    "data_visualization": ["Power BI", "Plotly"]
  }
}
```

---

## 🎨 Quick Customization

### Change Colors
Edit `app/page.module.css`:
```css
.name {
  color: #0066cc;  /* Change to your color */
}

.skillBadge {
  background: linear-gradient(135deg, #0066cc, #0052a3);
  /* Update this gradient */
}
```

### Font Sizes
```css
.name {
  font-size: 48px;  /* Header */
}

.bio {
  font-size: 16px;  /* Body text */
}
```

### Add a New Section
Edit `app/page.jsx`:
1. Add new tab button
2. Add content block
3. Update data.json with new data

---

## 🔧 Common Edits

| Want to... | Edit File | What to Change |
|---|---|---|
| Change your name | data.json | `profile.name` |
| Add a project | data.json | Add to `projects` array |
| Update skills | data.json | `skills` object |
| Change colors | page.module.css | Color values |
| Add a section | page.jsx | Add tab + content |
| Update experience | data.json | `experience` array |
| Fix grammar | data.json | Text fields |

---

## 🚨 Troubleshooting

### "npm command not found"
→ Install Node.js from nodejs.org

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "JSON syntax error"
→ Check data.json at https://jsonlint.com

### "Deployment failed"
1. Check GitHub push succeeded: `git log`
2. Check Vercel logs (you'll see error there)
3. Commit & push again

---

## 📊 Features Showcase

✅ **Responsive** — Works on mobile, tablet, desktop  
✅ **Dark Mode** — Automatic light/dark theme  
✅ **Search** — Find projects by title or keyword  
✅ **Filter** — Filter by tags (machine-learning, fraud-detection, etc.)  
✅ **Fast** — Next.js optimization  
✅ **SEO** — Good for Google ranking  
✅ **Free Hosting** — Vercel (no cost)  
✅ **Easy Updates** — Just edit JSON  

---

## 🌐 Your Domain

After deploying on Vercel:
- **Default**: `https://thao-portfolio.vercel.app`
- **Custom domain**: Buy one, connect in Vercel settings

---

## 📈 Next Steps

1. ✅ Download all files
2. ✅ Run `npm install && npm run dev`
3. ✅ Edit `data.json` with your info
4. ✅ Test locally at http://localhost:3000
5. ✅ Push to GitHub & deploy to Vercel
6. ✅ Share your portfolio link with recruiters!

---

## 💬 Support

- **Full README**: Check `README.md` in the project
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **CSS Guide**: https://developer.mozilla.org/en-US/docs/Web/CSS

---

## ✨ Pro Tips

1. **Use descriptive project titles** — Helps with SEO
2. **Include metrics in results** — "F1 = 97.5%" looks better than "Good results"
3. **Keep descriptions under 200 chars** — Mobile readability
4. **Update regularly** — Add new projects quarterly
5. **Share portfolio URL** — LinkedIn, GitHub, email signature

---

**Created:** May 2024  
**Built with:** Next.js 14 + React 18 + Vercel  
**For:** Thảo Nguyên Trần - Data Analyst & Risk Management Specialist

**Good luck! 🚀**
