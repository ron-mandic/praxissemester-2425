# So verwenden Sie FastAPI: Ein detailliertes Python-Tutorial

## [YouTube-Link](https://youtu.be/SORiTsvnU28?si=XpU-TL87j6Mxsz28)

## Schritte

- Befehlspalette öffnen
- "Python: Create environment ausführen"
- .venv auswählen

## Pakete

```bash
(.venv)
$ .venv/Scripts/pip install fastapi "uvicorn[standard]"
$ .venv/Scripts/uvicorn main:app --reload
```

## Befehle

- `.venv/Scripts/activate` zum Aktivieren der Umgebung (falls noch nicht geschehen)
- `.venv/Scripts/pip freeze > requirements.txt` zum Erstellen einer Anforderungsliste
- `.venv/Scripts/pip install -r requirements.txt` zum Installieren der Abhängigkeiten
- `.venv/Scripts/gunicorn -w 4 -k uvicorn.workers.UvicornWorker <FILE>:app` zum Starten von Workern

## Weitere Libraries

- [guvicorn](https://pypi.org/project/gunicorn/) anstatt uvicorn
- [python-multipart](https://pypi.org/project/python-multipart/) für FormData
- [python-jose](https://pypi.org/project/python-jose/) für JWT-Tokens zur Authentifizierung

## Weiterführende Links

- [Authentifizierung (Coding Crashkurse auf YouTube)](https://youtu.be/KXCvIV3yr7c?si=2G47uQaG1fAzTOJr&t=1853)
