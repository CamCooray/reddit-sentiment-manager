from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .reddit_utils import get_recent_mentions
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

@app.get("/recent-mentions")
def recent_mentions():
    subreddits = ["SaaS", "technology", "startups"]
    keywords = ["Cleverbridge", "Merchant of Record", "MoR", "scaling"]
    results = get_recent_mentions(subreddits, keywords=keywords, limit=25)
    # Import get_recent_mentions from reddit_util
    #print(f"API returning {len(results)} mentions:", results)  # Add this for debugging
    return results
