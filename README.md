
# Tipply to StreamElements

Aplikacja umożliwiająca przekazywanie donacji z Tipply do StreamElements, co pozwala na korzystanie z alertów StreamElements dla donacji otrzymanych przez Tipply.

## Instalacja

1. Zainstaluj [Node.js](https://nodejs.org/) (wersja 14 lub nowsza)
2. Sklonuj lub pobierz to repozytorium
3. W folderze projektu uruchom:
   ```
   npm install
   ```
4. Skonfiguruj plik `.env` według instrukcji poniżej
5. Uruchom aplikację:
   ```
   npm start
   ```

## Konfiguracja

Aplikacja wymaga skonfigurowania pliku `.env` z poprawnym ID Tipply oraz danymi StreamElements.

### Jak uzyskać Tipply Widget ID

1. Zaloguj się do [panelu Tipply](https://app.tipply.pl/panel-uzytkownika)
2. Przejdź do sekcji "Powiadomienia" lub "Alerty"
3. Znajdź link do widżetu powiadomień (TIP_ALERT), który wygląda tak:
   ```
   https://widgets.tipply.pl/TIP_ALERT/00000-0000-0000-0000-0000000/
   ```
4. Skopiuj ostatnią część URL (po ostatnim ukośniku, bez ukośnika), np.:
   ```
   00000-0000-0000-0000-0000000
   ```
5. To jest Twoje `TIPPLY_USER_ID`, które należy wprowadzić do pliku `.env`

### Jak uzyskać StreamElements API Token i Channel ID

1. Przejdź do [panelu konta StreamElements](https://streamelements.com/dashboard/account/channels)
2. Skopiuj wygenerowany token JWT
3. Skopiuj wygenerowany Account ID

### Konfiguracja pliku .env

Wypełnij plik `.env` w następujący sposób:

```
TIPPLY_USER_ID=twoje-tipply-widget-id
SE_CHANNEL_ID=twoje-streamelements-channel-id
SE_JWT_TOKEN=twoj-streamelements-jwt-token
SE_CURRENCY=PLN
```

## Uruchomienie

Po skonfigurowaniu, uruchom aplikację komendą:

```
npm start
```

Aplikacja będzie nasłuchiwać donacji z Tipply i automatycznie przekazywać je do StreamElements.

## Jak działa?

1. Aplikacja łączy się z WebSocket Tipply, aby otrzymywać powiadomienia o doante
2. Po otrzymaniu donate, jest ona przetwarzana
3. Donate jest następnie wysyłana do API StreamElements za pomocą skonfigurowanego tokenu
4. StreamElements wyświetla donację w swoim systemie alertów

## Uwagi

- Aplikacja musi być stale uruchomiona, aby przechwytywać donacje
- Aby uruchamiać aplikację w tle, rozważ użycie narzędzi takich jak PM2 lub systemd