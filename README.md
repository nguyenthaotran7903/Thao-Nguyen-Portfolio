# Thảo Nguyên Trần - Data Analyst Portfolio

Professional portfolio website showcasing data analysis projects, experience, and technical expertise in risk management, machine learning, and quantitative research.

## 🌐 Live Demo
Your portfolio will be live at: `https://thao-portfolio.vercel.app` (after deployment)

---

## 📋 Project Structure

```
thao-portfolio/
├── app/
│   ├── page.jsx              # Main portfolio component
│   ├── page.module.css       # Styling (CSS Modules)
│   ├── layout.jsx            # Next.js layout
│   ├── globals.css           # Global styles
├── data.json                 # ⭐ YOUR CONTENT (EDIT THIS)
├── package.json              # Dependencies
├── next.config.js            # Next.js config
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Prerequisites
- **Node.js 16+** (download from [nodejs.org](https://nodejs.org/))
- **Git** (for version control)

### 2️⃣ Local Setup

```bash
# Clone or download the project
cd thao-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open: **http://localhost:3000**

### 3️⃣ Deploy to Vercel (Free & Easy)

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thao-portfolio.git
git push -u origin main
```

Then:
1. Go to https://vercel.com
2. Click "New Project"
3. Connect your GitHub repository
4. Click "Deploy"
5. Your site is live! 🎉

**Your domain:** `https://thao-portfolio.vercel.app` (custom domain coming soon)

---

## ✏️ How to Update Your Portfolio

### 📝 Editing Content

All your portfolio content is in **`data.json`**. No need to touch code!

#### **Update Your Profile**
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "tagline": "Your tagline",
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/your-profile",
    "bio": "Your bio here..."
  }
}
```

#### **Add a New Project**

Open `data.json`, find the `"projects"` array, and add:

```json
{
  "id": 7,
  "title": "Your Project Title",
  "category": "Data Analytics",
  "type": "Published Paper",
  "year": 2024,
  "context": "Brief description of the project...",
  "methodology": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "results": [
    "Key result 1",
    "Key result 2"
  ],
  "tools": ["Python", "SQL", "Power BI"],
  "tags": ["machine-learning", "data-analysis"],
  "link": "https://github.com/..."
}
```

#### **Update Skills**

Find `"skills"` in `data.json` and update sections:

```json
"technical_tools": {
  "programming": ["Python", "R", "SQL", "Excel"],
  "data_visualization": ["Power BI", "Tableau", "Plotly"]
}
```

#### **Add Work Experience**

```json
"experience": [
  {
    "id": 3,
    "title": "Your Job Title",
    "company": "Company Name",
    "period": "Month Year - Month Year",
    "highlights": [
      "Achievement 1",
      "Achievement 2"
    ]
  }
]
```

---

## 🎨 Customization

### Change Colors

Edit `app/page.module.css`:

```css
.name {
  color: #0066cc;  /* Change to your brand color */
}

.skillBadge {
  background: linear-gradient(135deg, #0066cc, #0052a3);
  /* Update gradient colors */
}
```

Common color codes:
- **Blue**: `#0066cc`
- **Purple**: `#6a1b9a`
- **Green**: `#2e7d32`
- **Orange**: `#e65100`

### Adjust Typography

In `page.module.css`:

```css
.name {
  font-size: 48px;  /* Larger or smaller header */
}

.bio {
  font-size: 16px;  /* Adjust body text */
}
```

### Add Sections

Want to add a "Blog" or "Certifications" section? Edit `app/page.jsx`:

1. Add new tab in navigation
2. Add content section
3. Update `data.json` with new data

---

## 📊 Features

✅ **Clean, Professional Design** — Mobile-responsive, modern UI  
✅ **Dark Mode Support** — Automatic light/dark theme  
✅ **Search & Filter** — Find projects by keyword or tag  
✅ **SEO Optimized** — Good for Google search results  
✅ **Fast Performance** — Next.js optimization  
✅ **Easy Updates** — Just edit JSON, no code needed  
✅ **Free Hosting** — Deployed on Vercel (no cost)  
✅ **Version Control** — Git/GitHub integration  

---

## 🔧 Advanced Customization

### Add a Blog Section

1. Create `app/blog/page.jsx`
2. Add blog posts to `data.json`
3. Add routing in navigation

Example:

```jsx
// Add to app/page.jsx navigation
<button onClick={() => setActiveTab('blog')}>Blog</button>

// Then add blog content section
{activeTab === 'blog' && (
  <section>
    {data.blog.map(post => (
      <article key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </article>
    ))}
  </section>
)}
```

### Custom Domain

1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Vercel dashboard → Project Settings → Domains
3. Add your domain
4. Follow DNS configuration steps

### Analytics

Add Google Analytics:

1. Create account at [google.com/analytics](https://google.com/analytics)
2. Get Measurement ID
3. Add to `layout.jsx`:

```jsx
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR_ID');`}</script>
```

---

## 🐛 Troubleshooting

### "Module not found" error
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### JSON syntax error
- Check for missing commas in `data.json`
- Use [JSONLint](https://jsonlint.com) to validate

### Deployment fails
- Push to GitHub: `git push origin main`
- Check Vercel logs for errors
- Ensure `package.json` exists

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
# Or kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

---

## 📈 Next Steps

1. ✅ **Customize** — Update `data.json` with your info
2. ✅ **Test locally** — Run `npm run dev`
3. ✅ **Push to GitHub** — Create repository
4. ✅ **Deploy on Vercel** — Free hosting
5. ✅ **Share** — Send portfolio link to recruiters!

---

## 🎯 SEO Tips

To improve search rankings:

1. **Add meta tags** in `layout.jsx`:
```jsx
export const metadata = {
  title: 'Your Name - Data Analyst Portfolio',
  description: 'Experienced data analyst in machine learning and risk management...',
  keywords: 'data analysis, machine learning, python, sql'
};
```

2. **Add structured data** (JSON-LD) for better Google indexing

3. **Use descriptive project titles** — helps with search

4. **Include keywords** in descriptions naturally

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **CSS Guide**: https://developer.mozilla.org/en-US/docs/Web/CSS

---

## 📄 License

This portfolio template is free to use and modify for your personal projects.

---

## ✨ Built With

- **Next.js 14** — React framework
- **CSS Modules** — Scoped styling
- **Vercel** — Hosting platform
- **GitHub** — Version control

---

**Last Updated:** May 2024  
**Created for:** Thảo Nguyên Trần

Good luck with your portfolio! 🚀
