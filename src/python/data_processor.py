"""
Data processor for DeadlockHelper
Main script for fetching and processing Deadlock API data
"""

import sys
import json
import http.client
import argparse
import socket
from typing import Dict, Any, Optional

# Base URL for Deadlock API
DEADLOCK_API_BASE = "assets.deadlock-api.com"
DEADLOCK_API_V1_BASE = "api.deadlock-api.com"

# Timeout for API requests (5 seconds)
REQUEST_TIMEOUT = 5


def check_api_status() -> Dict[str, Any]:
    """
    Perform a lightweight health check on the Deadlock API.
    Uses /v2/heroes endpoint for minimal data transfer.
    
    Returns:
        Dictionary containing API health status
    """
    conn = None
    try:
        conn = http.client.HTTPSConnection(DEADLOCK_API_BASE, timeout=REQUEST_TIMEOUT)
        headers = {'Accept': 'application/json'}
        
        conn.request("GET", "/v2/heroes", headers=headers)
        res = conn.getresponse()
        
        if res.status == 200:
            return {
                "success": True,
                "status": "healthy",
                "status_code": 200
            }
        elif res.status >= 500:
            return {
                "success": False,
                "status": "api_error",
                "code": 503,
                "error": f"API returned status {res.status}",
                "status_code": res.status
            }
        else:
            return {
                "success": False,
                "status": "api_error",
                "code": res.status,
                "error": f"API returned status {res.status}",
                "status_code": res.status
            }
    
    except socket.timeout:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": "Request timeout",
            "status_code": 503
        }
    except (ConnectionError, OSError) as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Connection failed: {str(e)}",
            "status_code": 503
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Failed to parse JSON: {str(e)}",
            "status_code": 503
        }
    except Exception as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Request failed: {str(e)}",
            "status_code": 503
        }
    finally:
        if conn:
            conn.close()


def fetch_items(item_id_or_class: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetch items from Deadlock API
    
    Args:
        item_id_or_class: Optional item ID or class name to fetch specific item
        
    Returns:
        Dictionary containing API response
    """
    conn = None
    headers = {'Accept': '*/*'}
    
    try:
        conn = http.client.HTTPSConnection(DEADLOCK_API_BASE, timeout=REQUEST_TIMEOUT)
        
        # Build endpoint
        if item_id_or_class:
            endpoint = f"/v2/items/{item_id_or_class}"
        else:
            endpoint = "/v2/items"
        
        conn.request("GET", endpoint, headers=headers)
        res = conn.getresponse()
        
        if res.status != 200:
            if res.status >= 500:
                return {
                    "success": False,
                    "status": "api_error",
                    "code": 503,
                    "error": f"API returned status {res.status}",
                    "status_code": res.status
                }
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
    
    except socket.timeout:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": "Request timeout",
            "status_code": 503
        }
    except (ConnectionError, OSError) as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Connection failed: {str(e)}",
            "status_code": 503
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Failed to parse JSON: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Request failed: {str(e)}",
            "status_code": 503
        }
    finally:
        if conn:
            conn.close()



def fetch_match_metadata(match_id: str) -> Dict[str, Any]:
    """
    Fetch match metadata from Deadlock API
    
    Args:
        match_id: Match ID to fetch
        
    Returns:
        Dictionary containing API response
    """
    conn = None
    headers = {'Accept': 'application/json'}
    
    try:
        conn = http.client.HTTPSConnection(DEADLOCK_API_V1_BASE, timeout=REQUEST_TIMEOUT)
        endpoint = f"/v1/matches/{match_id}/metadata"
        conn.request("GET", endpoint, headers=headers)
        res = conn.getresponse()
        
        if res.status != 200:
            if res.status >= 500:
                return {
                    "success": False,
                    "status": "api_error",
                    "code": 503,
                    "error": f"API returned status {res.status}",
                    "status_code": res.status
                }
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
    
    except socket.timeout:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": "Request timeout",
            "status_code": 503
        }
    except (ConnectionError, OSError) as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Connection failed: {str(e)}",
            "status_code": 503
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Failed to parse JSON: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "status": "api_error",
            "code": 503,
            "error": f"Request failed: {str(e)}",
            "status_code": 503
        }
    finally:
        if conn:
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
                       help='Query type: items, match, etc.')
    parser.add_argument('--param', type=str, default=None,
                       help='Optional parameter (e.g., item ID or match_id)')
    parser.add_argument('--health-check', action='store_true',
                       help='Perform API health check')

    args = parser.parse_args()

    try:
        # Health check mode
        if args.health_check:
            health_status = check_api_status()
            print(json.dumps(health_status, indent=2))
            return

        # Fetch data based on query type — always hits the real API
        if args.query == 'items':
            raw_data = fetch_items(args.param)
        elif args.query == 'match':
            # Real API call — works for both live matches and demo mode (real match IDs)
            # Demo mode match IDs: 80659633, 83547202, 80457157
            # Production: deadlock.exe -steam -console (S:\common\Deadlock\game\bin\win64\deadlock.exe)
            match_id = args.param or '54980378'
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
