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
