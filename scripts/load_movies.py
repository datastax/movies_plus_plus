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
import boto3

load_dotenv()

brt = boto3.client(
    service_name="bedrock-runtime",
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    aws_session_token=os.environ["AWS_SESSION_TOKEN"],
    region_name=os.environ["AWS_REGION"]
)
embedding_model = "amazon.titan-embed-text-v2:0"

script_dir = os.path.dirname(__file__)  # Directory of the script
file_path = os.path.join(script_dir, 'movies.json')

with open(file_path) as user_file:
    file_contents = user_file.read()

client = DataAPIClient(os.environ["ASTRA_DB_APPLICATION_TOKEN"])
database = client.get_database(os.environ["ASTRA_DB_API_ENDPOINT"])
collection = database.get_collection("movies")

movies = json.loads(file_contents)
movies = movies[2:]
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
    while True:
        try:
            response = brt.invoke_model(
                body=json.dumps({
                    "inputText": content,
                    "embeddingTypes": ["float"]
                }),
                modelId=embedding_model,
                accept="application/json",
                contentType="application/json",
            )
            response_body = json.loads(response.get('body').read())
            collection.update_one(
              {'_id': movie.get('id')},
              {'$set': {
                'title': movie.get('title'), 
                'poster_path': movie.get('poster_path'),
                '$vector': response_body['embedding'], 
                'content': content, 
                'metadata': { 'ingested': datetime.now(), '_id': movie.get('id') }
              }},
              upsert=True
          )
        except Exception as ex:
            print(ex)
            print("Retrying...")
            continue
        break
  