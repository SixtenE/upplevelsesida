# Upplevelsesida

## Kravspecifikation - Todo List

### Startsida (grundläggande funktioner)

- [x] Sökformulär där användaren kan välja:
  - [x] Datum för upplevelsen
  - [x] Antal personer
  - [x] Ålderskategorier (Barn/Vuxen/Senior)
- [x] Lista med upplevelser och "boka" och "läs mer"-knappar
- [x] När användaren klickar "Läs mer" följer valen från sökformuläret med som query params till upplevelse-sidan
- [x] När användare klickar "Boka" följer valen från sökformuläret med som query params till boka-sidan
- [x] Tre korta artiklar som berättar om upplevelserna

### Visa upplevelse-sida (grundläggande funktioner)

- [x] Route `/upplevelse/:id` skapad
- [x] Bild på upplevelse
- [x] Kort beskrivning av upplevelse
- [x] Summering av val från startsidan (datum, antal personer etc. från query params)
- [x] "Boka"-knapp som går till bokningssidan

### Bokningssida (grundläggande funktioner)

- [x] Förifyllt formulär baserat på val från tidigare steg (om query params finns)
- [ ] Antal dagar resan ska vara
- [x] Hur många personer som ska med
- [x] Ålderskategorier på personerna (t.ex. Barn 0-12, Vuxen 13-64, Senior 65+)
- [ ] Valfritt: Olika priser per kategori
- [x] URL params uppdateras dynamiskt när användaren ändrar sina val
- [x] Lägg till bokad upplevelse till kundkorg (Pinia)

### Paketerbjudande (grundläggande funktioner)

- [x] Minst tre olika paket/tillval som kan läggas till en bokning (finns i data.json som `add_ons`)
- [ ] Paketen ska visas på bokningssidan
- [ ] Kan läggas till i kundkorgen tillsammans med huvudupplevelsen

### Spara bokningar till kundkorg (grundläggande funktioner)

- [x] Möjlighet att lägga bokningar till kundkorg (Pinia)
- [x] Se summering (total kostnad etc.) av bokningar som finns tillgängliga
- [x] Tömma kundkorg
- [x] Knapp för "Gå till betalning" (ingen faktisk betalfunktion krävs, men kan visa en bekräftelsesida)

### Skapa datan

- [x] Minst tre artiklar som berättar om upplevelserna (tre artiklar totalt, inte för varje upplevelse)
- [x] Data för upplevelser (minst 5-8 olika upplevelser att välja mellan) - 20+ upplevelser finns
- [x] 1-3 tillval/paket per upplevelse
- [x] Datakälla: En data.json fil som importeras/hämtas med fetch

### Routing

- [x] `/` - Startsida med sökformulär och upplevelser
- [x] `/upplevelse/:id` - Visa specifik upplevelse
- [x] `/boka/:id` eller `/bokning` - Bokningssida för specifik upplevelse
- [x] `/kundkorg` - Kundkorgsvy (implementerad som `/checkout`)
- [ ] Valfritt: Separata sidor för artiklar (t.ex. `/artikel/:id`)

### Tekniska krav

- [x] Vue.js med TypeScript
- [x] Vue Router implementerat
- [x] Pinia implementerat för state management

### Individuell bidragsrapport

- [ ] Individuell bidragsrapport som motiverar val av:
  - [ ] Komponentstruktur
  - [ ] Routing-lösning
  - [ ] State management-lösning
