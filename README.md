# AI devs II edition training 

# Configuration

Remember to set up in local `.env` file your API keys. Names are straightforward.

Values can be found:

- `AI_DEVS_API_KEY` https://zadania.aidevs.pl/
- `OPEN_AI_API_KEY` https://platform.openai.com/account/api-keys
- `QDRANT_URL` http://localhost:6333

# qdrant db
Docker command to run qdrant (vector database):

```cmd
docker run -p 6333:6333 -v ./qdrant_storage:/qdrant/storage qdrant/qdrant
```

> :warning: **on Windows**: above won't work!
> - change `./qdrant_storage` to Windows style `.\qdrant_storage\` and run from cmd or PowerShell,
> - check in Docker Desktop whether folder is allowed to be mounted,
> - :worried: for Git Bash on Windows do not know the proper command,  

qdrant has web client accessible on http://localhost:6333/dashboard

# ngrok

To expose locally running API use ngrok. It is a tool that creates a tunnel to your local machine. 
It is useful when you want to expose your local API to the internet.

Assuming configuration is done and token is register use command:

`ngrok http http://localhost:8080`

what will proxy all requests from ngrok to app.
From command result you can get public url to app.

