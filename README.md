# סוכן.פרו — Live App POC (דמו)

אפליקציית הדגמה חיה: frontend + מסד נתונים + הזדהות + דיפלוי.

## מה זה מדגים
- **Auth**: כל סוכן רואה רק את הלקוחות שלו (סינון לפי session חתום HMAC).
- **DB**: SQLite אמיתי (`node:sqlite`) עם seed של נתוני דמו בלבד — לא קובץ JSON סטטי.
- **UI**: עיצוב weareboald (לבן/שחור, RTL עברית, צבע הדגשה יחיד).

## פרטי התחברות לדמו
| משתמש | סיסמה   | סוכן          |
|-------|---------|---------------|
| demo  | demo1234 | רונית לוי    |
| dani  | dani1234 | דני הרשלר    |

**אזהרה**: אלה סיסמאות דמו גלויות במסך הכניסה בכוונה. אין סיסמאות אמיתיות. אין PII אמיתי.

## הרצה מקומית
```bash
npm install
SESSION_SECRET=any-long-random npm run build
SESSION_SECRET=any-long-random npm run start
# → http://localhost:3100
```

## דיפלוי ל-Vercel
צריך `SESSION_SECRET` כמשתנה סביבה (encrypted) בפרויקט. אין secrets בקוד.
