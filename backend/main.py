from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from .reddit_utils import get_recent_mentions
from .sentiment_analysis import analyze_sentiment
from supabase import create_client, Client
from starlette.middleware.sessions import SessionMiddleware
import os
from .reddit_oauth import router as reddit_oauth_router

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




app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))

@app.get("/recent-mentions")
def recent_mentions():
    # Fetch monitored subreddits from Supabase
    result = supabase.table("monitored_subreddits").select("name").execute()
    subreddits = [row["name"] for row in result.data] if result.data else []
    
    # Fetch keywords from Supabase
    keywords_result = supabase.table("keywords").select("name").execute()
    keywords = [row["name"] for row in keywords_result.data] if keywords_result.data else ["Cleverbridge", "Merchant of Record", "MoR", "scaling"]
    
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

@app.post("/monitored-subreddits")
async def add_monitored_subreddit(request: Request):
    data = await request.json()
    subreddit = data.get("subreddit")
    if subreddit:
        supabase.table("monitored_subreddits").insert({"name": subreddit}).execute()
        return {"success": True}
    return {"success": False, "error": "Missing subreddit"}

@app.delete("/monitored-subreddits/{subreddit}")
def remove_monitored_subreddit(subreddit: str):
    # Case-insensitive match for subreddit name
    result = supabase.table("monitored_subreddits").delete().ilike("name", subreddit).execute()
    # Always return success if request completes
    return {"success": True}

@app.get("/monitored-subreddits")
def get_monitored_subreddits():
    result = supabase.table("monitored_subreddits").select("name").execute()
    subreddits = [row["name"] for row in result.data]
    return subreddits

# Keywords management endpoints
@app.post("/keywords")
async def add_keyword(request: Request):
    data = await request.json()
    keyword = data.get("keyword")
    if keyword:
        supabase.table("keywords").insert({"name": keyword}).execute()
        return {"success": True}
    return {"success": False, "error": "Missing keyword"}

@app.delete("/keywords/{keyword}")
def remove_keyword(keyword: str):
    # Case-insensitive match for keyword name
    result = supabase.table("keywords").delete().ilike("name", keyword).execute()
    return {"success": True}

@app.get("/keywords")
def get_keywords():
    result = supabase.table("keywords").select("name").execute()
    keywords = [row["name"] for row in result.data]
    # Return default keywords if none are stored in database
    if not keywords:
        return ["Cleverbridge", "Merchant of Record", "MoR", "scaling"]
    return keywords

app.include_router(reddit_oauth_router)