from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from .reddit_utils import get_recent_mentions
from .sentiment_analysis import analyze_sentiment
from supabase import create_client, Client
import os

app = FastAPI()

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] if you want to restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#@app.get("/recent-mentions")
# def get_recent_mentions():
#     return [
#         {
#             "id": 1,
#             "subreddit": "r/technology",
#             "title": "Anyone using AI tools?",
#             "author": "techuser123",
#             "sentiment": "neutral",
#             "score": 0.1,
#             "upvotes": 45,
#             "comments": 12,
#             "timeAgo": "23m ago",
#             "status": "neutral",
#             "keywords": ["AI", "tools", "recommendation"]
#         }
#     ]


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.get("/recent-mentions")
def recent_mentions():
    subreddits = ["SaaS", "technology", "startups"]
    keywords = ["Cleverbridge", "Merchant of Record", "MoR", "scaling"]
    results = get_recent_mentions(subreddits, keywords=keywords, limit=25)
    results = analyze_sentiment(results)  # Add sentiment and score to each post
    # Calculate average sentiment score
    avg_score = round(sum(post["score"] for post in results) / len(results), 2) if results else 0.0
    return {"posts": results, "average_sentiment": avg_score}



@app.post("/flag")
async def flag_post(request: Request):
    data = await request.json()
    post_id = data.get("id")
    supabase.table("flagged_posts").insert({"post_id": post_id}).execute()
    return {"success": True}

@app.get("/flagged")
def get_flagged():
    result = supabase.table("flagged_posts").select("post_id").execute()
    ids = [row["post_id"] for row in result.data]
    return ids

@app.post("/unflag")
async def unflag_post(request: Request):
    data = await request.json()
    post_id = data.get("id")
    supabase.table("flagged_posts").delete().eq("post_id", post_id).execute()
    return {"success": True}