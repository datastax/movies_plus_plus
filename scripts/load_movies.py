"""
Load movies from www.themoviedb.org into an Astra Vector database 
for use with the Movies++ app.
"""
import os
import json
from datetime import datetime
from astrapy import DataAPIClient
from dotenv import load_dotenv
from langchain_community.document_loaders import UnstructuredURLLoader
from scrub import scrub

load_dotenv()

script_dir = os.path.dirname(__file__)  # Directory of the script
file_path = os.path.join(script_dir, 'movies.json')

with open(file_path) as user_file:
    file_contents = user_file.read()

client = DataAPIClient(os.environ["ASTRA_DB_APPLICATION_TOKEN"])
database = client.get_database(os.environ["ASTRA_DB_API_ENDPOINT"])
collection = database.get_collection("movies")

movies = json.loads(file_contents)
#movies = movies[:100]
for movie in movies:
    print(movie.get('title'))
    loaders = UnstructuredURLLoader(
        urls=["https://www.themoviedb.org/movie/" + str(movie.get('id'))],
        mode="elements",
        show_progress_bar=True)

    docs = loaders.load()

    content = movie.get('title') + "\n\n"
    for doc in docs:
        if doc.metadata['category'] == 'NarrativeText':
            content += doc.page_content + "\n\n"
            content = scrub(content)

    # Optionally clean the content
    content = scrub(content)

    while True:
        try:
            collection.update_one(
              {'_id': movie.get('id')},
              {'$set': {
                'title': movie.get('title'), 
                'poster_path': movie.get('poster_path'),
                '$vectorize': content, 
                'content': content, 
                'metadata': { 'ingested': datetime.now() }
              }},
              upsert=True
          )
        except Exception as ex:
            print(ex)
            print("Retrying...")
            continue
        break
  