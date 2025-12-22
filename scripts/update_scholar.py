#!/usr/bin/env python3
"""
Google Scholar Data Updater
Fetches citation count, h-index, and publications from Google Scholar profile
"""

import json
import os
from datetime import datetime
from scholarly import scholarly

def get_scholar_data(user_id):
    """Fetch Google Scholar data for a specific user."""
    try:
        # Search for author by ID
        author = scholarly.search_author_id(user_id)
        author = scholarly.fill(author, sections=['basics', 'indices', 'publications'])

        return {
            'citations': author.get('citedby', 0),
            'hIndex': author.get('hindex', 0),
            'name': author.get('name', 'Unknown'),
            'publications': author.get('publications', [])
        }
    except Exception as e:
        print(f"Error fetching scholar data: {e}")
        return None

def categorize_publication(pub):
    """Categorize publication as international journal, korean journal, or conference."""
    venue = pub.get('bib', {}).get('venue', '').lower()
    title = pub.get('bib', {}).get('title', '')

    # Korean journals
    korean_keywords = ['한국', 'korean', 'ksce', 'kgs', 'kes', '대한토목', '지반공학', '터널']
    for keyword in korean_keywords:
        if keyword in venue.lower():
            return 'korean'

    # Conferences
    conference_keywords = ['conference', 'symposium', 'congress', 'workshop', 'proc.', 'proceedings']
    for keyword in conference_keywords:
        if keyword in venue.lower():
            return 'conference'

    # Default to international journal
    return 'international'

def update_json_file(data, filepath='scholar-data.json'):
    """Update the JSON file with new data."""
    current_data = {
        'lastUpdated': datetime.utcnow().isoformat() + 'Z',
        'citations': data['citations'],
        'hIndex': data['hIndex'],
        'scholarUrl': f"https://scholar.google.co.kr/citations?user={os.environ.get('SCHOLAR_USER_ID', 's55YrBYAAAAJ')}&hl=ko"
    }

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(current_data, f, indent=2, ensure_ascii=False)

    print(f"Updated scholar-data.json:")
    print(f"  Citations: {current_data['citations']}")
    print(f"  h-index: {current_data['hIndex']}")
    print(f"  Last Updated: {current_data['lastUpdated']}")

def update_publications_file(publications, filepath='publications-data.json'):
    """Update the publications JSON file with new data."""
    pub_data = {
        'lastUpdated': datetime.utcnow().isoformat() + 'Z',
        'international': [],
        'korean': [],
        'conference': []
    }

    counts = {'international': 0, 'korean': 0, 'conference': 0}

    for pub in publications:
        try:
            # Get publication details
            filled_pub = scholarly.fill(pub)
            bib = filled_pub.get('bib', {})

            pub_entry = {
                'title': bib.get('title', ''),
                'authors': bib.get('author', ''),
                'venue': bib.get('venue', bib.get('journal', '')),
                'year': bib.get('pub_year', ''),
                'citations': filled_pub.get('num_citations', 0)
            }

            category = categorize_publication(filled_pub)
            pub_data[category].append(pub_entry)
            counts[category] += 1

        except Exception as e:
            print(f"Error processing publication: {e}")
            continue

    # Sort by year descending
    for category in ['international', 'korean', 'conference']:
        pub_data[category].sort(key=lambda x: x.get('year', '0'), reverse=True)

    pub_data['counts'] = counts

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(pub_data, f, indent=2, ensure_ascii=False)

    print(f"\nUpdated publications-data.json:")
    print(f"  International: {counts['international']}")
    print(f"  Korean: {counts['korean']}")
    print(f"  Conference: {counts['conference']}")

def main():
    user_id = os.environ.get('SCHOLAR_USER_ID', 's55YrBYAAAAJ')

    print(f"Fetching data for Google Scholar user: {user_id}")
    data = get_scholar_data(user_id)

    if data:
        update_json_file(data)

        # Also update publications if available
        if data.get('publications'):
            print(f"\nFound {len(data['publications'])} publications")
            update_publications_file(data['publications'])

        print("\nSuccessfully updated Google Scholar data!")
    else:
        print("Failed to fetch Google Scholar data. Keeping existing data.")
        exit(1)

if __name__ == '__main__':
    main()
