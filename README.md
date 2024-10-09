# Movies++

https://github.com/datastax/movies_plus_plus/assets/9947422/6e739836-dc25-4834-a5aa-e341a35d1559

Movies++ is a movie recommendation application that makes use of [GenAI](https://en.wikipedia.org/wiki/Generative_artificial_intelligence) to recommend movies based on natural language input. It is built on [DataStax Astra](https://astra.datastax.com/) and was demoed at [CascadiaJS](https://www.youtube.com/live/HfsNGyDQtJ4?si=XzDN5lzEcmIXncJ7&t=30203) and [DataStax's RAG++ AI Hack Night](https://www.datastax.com/events/rag-plus-plus-ai-hack-night-june-2024).

## Working with Langflow

To use RAG with Langflow, you'll need to run Langflow. You can either do this as a [hosted cloud solution](https://langflow.datastax.com) on DataStax, or follow the [Langflow documentation](https://docs.langflow.org/) to get started running it locally.

## Getting Started

To get started with this project and run it locally, follow the steps below:

1. Clone the repository
2. Change directory (`cd`) into the cloned repository
3. Install dependencies with `pnpm install`
4. In your Astra database:
   - Create a vector-enabled collection named `movies` in the namespace `default_keyspace`
     - For "Embedding generation method", select (and configure if not already) "Open AI Embedding Generation"
       - Select the `text-embedding-3-small` model
       - Leave Dimensions unchanged (`1536`)
       - Change Similarity Metric to `Dot Product`
5. Import `Movies RAG.json` into your Langflow instance, and do the following:
   - On the two Astra DB components, set:
     - Collection (should be named `movies`) 
     - Astra DB Application Token (generate a token if you do not have one)
     - Database (or API Endpoint if you are running Langflow locally)
   - On the two Open AI Embeddings components, and the OpenAI chat component:
     - Set OpenAI API Key
   - If there are any yellow triangles (⚠️) on any components, click on the triangle to update to the current Langflow version
   - Get the API URL from the `</> API` button, it will look something like `https://api.langflow.astra.datastax.com/lf/48fe3ec2-dab4-4315-b703-163936bb9e9e/api/v1/run/8a966b1d-bf91-4c43-b9cd-c13e1c63c602?stream=false`; this is the `LANGFLOW_URL` you will need in the `.env` file in the next step.
6. Rename `.env.example` to `.env` and fill in the required environment variables
   - To fill this in, you'll need the following accounts:
     - [DataStax Astra](https://astra.datastax.com/)
     - [DataStax Langflow](https://langflow.datastax.com/)
     - [OpenAI](https://platform.openai.com/)
     - [TMDB](https://www.themoviedb.org/) (Optional, just for trailers)
6. Finally, run the project with `pnpm run dev`

From here, you'll be able to run the project locally, develop against it, add features, or whatever you'd like.

## Ingesting the Data

Once you've populated `.env` with your API keys, make sure you have a collection in your Astra database named "movies". Once all those pieces are in place, you can run the following command to ingest the data:

```bash
# Navigate to our scripts
cd ./scripts

# Create and activate a venv (optional)
python -m venv venv

# Windows:  venv\Scripts\activate.ps1 
# Unix: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the script
python load_movies.py
```

When this script runs, it will ingest the data from TMDB into your Astra database. This will allow you to search for movies and get recommendations based on the data you've ingested.

## Contributing

We accept pull requests and issues on this project. If you've got ideas, please **open an issue first** and discuss it with us and ideally it becomes a pull request that we open together. All contributions are welcome!

### Contribution Ideas

If you'd like to contribute but don't know where to start, feel free to check out the [open issues](https://github.com/datastax/movies_plus_plus/issues) on this repository.
