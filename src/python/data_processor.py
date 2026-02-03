"""
Data processor for DeadlockHelper
Main script for fetching and processing Deadlock API data
"""

import sys
import json
import http.client
import argparse
from typing import Dict, Any, Optional

# Base URL for Deadlock API
DEADLOCK_API_BASE = "assets.deadlock-api.com"


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
                       help='Query type: items, item, heroes, etc.')
    parser.add_argument('--param', type=str, default=None,
                       help='Optional parameter (e.g., item ID or class name)')
    
    args = parser.parse_args()
    
    try:
        # Fetch data based on query type
        if args.query == 'items':
            raw_data = fetch_items(args.param)
        else:
            raw_data = {
                "success": False,
                "error": f"Unknown query type: {args.query}"
            }
        
        # Process the data
        if raw_data.get("success"):
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
