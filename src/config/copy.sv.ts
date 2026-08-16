import type { Copy } from "./copy";

/**
 * Swedish. Written as Swedish, not translated word for word — the English
 * copy is the brief, not the template. Committee names are left as StiLU
 * spells them.
 */
export const sv: Copy = {
  locale: "sv",
  localeName: "Svenska",

  meta: {
    role: "Fullstackutvecklare",
    description:
      "Jag bygger kompletta webb- och mobilprodukter på egen hand — appen, adminpanelen bakom den och AI:n inuti. Läser till högskoleingenjör i datateknik på LTU. Tar frilansuppdrag.",
  },

  hero: {
    plate: "Vallée Blanche — 3842 m",
    role: "Jag bygger webb- och mobilsystem från början till slut",
    cue: "Scrolla in i solen",
  },

  statement: {
    label: "Vad jag gör",
    lead: "Jag bygger hela lösningen — appen,",
    emphasis: "adminpanelen bakom den och AI:n inuti.",
  },

  nav: [
    { label: "Projekt", href: "#work" },
    { label: "Om mig", href: "#about" },
    { label: "Kontakt", href: "#contact" },
  ],

  work: {
    label: "Utvalda projekt",
    countNoun: "projekt",
    lead: "Två produkter, båda byggda på egen hand — appen folk använder, databasen bakom den, adminpanelen som sköter den och driften den ligger på.",
    viewRepo: "Se repot ↗",
    privateRepo: "Privat repo — genomgång på begäran",
    projects: {
      stilu: {
        role: "Huvudutvecklare",
        summary:
          "Webbplats och medlemssystem för en studentidrottsförening i Luleå — fyra kommittéer under samma tak, med events, resor, bokningar och medlemsregister.",
        beats: [
          {
            title: "Föreningen sköter den, inte jag.",
            body: "All text på sajten går att skriva om inifrån sajten själv, av vem som helst med adminbehörighet. Ingen behöver en utvecklare för att rätta ett datum eller lägga till en resa — vilket spelar roll när styrelsen byts ut varje år.",
          },
          {
            title: "Fyra kommittéer, ett system.",
            body: "Alpina, Frilufts, Längd & Löp och Orientering har var sin del, egna medlemmar och egna events, allt byggt ur samma kodbas. En fix landar i alla fyra samtidigt i stället för att göras om fyra gånger.",
          },
          {
            title: "Bilduppladdning utan att dela ut nycklar.",
            body: "Webbläsaren har aldrig några lagringsnycklar. Den ber en liten serverfunktion om en engångslänk, och den funktionen är det enda som känner till hemligheten.",
          },
        ],
      },
      vana: {
        role: "Soloprojekt",
        summary:
          "Fota en måltid så loggas den. Vana läser bilden, räknar ut ungefär vad som finns i den och sätter ett betyg på dagen av 100 — med samtycke, dataexport och kontoradering inbyggt från start.",
        beats: [
          {
            title: "AI-nyckeln lämnar aldrig servern.",
            body: "Appen pratar med en funktion som jag styr. Den kontrollerar vem du är, lägger på den hemliga nyckeln och skickar vidare. Inget känsligt följer någonsin med i appen, där vem som helst hade kunnat läsa ut det.",
          },
          {
            title: "AI som inte kan dra iväg med kostnaderna.",
            body: "Varje konto har en daglig gräns, räknad på en plats som appen själv varken får läsa eller ändra, och bara godkända modeller släpps igenom. En stulen inloggning kan inte bli en obegränsad faktura.",
          },
          {
            title: "Betyget hänger inte på AI:n.",
            body: "När måltiden väl är loggad är dagens betyg ren matematik — energi, protein, kvalitet, balans. Samma indata ger samma svar varje gång, och det går att testa utan att ringa en modell över huvud taget.",
          },
        ],
      },
    },
  },

  about: {
    label: "Om mig",
    headline: { lead: "Jag gillar delarna", emphasis: "som andra hoppar över." },
    stackLabel: "Teknik",
    education: "Högskoleingenjör i datateknik, Luleå tekniska universitet — examen 2028",
    location: "Malmö / Luleå, Sverige",
    facts: {
      degree: "Studerar",
      based: "Bor",
      status: "Status",
      statusValue: "Tillgänglig för frilansuppdrag",
    },
    paragraphs: [
      "Jag läser till högskoleingenjör i datateknik på Luleå tekniska universitet och bygger kompletta webb- och mobilprodukter på egen hand — det folk klickar på, databasen bakom, adminpanelen som sköter den och driften den ligger på.",
      "AI är både en del av hur jag jobbar och en del av det jag bygger. Det är därför en person i dag kan leverera det som förut krävde ett team. Och när en produkt behöver AI inuti sig bygger jag den delen ordentligt: nycklar kvar på servern, gränser som faktiskt håller, och resultat du kan kontrollera utan att lita på modellen.",
      "Åtkomstregler som håller när någon verkligen försöker. Adminverktyg kunden kan sköta utan att ringa mig. Vyer som är snabba på en mellanklasstelefon, inte bara på laptopen de byggdes på.",
      "Jag tar frilansuppdrag — en ny sajt, en webbapp, eller att göra klart något som stannat halvvägs.",
    ],
  },

  contact: {
    label: "Kontakt",
    localTime: "lokal tid",
    headline: "Har du något du vill få byggt?",
    body: "En sajt, en webbapp, eller en AI-funktion inuti något du redan driver. Berätta vad den ska göra så säger jag vad som krävs. Svar oftast samma dag.",
    backToTop: "Tillbaka till toppen ↑",
  },
};
