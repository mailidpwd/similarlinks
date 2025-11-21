"""
Multi-platform search functionality
Searches for products across multiple Indian e-commerce platforms
"""

from typing import List, Dict
import asyncio
from scraper_api import search_product_scraperapi


async def get_multi_platform_links(product_name: str, brand: str, current_platform: str = "amazon") -> List[Dict]:
    """
    Search for product across multiple platforms (Amazon, Flipkart, etc.)
    Returns list of sellers with links and prices
    """
    sellers = []
    search_query = f"{brand} {product_name}".strip()
    
    print(f"🔍 Multi-platform search: {search_query} (current: {current_platform})")
    
    # List of platforms to search (excluding current platform)
    platforms_to_search = []
    
    if current_platform != "amazon":
        platforms_to_search.append(("amazon", "https://www.amazon.in/s?k="))
    if current_platform != "flipkart":
        platforms_to_search.append(("flipkart", "https://www.flipkart.com/search?q="))
    
    # Always add search links for other platforms (even if we can't scrape them)
    other_platforms = [
        ("Meesho", "https://www.meesho.com/search?q=", "🏪"),
        ("Snapdeal", "https://www.snapdeal.com/search?keyword=", "🛍️"),
        ("JioMart", "https://www.jiomart.com/search/", "🏬"),
        ("Myntra", "https://www.myntra.com/", "👔"),
        ("Ajio", "https://www.ajio.com/search/?text=", "👗"),
        ("Tata Cliq", "https://www.tatacliq.com/search/", "🏢"),
    ]
    
    # Search Amazon and Flipkart using ScraperAPI
    search_tasks = []
    for platform, base_url in platforms_to_search:
        task = search_product_scraperapi(search_query, platform)
        search_tasks.append((platform, base_url, task))
    
    # Execute searches in parallel
    if search_tasks:
        results = await asyncio.gather(
            *[task for _, _, task in search_tasks],
            return_exceptions=True
        )
        
        for (platform, base_url, _), result in zip(search_tasks, results):
            if isinstance(result, Exception):
                print(f"⚠️  Search failed for {platform}: {str(result)}")
                # Add search URL as fallback
                sellers.append({
                    "platform": platform.capitalize(),
                    "url": f"{base_url}{search_query.replace(' ', '+')}",
                    "price": None,
                    "available": True,
                    "icon": "🛒" if platform == "flipkart" else "📦"
                })
            elif result:
                # Found product via ScraperAPI
                sellers.append({
                    "platform": platform.capitalize(),
                    "url": result.get("url", f"{base_url}{search_query.replace(' ', '+')}"),
                    "price": result.get("price", "Check price"),
                    "available": True,
                    "icon": "🛒" if platform == "flipkart" else "📦"
                })
            else:
                # No result, but add search link
                sellers.append({
                    "platform": platform.capitalize(),
                    "url": f"{base_url}{search_query.replace(' ', '+')}",
                    "price": None,
                    "available": True,
                    "icon": "🛒" if platform == "flipkart" else "📦"
                })
    
    # Add other platforms (search links only - no scraping)
    for platform_name, base_url, icon in other_platforms:
        search_url = f"{base_url}{search_query.replace(' ', '+')}"
        sellers.append({
            "platform": platform_name,
            "url": search_url,
            "price": None,
            "available": True,
            "icon": icon
        })
    
    print(f"✅ Multi-platform search complete: Found {len(sellers)} platforms")
    return sellers

