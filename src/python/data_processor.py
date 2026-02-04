"""
Data processor for DeadlockHelper
Main script for fetching and processing Deadlock API data
"""

import sys
import json
import http.client
import argparse
import random
from typing import Dict, Any, Optional

# Base URL for Deadlock API
DEADLOCK_API_BASE = "assets.deadlock-api.com"
DEADLOCK_API_V1_BASE = "api.deadlock-api.com"


def fetch_items(item_id_or_class: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetch items from Deadlock API
    
    Args:
        item_id_or_class: Optional item ID or class name to fetch specific item
        
    Returns:
        Dictionary containing API response
    """
    conn = http.client.HTTPSConnection(DEADLOCK_API_BASE)
    headers = {'Accept': '*/*'}
    
    try:
        # Build endpoint
        if item_id_or_class:
            endpoint = f"/v2/items/{item_id_or_class}"
        else:
            endpoint = "/v2/items"
        
        conn.request("GET", endpoint, headers=headers)
        res = conn.getresponse()
        
        if res.status != 200:
            return {
                "success": False,
                "error": f"API returned status {res.status}",
                "status_code": res.status
            }
        
        data = res.read()
        json_data = json.loads(data.decode("utf-8"))
        
        return {
            "success": True,
            "data": json_data,
            "status_code": res.status
        }
    
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Failed to parse JSON: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Request failed: {str(e)}"
        }
    finally:
        conn.close()


def generate_mock_match_data() -> Dict[str, Any]:
    """
    Generate mock match data for testing UI without API calls.
    Returns a JSON structure compatible with /v1/matches/{match_id}/metadata
    
    Returns:
        Dictionary containing mock match data with 12 players
    """
    # Hero names for variety (ensuring different heroes per player)
    hero_names = [
        "Wraith", "Seven", "Kelvin", "Dynamo", "Vindicta",
        "Mako", "Lash", "Warden", "Viscous", "Ivy", "Ghost", "Tengu"
    ]
    
    # Generate 12 players (6 per team)
    players = []
    used_heroes = []  # Track used heroes to ensure variety
    
    # Team 0 (slots 0-5): Yellow, Blue, Green lanes
    # Team 1 (slots 6-11): Yellow, Blue, Green lanes
    lane_map = {0: 'yellow', 1: 'blue', 2: 'green'}
    
    for slot in range(12):
        team = 0 if slot < 6 else 1
        team_slot = slot if slot < 6 else slot - 6
        
        # Assign lanes: 2 players per lane per team
        # Team 0: slots 0,1=yellow, 2,3=blue, 4,5=green
        # Team 1: slots 6,7=yellow, 8,9=blue, 10,11=green
        if team_slot < 2:
            assigned_lane = 0  # yellow
            lane = 'yellow'
        elif team_slot < 4:
            assigned_lane = 1  # blue
            lane = 'blue'
        else:
            assigned_lane = 2  # green
            lane = 'green'
        
        # Varied stats for testing
        kills = random.randint(0, 15)
        deaths = random.randint(0, 10)
        assists = random.randint(0, 20)
        level = random.randint(1, 25)
        rank = random.randint(10, 116)  # Badge range
        
        # Calculate KDA ratio
        kda_ratio = round((kills + assists) / max(deaths, 1), 2)
        kda_string = f"{kills}/{deaths}/{assists}"
        
        # Select a hero that hasn't been used yet (with fallback)
        available_heroes = [h for h in hero_names if h not in used_heroes]
        if not available_heroes:
            available_heroes = hero_names
        hero_name = random.choice(available_heroes)
        used_heroes.append(hero_name)
        
        player = {
            "account_id": 100000000 + slot,  # Mock account IDs
            "player_slot": slot,
            "hero_id": 1000 + slot,
            "hero_name": hero_name,
            "team": team,
            "assigned_lane": assigned_lane,
            "lane": lane,
            "kills": kills,
            "deaths": deaths,
            "assists": assists,
            "kda": kda_string,
            "kda_ratio": kda_ratio,
            "level": level,
            "net_worth": random.randint(5000, 50000),
            "rank": rank,
            "name": f"Player{slot + 1}",
            "winrate": round(random.uniform(40.0, 65.0), 1),
            "total_matches": random.randint(50, 500),
            "last_hits": random.randint(50, 300),
            "denies": random.randint(0, 50),
            "ability_points": random.randint(0, 25)
        }
        players.append(player)
    
    # Create mock match data structure
    mock_data = {
        "success": True,
        "data": {
            "match_info": {
                "match_id": 54980378,
                "duration_s": random.randint(1200, 2400),
                "winning_team": random.randint(0, 1),
                "game_mode": "normal",
                "players": players
            },
            "teams": [
                {"team": 0, "team_tracked_stats": []},
                {"team": 1, "team_tracked_stats": []}
            ],
            "average_badge_team0": 85,
            "average_badge_team1": 87
        },
        "status_code": 200
    }
    
    return mock_data


def fetch_match_metadata(match_id: str) -> Dict[str, Any]:
    """
    Fetch match metadata from Deadlock API
    
    Args:
        match_id: Match ID to fetch
        
    Returns:
        Dictionary containing API response
    """
    conn = http.client.HTTPSConnection(DEADLOCK_API_V1_BASE)
    headers = {'Accept': 'application/json'}
    
    try:
        endpoint = f"/v1/matches/{match_id}/metadata"
        conn.request("GET", endpoint, headers=headers)
        res = conn.getresponse()
        
        if res.status != 200:
            return {
                "success": False,
                "error": f"API returned status {res.status}",
                "status_code": res.status
            }
        
        data = res.read()
        json_data = json.loads(data.decode("utf-8"))
        
        return {
            "success": True,
            "data": json_data,
            "status_code": res.status
        }
    
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Failed to parse JSON: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Request failed: {str(e)}"
        }
    finally:
        conn.close()


def process_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process and clean raw API data
    
    Args:
        raw_data: Raw data from API
        
    Returns:
        Processed and cleaned data
    """
    if not raw_data.get("success"):
        return raw_data
    
    # Extract and format items data
    items = raw_data.get("data", [])
    
    # Process items (simplified - can be extended based on needs)
    # Take the last 10 items instead of first 10 (more recent items with better icons)
    processed_items = []
    total_items = len(items)
    start_index = max(0, total_items - 120)  # Start from last 10 items
    
    for item in items[start_index:]:
        processed_item = {
            "id": item.get("id"),
            "name": item.get("name"),
            "class_name": item.get("class_name"),
            "image": item.get("image"),
            "image_webp": item.get("image_webp"),
            "heroes": item.get("heroes", []),
        }
        processed_items.append(processed_item)
    
    return {
        "success": True,
        "data": {
            "items": processed_items,
            "total_count": len(items),
            "returned_count": len(processed_items)
        },
        "status_code": raw_data.get("status_code", 200)
    }


def main():
    """
    Main entry point for the data processor
    Accepts command line arguments for query type and parameters
    """
    parser = argparse.ArgumentParser(description='Deadlock API Data Processor')
    parser.add_argument('--query', type=str, default='items', 
                       help='Query type: items, item, heroes, match, etc.')
    parser.add_argument('--param', type=str, default=None,
                       help='Optional parameter (e.g., item ID, class name, or match_id)')
    parser.add_argument('--mock', action='store_true',
                       help='Use mock data instead of calling the API')
    
    args = parser.parse_args()
    
    try:
        # If mock mode is enabled, return mock data
        if args.mock:
            if args.query == 'match':
                mock_data = generate_mock_match_data()
                print(json.dumps(mock_data, indent=2))
                return
            else:
                # For other queries in mock mode, return a simple mock response
                mock_data = {
                    "success": True,
                    "data": {"message": "Mock mode enabled"},
                    "status_code": 200
                }
                print(json.dumps(mock_data, indent=2))
                return
        
        # Fetch data based on query type
        if args.query == 'items':
            raw_data = fetch_items(args.param)
        elif args.query == 'match':
            # Fetch match metadata
            match_id = args.param or '54980378'  # Default to example match ID
            raw_data = fetch_match_metadata(match_id)
        else:
            raw_data = {
                "success": False,
                "error": f"Unknown query type: {args.query}"
            }
        
        # Process the data (only for items, match data is returned as-is)
        if args.query == 'items' and raw_data.get("success"):
            processed_data = process_data(raw_data)
        else:
            processed_data = raw_data
        
        # Output JSON to stdout (for Electron to read)
        print(json.dumps(processed_data, indent=2))
        
    except Exception as e:
        error_response = {
            "success": False,
            "error": f"Processing failed: {str(e)}"
        }
        print(json.dumps(error_response, indent=2))
        sys.exit(1)


if __name__ == '__main__':
    main()
