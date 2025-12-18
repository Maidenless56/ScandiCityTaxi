// ===== PRISERDATABAS FÖR SCANDICITYTAXI =====
// Detta är en separat fil som innehåller alla fasta priser mellan destinationer

const PRISER_DATABAS = {
  // Struktur: "FRÅN-STAD|TILL-STAD": pris i kronor
  
  // Från Flen
  "FLEN|SPARREHOLM": 429,
  "FLEN|HÄLLEFORSNÄS": 399,
  "FLEN|MALMKÖPING": 449,
  "FLEN|KATRINEHOLM": 699,
  "FLEN|STRÄNGNÄS": 1199,
  "FLEN|GNESTA": 1199,
  "FLEN|ESKILSTUNA": 1299,
  "FLEN|NYKÖPING": 1299,
  "FLEN|ARLANDA": 2499,
  "FLEN|SKAVSTA": 899,
  "FLEN|BROMMA": 2890,
  "FLEN|VÄSTERÅS FLYGPLATS": 2399,
  "FLEN|STOCKHOLM": 2690,
  "FLEN|VÄSTERÅS": 2299,
  "FLEN|NORRKÖPING": 2099,
  "FLEN|SÖDERTÄLJE": 1990,
  "FLEN|ÖREBRO": 2699,
  
  // Omvända rutter
  "SPARREHOLM|FLEN": 429,
  "HÄLLEFORSNÄS|FLEN": 399,
  "MALMKÖPING|FLEN": 449,
  "KATRINEHOLM|FLEN": 699,
  "STRÄNGNÄS|FLEN": 1199,
  "GNESTA|FLEN": 1199,
  "ESKILSTUNA|FLEN": 1299,
  "NYKÖPING|FLEN": 1299,
  "ARLANDA|FLEN": 2499,
  "SKAVSTA|FLEN": 899,
  "BROMMA|FLEN": 2890,
  "VÄSTERÅS FLYGPLATS|FLEN": 2399,
  "STOCKHOLM|FLEN": 2690,
  "VÄSTERÅS|FLEN": 2299,
  "NORRKÖPING|FLEN": 2099,
  "SÖDERTÄLJE|FLEN": 1990,
  "ÖREBRO|FLEN": 2699,
};

// Lista över alla städer som finns i databasen
const STADER = [
  "FLEN",
  "SPARREHOLM",
  "HÄLLEFORSNÄS",
  "MALMKÖPING",
  "KATRINEHOLM",
  "STRÄNGNÄS",
  "GNESTA",
  "ESKILSTUNA",
  "NYKÖPING",
  "ARLANDA",
  "SKAVSTA",
  "BROMMA",
  "VÄSTERÅS FLYGPLATS",
  "STOCKHOLM",
  "VÄSTERÅS",
  "NORRKÖPING",
  "SÖDERTÄLJE",
  "ÖREBRO"
];

// Synonymer och alternativa namn för städer
const STAD_SYNONYMER = {
  "ARLANDA FLYGPLATS": "ARLANDA",
  "STOCKHOLM ARLANDA": "ARLANDA",
  "SKAVSTA FLYGPLATS": "SKAVSTA",
  "STOCKHOLM SKAVSTA": "SKAVSTA",
  "BROMMA FLYGPLATS": "BROMMA",
  "STOCKHOLM BROMMA": "BROMMA",
  "ESKILSTUNA CENTRUM": "ESKILSTUNA",
  "STOCKHOLM CENTRAL": "STOCKHOLM",
  "STOCKHOLM CITY": "STOCKHOLM"
};

/**
 * Hitta vilken stad en adress tillhör
 * @param {string} address - Adressen att kontrollera
 * @returns {string|null} - Staden som hittades, eller null
 */
function hittatStadIAdress(address) {
  if (!address) return null;
  
  const normalizedAddress = address.toUpperCase();
  
  // Kontrollera synonymer först
  for (const [synonym, stad] of Object.entries(STAD_SYNONYMER)) {
    if (normalizedAddress.includes(synonym)) {
      return stad;
    }
  }
  
  // Kontrollera vanliga stadnamn
  for (const stad of STADER) {
    if (normalizedAddress.includes(stad)) {
      return stad;
    }
  }
  
  return null;
}

/**
 * Hämta fast pris mellan två städer
 * @param {string} franStad - Från-stad
 * @param {string} tillStad - Till-stad
 * @returns {number|null} - Priset i kronor, eller null om ingen rutt finns
 */
function hamtaFastPris(franStad, tillStad) {
  if (!franStad || !tillStad) return null;
  
  const nyckel = `${franStad.toUpperCase()}|${tillStad.toUpperCase()}`;
  return PRISER_DATABAS[nyckel] || null;
}

/**
 * Kontrollera om en rutt har fast pris
 * @param {string} fromAddress - Från-adress
 * @param {string} toAddress - Till-adress
 * @returns {Object} - {harFastPris: boolean, pris: number|null, franStad: string|null, tillStad: string|null}
 */
function kollaPris(fromAddress, toAddress) {
  const franStad = hittatStadIAdress(fromAddress);
  const tillStad = hittatStadIAdress(toAddress);
  
  if (!franStad || !tillStad) {
    return {
      harFastPris: false,
      pris: null,
      franStad: franStad,
      tillStad: tillStad
    };
  }
  
  const pris = hamtaFastPris(franStad, tillStad);
  
  return {
    harFastPris: pris !== null,
    pris: pris,
    franStad: franStad,
    tillStad: tillStad
  };
}

/**
 * Beräkna taxipris baserat på avstånd och tid (för rutter utan fast pris)
 * @param {number} distanceKm - Avstånd i kilometer
 * @param {number} timeMin - Tid i minuter
 * @returns {number} - Beräknat pris i kronor
 */
function taxiPrice(distanceKm, timeMin) {
  const startFee = 50;
  const pricePerKm = 14.9;
  const pricePerMin = 9.6;
  return Math.round(startFee + (distanceKm * pricePerKm) + (timeMin * pricePerMin));
}

// Exportera funktioner och data för användning i andra filer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRISER_DATABAS,
    STADER,
    STAD_SYNONYMER,
    hittatStadIAdress,
    hamtaFastPris,
    kollaPris,
    taxiPrice
  };
}
