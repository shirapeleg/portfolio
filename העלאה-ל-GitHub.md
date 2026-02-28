# העלאת האתר לאינטרנט עם GitHub Pages

## שלב 1: חשבון GitHub
אם עדיין אין לך חשבון – הירשמי ב-[github.com](https://github.com).

---

## שלב 2: יצירת Repository חדש ב-GitHub
1. היכנסי ל-GitHub ולחצי על **"+"** למעלה מימין → **"New repository"**.
2. **Repository name:** בחרי שם (למשל: `shira-peleg-portfolio` או `my-website`).
3. **Public** – סמני.
4. **אל תסמני** "Add a README" – הפרויקט כבר קיים אצלך במחשב.
5. לחצי **"Create repository"**.

---

## שלב 3: חיבור הפרויקט ל-GitHub והעלאה
פתחי **Terminal** (טרמינל) ועברי לתיקיית הפרויקט:

```bash
cd "/Users/shirapeleg/Documents/לימודים/תיק עבודות לקרסר/prot2"
```

**פעם ראשונה עם Git?** הרצי קודם (עם השם והאימייל שלך):
```bash
git config --global user.email "shirapeleg98@gmail.com"
git config --global user.name "Shira Peleg"
```

אז הרצי את הפקודות הבאות. **החלפי רק את `YOUR-USERNAME`** בשם המשתמש שלך ב-GitHub (ה-repo שלך: **shirapelegportfolio**):

```bash
git add .
git commit -m "First commit - portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/shirapelegportfolio.git
git push -u origin main
```

אם יתבקש – הזיני שם משתמש וסיסמה (או Personal Access Token) של GitHub.

---

## שלב 4: הפעלת GitHub Pages
1. ב-GitHub, נכנסי ל-**Repository** שיצרת.
2. **Settings** (הגדרות) → בתפריט השמאלי: **Pages**.
3. תחת **"Build and deployment"**:
   - **Source:** בחרי **"Deploy from a branch"**.
   - **Branch:** בחרי **main** ותיקייה **/ (root)**.
4. לחצי **Save**.

אחרי דקה־שתיים האתר יהיה זמין בכתובת:

**https://YOUR-USERNAME.github.io/shirapelegportfolio/**

(למשל אם שם המשתמש שלך הוא shirapeleg98: `https://shirapeleg98.github.io/shirapelegportfolio/`)

---

## עדכונים עתידיים
אחרי שתשני קבצים בפרויקט, העלאה מחדש:

```bash
cd "/Users/shirapeleg/Documents/לימודים/תיק עבודות לקרסר/prot2"
git add .
git commit -m "תיאור העדכון"
git push
```

GitHub Pages יתעדכן אוטומטית אחרי ה-push.
