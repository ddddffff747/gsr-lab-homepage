#!/usr/bin/env python3
"""
Google Scholar Data Updater (Simple Version)
Directly scrapes citation count and h-index from Google Scholar profile page
"""

import json
import os
import re
from datetime import datetime
import requests
from bs4 import BeautifulSoup

def get_scholar_data(user_id):
    """Fetch Google Scholar data by scraping the profile page directly."""
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the stats table (citations, h-index, i10-index)
        # The table has class "gsc_rsb_std" for the values
        stats = soup.find_all('td', class_='gsc_rsb_std')

        if len(stats) >= 2:
            # First row: Citations (All, Since 2020)
            # Second row: h-index (All, Since 2020)
            citations = int(stats[0].text.strip())
            h_index = int(stats[2].text.strip())  # Index 2 is h-index (All)

            print(f"Found stats - Citations: {citations}, h-index: {h_index}")

            return {
                'citations': citations,
                'hIndex': h_index
            }
        else:
            print("Could not find stats table on the page")
            return None

    except requests.RequestException as e:
        print(f"Error fetching page: {e}")
        return None
    except (ValueError, IndexError) as e:
        print(f"Error parsing data: {e}")
        return None

def update_json_file(data, filepath='scholar-data.json'):
    """Update the JSON file with new data."""
    user_id = os.environ.get('SCHOLAR_USER_ID', 's55YrBYAAAAJ')

    current_data = {
        'lastUpdated': datetime.utcnow().isoformat() + 'Z',
        'citations': data['citations'],
        'hIndex': data['hIndex'],
        'scholarUrl': f"https://scholar.google.co.kr/citations?user={user_id}&hl=ko"
    }

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(current_data, f, indent=2, ensure_ascii=False)

    print(f"Updated scholar-data.json:")
    print(f"  Citations: {current_data['citations']}")
    print(f"  h-index: {current_data['hIndex']}")
    print(f"  Last Updated: {current_data['lastUpdated']}")

def main():
    user_id = os.environ.get('SCHOLAR_USER_ID', 's55YrBYAAAAJ')

    print(f"Fetching data for Google Scholar user: {user_id}")
    data = get_scholar_data(user_id)

    if data:
        update_json_file(data)
        print("\nSuccessfully updated Google Scholar data!")
    else:
        print("Failed to fetch Google Scholar data. Keeping existing data.")
        exit(1)

if __name__ == '__main__':
    main()
