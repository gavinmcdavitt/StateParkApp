import requests
from bs4 import BeautifulSoup
import csv

# URL of the Wikipedia page for Florida state parks
url = 'https://en.wikipedia.org/wiki/List_of_Florida_state_parks'

# Request the page content
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Locate the table(s) containing the state park information
tables = soup.find_all('table', {'class': 'wikitable'})

# Open a CSV file for writing
with open('florida_state_parks.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Write the header row
    writer.writerow(['Name', 'County', 'ID', 'Size', 'Year Established', 'Remarks', 'Waterbodies'])

    # Loop through the tables and extract relevant information
    for table in tables:
        rows = table.find_all('tr')
        for row in rows[1:]:  # Skip the header row
            cols = row.find_all('td')
            if len(cols) >= 6:  # Check for enough columns to avoid errors
                name = cols[0].text.strip()
                county = cols[1].text.strip()
                park_id = cols[2].text.strip()
                size = cols[3].text.strip()
                year_established = cols[4].text.strip()
                remarks = cols[5].text.strip()
                waterbodies = cols[6].text.strip()
                

                # Write the row to the CSV file
                writer.writerow([name, county, park_id, size, year_established, remarks, waterbodies])

print("Data saved to 'florida_state_parks.csv'")
