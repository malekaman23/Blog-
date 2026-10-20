"""
One-time script: deletes ALL existing posts (the old sample articles)
and inserts one new, good, ready-to-publish article with a cover image.

Run from inside the backend/ folder:
    python reset_posts.py

No venv needed, no new packages needed — uses your existing app code.
"""

from datetime import datetime

from app.database import SessionLocal
from app.models.models import Post

CONTENT = """Everyone has heard that compound interest is "the eighth wonder of the world." Fewer people have actually sat down and watched the math do what it does. Once you see it, you stop treating your investments like a lottery ticket and start treating them like a machine that quietly does its job in the background.

## The simple version most people learn

Simple interest pays you a fixed amount every year, based only on what you originally put in. If you invest ₹1,00,000 at 10% simple interest, you earn ₹10,000 every single year — year 1, year 10, year 30, it never changes.

Compound interest is different. Instead of paying you based on your original amount, it pays you based on whatever your balance has grown to. That one shift — interest earning interest — is the entire trick.

## Watching it actually compound

Here's a tiny script that shows the difference over 30 years, investing ₹1,00,000 once at a 10% annual return:

```python
principal = 100_000
rate = 0.10
years = 30

simple_total = principal + (principal * rate * years)

compound_total = principal
for year in range(years):
    compound_total *= (1 + rate)

print(f"Simple interest after 30 years:   ₹{simple_total:,.0f}")
print(f"Compound interest after 30 years: ₹{compound_total:,.0f}")
```

Run that and you'll see simple interest gets you to ₹4,00,000. Compound interest gets you to roughly ₹17,45,000. Same starting amount, same rate, same number of years — more than 4x the outcome, purely because growth was allowed to build on growth.

## Why the first 10 years feel like nothing

This is the part that causes most people to give up too early. In year one, ₹1,00,000 at 10% only earns you ₹10,000 — barely noticeable. Even by year 10, you're still under ₹2,60,000, which doesn't feel dramatically different from what you put in.

The curve is flat for a long time before it isn't. Compounding is backloaded by nature: most of the growth happens in the final third of the timeline, not the first. If you check your portfolio every month expecting fireworks, you'll be disappointed for years before the effect becomes obvious. That's not a sign it's failing — it's a sign you're early.

## Time matters more than the amount

Consider two people. Investor A puts in ₹1,00,000 at age 25 and never adds another rupee. Investor B waits until 35 and invests ₹2,00,000 — double the amount — to try to catch up. Assuming the same 10% annual return, Investor A still ends up ahead by age 60, purely because those extra ten years of compounding were worth more than double the capital.

This is the single most useful takeaway from understanding compounding: starting early beats starting big. A rupee invested at 25 is worth more than a rupee invested at 35, not because of anything you did differently, but because it had more time to multiply on itself.

## Why SIPs lean on the same idea

A Systematic Investment Plan doesn't just average your purchase price across market ups and downs — it also means each instalment starts its own compounding clock the moment it's invested. Money you put in during year one has been compounding for the full stretch by the time you check your returns in year 20; money you put in last month has barely started. This is why long-running SIPs tend to reward patience far more than they reward trying to time the market.

## The practical takeaway

You don't need a finance degree to use this. You need three things: start as early as possible, stay invested long enough for the curve to bend upward, and resist the urge to interrupt it. The math in that script above isn't a simulation of some exotic strategy — it's exactly what a basic index fund or recurring deposit does over decades, with zero cleverness required.

Compounding doesn't reward the smartest investor in the room. It rewards the one who stayed in the room the longest.
"""

db = SessionLocal()

# 1. Remove every existing post (the old sample articles)
deleted = db.query(Post).delete()
db.commit()
print(f"Deleted {deleted} old post(s).")

# 2. Add one good new article, with a cover image
article = Post(
    slug="how-compound-interest-actually-works",
    title="How Compound Interest Actually Works (And Why Most People Get It Wrong)",
    category="finance",
    excerpt="Simple interest pays you a flat amount every year. Compound interest pays you based on what you've already grown to — and that one difference is worth more than most people realize.",
    pull_quote="Compounding doesn't reward the smartest investor in the room. It rewards the one who stayed in the room the longest.",
    content=CONTENT,
    image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    read_time=7,
    created_at=datetime.utcnow(),
)
db.add(article)
db.commit()
db.close()

print("Done. New article published: 'How Compound Interest Actually Works'")
