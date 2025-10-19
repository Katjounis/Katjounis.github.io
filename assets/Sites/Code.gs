// =======================================================================
// File: Code.gs — VERSION CORRIGÉE AVEC OPTIMISATIONS DEMANDÉES
// =======================================================================

/** CONFIG */
const SPREADSHEET_ID   = '1cPbTe35dWK5CJDoeoRNSq0pNd1m5r0AbOPf5QFsM_uQ';
const SHEET_MENU       = 'Menu';
const SHEET_ATTENTE    = 'Commandes en attente';
const SHEET_EFFECTUEES = 'Commandes effectuées';
const SHEET_ELEVES     = 'Eleves';
const SHEET_STOCK      = 'Stock';
const SHEET_CARTES_RIPTIDE = 'Cartes Riptide';
const TZ               = 'Europe/Paris';

/** Helpers basiques */
const _ss = (() => {
  let cache;
  return () => cache || (cache = SpreadsheetApp.openById(SPREADSHEET_ID));
})();

const _sheet = name => {
  const sh = _ss().getSheetByName(name);
  if (!sh) throw new Error(`Feuille introuvable: ${name}`);
  return sh;
};

const _now = () => Utilities.formatDate(new Date(), TZ, 'dd/MM/yyyy HH:mm:ss');

function withLock(cb) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    return cb();
  } finally {
    lock.releaseLock();
  }
}

function getProp(key, def = null) {
  const v = PropertiesService.getDocumentProperties().getProperty(key);
  return v === null ? def : v;
}

function setProp(key, val) {
  PropertiesService.getDocumentProperties().setProperty(key, String(val));
}

// =======================================================================
// 🔧 CACHE INTELLIGENT OPTIMISÉ POUR TEMPS RÉEL
// =======================================================================

const DataCache = {
  _cache: {},
  _timestamps: {},
  _checksums: {},
  
  get(key, maxAge = 30000) {
    const now = Date.now();
    if (this._cache[key] && this._timestamps[key] && (now - this._timestamps[key]) < maxAge) {
      return this._cache[key];
    }
    return null;
  },
  
  set(key, data, checksum = null) {
    this._cache[key] = data;
    this._timestamps[key] = Date.now();
    if (checksum) this._checksums[key] = checksum;
  },
  
  hasChanged(key, newChecksum) {
    return this._checksums[key] !== newChecksum;
  },
  
  clear(key = null) {
    if (key) {
      delete this._cache[key];
      delete this._timestamps[key];
      delete this._checksums[key];
    } else {
      this._cache = {};
      this._timestamps = {};
      this._checksums = {};
    }
  },
  
  getStats() {
    return {
      cacheSize: Object.keys(this._cache).length,
      oldestEntry: Math.min(...Object.values(this._timestamps)),
      newestEntry: Math.max(...Object.values(this._timestamps))
    };
  }
};

// =======================================================================
// 🚀 GESTION DES ÉLÈVES OPTIMISÉE POUR CHARGEMENT RAPIDE
// =======================================================================

/**
 * 🚀 CORRECTION : Récupère la liste des élèves avec cache agressif et optimisations
 */
function getEleves() {
  const cacheKey = 'eleves_list_optimized';
  
  // 🚀 Cache plus agressif pour les élèves (10 minutes)
  let cached = DataCache.get(cacheKey, 600000);
  if (cached) {
    console.log(`📚 Élèves chargés depuis le cache (${cached.length} élèves)`);
    return cached;
  }

  const startTime = Date.now();
  console.log('📚 Chargement optimisé des élèves...');

  try {
    const sh = _sheet(SHEET_ELEVES);
    if (sh.getLastRow() < 2) {
      const result = [];
      DataCache.set(cacheKey, result);
      return result;
    }

    // 🚀 Lecture optimisée : seulement les colonnes nécessaires
    const lastRow = sh.getLastRow();
    const lastCol = Math.min(sh.getLastColumn(), 3); // Maximum 3 colonnes pour les élèves
    
    const allData = sh.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = allData[0];
    
    // 🚀 Recherche optimisée des index
    const nomIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString().trim()));
    const prenomIndex = headers.findIndex(h => /^pr[ée]nom$/i.test((h || '').toString().trim()));
    
    let eleves = [];
    
    if (nomIndex !== -1 && prenomIndex !== -1) {
      // 🚀 Traitement optimisé avec une seule boucle
      for (let i = 1; i < allData.length; i++) {
        const prenom = String(allData[i][prenomIndex] || '').trim();
        const nom = String(allData[i][nomIndex] || '').trim();
        
        if (prenom && nom && prenom.length > 1 && nom.length > 1) {
          eleves.push(`${prenom} ${nom}`);
        }
      }
    } else if (nomIndex !== -1) {
      for (let i = 1; i < allData.length; i++) {
        const nomComplet = String(allData[i][nomIndex] || '').trim();
        if (nomComplet && nomComplet.length > 2) {
          eleves.push(nomComplet);
        }
      }
    } else {
      // Fallback sur la première colonne
      for (let i = 1; i < allData.length; i++) {
        const nomComplet = String(allData[i][0] || '').trim();
        if (nomComplet && nomComplet.length > 2) {
          eleves.push(nomComplet);
        }
      }
    }
    
    // 🚀 Dédoublonnage et tri optimisés
    eleves = [...new Set(eleves)].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ ${eleves.length} élèves chargés en ${loadTime}ms depuis l'onglet Eleves`);
    
    // 🚀 Cache avec durée plus longue pour les élèves (10 minutes)
    DataCache.set(cacheKey, eleves);
    
    return eleves;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des élèves:', error);
    const result = [];
    DataCache.set(cacheKey, result);
    return result;
  }
}

/**
 * 🆕 Ajoute un nouvel élève dans l'onglet "Eleves"
 */
function ajouterEleve(prenom, nom) {
  console.log(`📝 Ajout d'un nouvel élève: ${prenom} ${nom}`);
  
  try {
    if (!prenom || !nom) {
      return { 
        success: false, 
        error: "Le prénom et le nom sont obligatoires" 
      };
    }
    
    const prenomClean = prenom.toString().trim();
    const nomClean = nom.toString().trim();
    
    if (prenomClean.length < 2 || nomClean.length < 2) {
      return { 
        success: false, 
        error: "Le prénom et le nom doivent contenir au moins 2 caractères" 
      };
    }
    
    const validNameRegex = /^[a-zA-ZÀ-ÿ\-\s]+$/;
    if (!validNameRegex.test(prenomClean) || !validNameRegex.test(nomClean)) {
      return { 
        success: false, 
        error: "Le prénom et le nom ne peuvent contenir que des lettres, espaces et tirets" 
      };
    }
    
    return withLock(() => {
      const sh = _sheet(SHEET_ELEVES);
      
      let headers = [];
      let prenomColIndex = -1;
      let nomColIndex = -1;
      
      if (sh.getLastRow() >= 1) {
        headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
        prenomColIndex = headers.findIndex(h => /^pr[ée]nom$/i.test((h || '').toString().trim()));
        nomColIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString().trim()));
      }
      
      if (headers.length === 0 || prenomColIndex === -1 || nomColIndex === -1) {
        sh.getRange(1, 1, 1, 2).setValues([['Prénom', 'Nom']]);
        
        const headerRange = sh.getRange(1, 1, 1, 2);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#489FB5');
        headerRange.setFontColor('white');
        
        prenomColIndex = 0;
        nomColIndex = 1;
        headers = ['Prénom', 'Nom'];
      }
      
      if (sh.getLastRow() > 1) {
        const existingData = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
        
        for (const row of existingData) {
          const existingPrenom = (row[prenomColIndex] || '').toString().trim().toLowerCase();
          const existingNom = (row[nomColIndex] || '').toString().trim().toLowerCase();
          
          if (existingPrenom === prenomClean.toLowerCase() && 
              existingNom === nomClean.toLowerCase()) {
            return { 
              success: false, 
              error: `L'élève ${prenomClean} ${nomClean} existe déjà dans la liste` 
            };
          }
        }
      }
      
      const newRow = [];
      newRow[prenomColIndex] = prenomClean;
      newRow[nomColIndex] = nomClean;
      
      while (newRow.length < headers.length) {
        newRow.push('');
      }
      
      sh.appendRow(newRow);
      
      const newRowRange = sh.getRange(sh.getLastRow(), 1, 1, headers.length);
      newRowRange.setBorder(true, true, true, true, false, false);
      
      // 🚀 Vider le cache des élèves pour forcer le rechargement
      DataCache.clear('eleves_list_optimized');
      
      const nomComplet = `${prenomClean} ${nomClean}`;
      console.log(`✅ Élève ajouté avec succès: ${nomComplet}`);
      
      return { 
        success: true, 
        nomComplet: nomComplet,
        message: `Élève ${nomComplet} ajouté avec succès dans l'onglet Eleves`
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de l\'élève:', error);
    return { 
      success: false, 
      error: `Erreur serveur: ${error.message}` 
    };
  }
}

// =======================================================================
// 🆕 MISE EN FORME AUTOMATIQUE
// =======================================================================

/**
 * Fonction appelée automatiquement à l'ouverture du Google Sheet
 */
function onOpen() {
  console.log('🎨 Ouverture du Google Sheet - Application de la mise en forme automatique');
  
  initCartesRiptide();
  
  SpreadsheetApp.getUi().createMenu('🌊 Riptide BDE')
    .addItem('📄 Régénérer colonnes', 'majEntetesCommandes')
    .addItem('✅ Transférer commandes validées', 'transfererCommandesValidees')
    .addSeparator()
    .addItem('🎨 Appliquer mise en forme', 'appliquerMiseEnFormeTousOnglets')
    .addItem('👥 Vérifier structure élèves', 'verifierStructureEleves')
    .addItem('💳 Vérifier onglet Cartes Riptide', 'verifierOngletCartesRiptide')
    .addSeparator()
    .addItem('🔄 Réinitialiser compteurs du jour', 'resetCompteursJour')
    .addItem('🔄 RESET COMPLET du compteur', 'resetCompletCompteur')  // ✅ NOUVELLE OPTION
    .addItem('🗑️ Vider cache performance', 'clearPerformanceCache')
    .addItem('📊 Stats cache temps réel', 'showCacheStats')
    .addToUi()
    .addItem('🤖 Programmer reset auto à minuit', 'creerTriggerResetQuotidien');
  
  try {
    appliquerMiseEnFormeTousOnglets();
    console.log('✅ Mise en forme automatique appliquée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la mise en forme automatique:', error);
  }
}
/**
 * 💳 Fonction de vérification manuelle de l'onglet Cartes Riptide
 */
function verifierOngletCartesRiptide() {
  const result = creerOngletCartesRiptide();
  
  if (result.success) {
    SpreadsheetApp.getUi().alert(
      '💳 Cartes Riptide',
      result.message + '\n\nL\'onglet est prêt à être utilisé.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } else {
    SpreadsheetApp.getUi().alert(
      '❌ Erreur',
      'Impossible de créer l\'onglet Cartes Riptide:\n' + result.error,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}
/**
 * 🤖 Créer un trigger automatique pour reset quotidien à minuit
 */
function creerTriggerResetQuotidien() {
  // Supprimer les anciens triggers
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'resetCompteursJourAuto') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Créer un nouveau trigger à minuit
  ScriptApp.newTrigger('resetCompteursJourAuto')
    .timeBased()
    .atHour(0) // Minuit
    .everyDays(1)
    .create();
  
  SpreadsheetApp.getUi().alert('✅ Reset automatique programmé tous les jours à minuit !');
}

/**
 * Fonction appelée automatiquement par le trigger
 */
function resetCompteursJourAuto() {
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const key = `COUNTER_GLOBAL_${today}`;
  
  // Supprimer tous les compteurs
  const props = PropertiesService.getDocumentProperties();
  Object.keys(props.getProperties()).forEach(k => {
    if (k.startsWith('COUNTER_')) {
      props.deleteProperty(k);
    }
  });
  
  // Réinitialiser à 0
  setProp(key, '0');
  DataCache.clear();
  
  console.log(`✅ Compteur auto-reset à 0 le ${today}`);
}
/**
 * 🆕 Applique la mise en forme sur tous les onglets
 */
function appliquerMiseEnFormeTousOnglets() {
  console.log('🎨 Début de l\'application de la mise en forme sur tous les onglets');
  
  try {
    const ss = _ss();
    const sheets = ss.getSheets();
    let ongletsTraites = 0;
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      console.log(`🎨 Traitement de l'onglet: ${sheetName}`);
      
      try {
        switch (sheetName.toLowerCase()) {
          case 'menu':
            appliquerMiseEnFormeMenu(sheet);
            break;
          case 'commandes en attente':
          case 'commandes effectuées':
            appliquerMiseEnFormeCommandes(sheet);
            break;
          case 'eleves':
            appliquerMiseEnFormeEleves(sheet);
            break;
          case 'stock':
            appliquerMiseEnFormeStock(sheet);
            break;
          // Dans le switch statement, ajoutez :
          case 'cartes riptide':
            appliquerMiseEnFormeCartesRiptide(sheet);
            break;
          default:
            appliquerMiseEnFormeGenerique(sheet);
        }
        
        ongletsTraites++;
        console.log(`✅ Onglet ${sheetName} formaté avec succès`);
        
      } catch (error) {
        console.error(`❌ Erreur lors du formatage de l'onglet ${sheetName}:`, error);
      }
    });
    
    console.log(`🎨 Mise en forme terminée - ${ongletsTraites} onglets traités`);
    
    return {
      success: true,
      message: `Mise en forme appliquée avec succès sur ${ongletsTraites} onglets`,
      ongletsTraites: ongletsTraites
    };
    
  } catch (error) {
    console.error('❌ Erreur générale lors de la mise en forme:', error);
    return {
      success: false,
      error: `Erreur lors de la mise en forme: ${error.message}`
    };
  }
}

function appliquerMiseEnFormeMenu(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#FF6B6B');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    dataRange.setVerticalAlignment('middle');
    
    const headers = headerRange.getValues()[0];
    const prixIndex = headers.findIndex(h => /prix|tarif/i.test((h || '').toString()));
    
    if (prixIndex !== -1) {
      const prixRange = sheet.getRange(2, prixIndex + 1, sheet.getLastRow() - 1, 1);
      prixRange.setNumberFormat('0.00"€"');
      prixRange.setHorizontalAlignment('right');
    }
  }
  
  sheet.setFrozenRows(1);
}

function appliquerMiseEnFormeCommandes(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#489FB5');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    dataRange.setVerticalAlignment('middle');
    
    const headers = headerRange.getValues()[0];
    
    // 🆕 Ajouter colonne statut si elle n'existe pas
    const statutIndex = headers.findIndex(h => /statut.*paiement|statut.*commande/i.test((h || '').toString()));
    if (statutIndex === -1) {
      // Insérer la colonne statut avant la colonne "Validée"
      const valideeIndex = headers.findIndex(h => /valid[ée]e?/i.test((h || '').toString()));
      if (valideeIndex !== -1) {
        sheet.insertColumnBefore(valideeIndex + 1);
        sheet.getRange(1, valideeIndex + 1).setValue('Statut Paiement');
        
        // Réappliquer la mise en forme de l'en-tête
        const newHeaderRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
        newHeaderRange.setFontWeight('bold');
        newHeaderRange.setBackground('#489FB5');
        newHeaderRange.setFontColor('white');
        newHeaderRange.setHorizontalAlignment('center');
      }
    }
    
    const totalIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
    if (totalIndex !== -1) {
      const totalRange = sheet.getRange(2, totalIndex + 1, sheet.getLastRow() - 1, 1);
      totalRange.setNumberFormat('0.00"€"');
      totalRange.setHorizontalAlignment('right');
      totalRange.setFontWeight('bold');
    }
    
    const dateIndex = headers.findIndex(h => /date/i.test((h || '').toString()));
    if (dateIndex !== -1) {
      const dateRange = sheet.getRange(2, dateIndex + 1, sheet.getLastRow() - 1, 1);
      dateRange.setNumberFormat('dd/mm/yyyy hh:mm');
      dateRange.setHorizontalAlignment('center');
    }
    
    const valideeIndex = headers.findIndex(h => /valid[ée]e?/i.test((h || '').toString()));
    if (valideeIndex !== -1) {
      const valideeRange = sheet.getRange(2, valideeIndex + 1, sheet.getLastRow() - 1, 1);
      valideeRange.setHorizontalAlignment('center');
    }
  }
  
  sheet.setFrozenRows(1);
}

function appliquerMiseEnFormeEleves(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#feca57');
  headerRange.setFontColor('#2c3e50');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    dataRange.setVerticalAlignment('middle');
    dataRange.setHorizontalAlignment('left');
    
    for (let i = 2; i <= sheet.getLastRow(); i++) {
      const rowRange = sheet.getRange(i, 1, 1, sheet.getLastColumn());
      if (i % 2 === 0) {
        rowRange.setBackground('#F8F5F2');
      }
    }
  }
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function appliquerMiseEnFormeStock(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2ecc71');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    dataRange.setVerticalAlignment('middle');
    
    const headers = headerRange.getValues()[0];
    const stockIndex = headers.findIndex(h => /stock.*actuel/i.test((h || '').toString()));
    const seuilIndex = headers.findIndex(h => /seuil/i.test((h || '').toString()));
    const initialIndex = headers.findIndex(h => /quantit[ée].*initiale|stock.*initial/i.test((h || '').toString()));
    
    if (stockIndex !== -1 && initialIndex !== -1) {
      for (let i = 2; i <= sheet.getLastRow(); i++) {
        const stockValue = sheet.getRange(i, stockIndex + 1).getValue();
        const initialValue = sheet.getRange(i, initialIndex + 1).getValue();
        
        if (typeof stockValue === 'number' && typeof initialValue === 'number' && initialValue > 0) {
          const stockPercentage = (stockValue / initialValue) * 100;
          const rowRange = sheet.getRange(i, 1, 1, sheet.getLastColumn());
          
          if (stockValue <= 0) {
            // 🔴 Stock épuisé - Rouge foncé
            rowRange.setBackground('#ffcdd2');
            rowRange.setFontColor('#d32f2f');
            rowRange.setFontWeight('bold');
          } else if (stockPercentage <= 15) {
            // 🔴 Stock critique (≤15%) - Rouge vif avec bordure
            rowRange.setBackground('#ffebee');
            rowRange.setFontColor('#e74c3c');
            rowRange.setFontWeight('bold');
            rowRange.setBorder(true, true, true, true, true, true, '#e74c3c', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
          } else if (stockPercentage <= 30) {
            // 🟠 Stock faible (≤30%) - Orange
            rowRange.setBackground('#fff3e0');
            rowRange.setFontColor('#ff9800');
          } else if (seuilIndex !== -1) {
            const seuilValue = sheet.getRange(i, seuilIndex + 1).getValue();
            if (typeof seuilValue === 'number' && stockValue <= seuilValue) {
              // 🟡 Stock sous le seuil d'alerte - Jaune
              rowRange.setBackground('#fffde7');
              rowRange.setFontColor('#f57c00');
            }
          }
        }
      }
    }
  }
  
  sheet.setFrozenRows(1);
}

function appliquerMiseEnFormeGenerique(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#7f8c8d');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    dataRange.setVerticalAlignment('middle');
  }
  
  sheet.setFrozenRows(1);
}

function verifierStructureEleves() {
  try {
    const sh = _sheet(SHEET_ELEVES);
    
    if (sh.getLastRow() < 1) {
      sh.getRange(1, 1, 1, 2).setValues([['Prénom', 'Nom']]);
      appliquerMiseEnFormeEleves(sh);
      
      SpreadsheetApp.getUi().alert('✅ Structure de l\'onglet Eleves créée avec succès !');
    } else {
      const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const prenomIndex = headers.findIndex(h => /^pr[ée]nom$/i.test((h || '').toString().trim()));
      const nomIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString().trim()));
      
      if (prenomIndex === -1 || nomIndex === -1) {
        SpreadsheetApp.getUi().alert('⚠️ Structure incorrecte détectée.\n\nL\'onglet Eleves doit contenir les colonnes "Prénom" et "Nom".');
      } else {
        SpreadsheetApp.getUi().alert('✅ Structure de l\'onglet Eleves correcte !');
      }
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Erreur lors de la vérification: ' + error.message);
  }
}

// =======================================================================
// 🆕 GESTION COMPLÈTE DES STOCKS AVEC SEUIL 15% CRITIQUE
// =======================================================================

/**
 * 🆕 Récupère les données de stock depuis l'onglet Stock
 */
function getStockData() {
  console.log('📦 Récupération des données de stock...');
  
  try {
    const sh = _sheet(SHEET_STOCK);
    
    if (sh.getLastRow() < 2) {
      return {
        success: true,
        stocks: [],
        message: "Aucun article en stock"
      };
    }
    
    const allData = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    const headers = allData[0];
    
    // Identifier les colonnes
    const nomIndex = headers.findIndex(h => /nom|article/i.test((h || '').toString()));
    const stockIndex = headers.findIndex(h => /stock.*actuel|quantit[ée].*actuelle/i.test((h || '').toString()));
    const seuilIndex = headers.findIndex(h => /seuil.*alerte|alerte/i.test((h || '').toString()));
    const initialIndex = headers.findIndex(h => /quantit[ée].*initiale|stock.*initial/i.test((h || '').toString()));
    const prixIndex = headers.findIndex(h => /prix.*unitaire|prix/i.test((h || '').toString()));
    
    if (nomIndex === -1) {
      return {
        success: false,
        error: "Colonne 'Nom' non trouvée dans l'onglet Stock"
      };
    }
    
    const stocks = [];
    
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const nom = (row[nomIndex] || '').toString().trim();
      
      if (nom) {
        const stockItem = {
          nom: nom,
          stockActuel: stockIndex !== -1 ? (parseInt(row[stockIndex]) || 0) : 0,
          seuilAlerte: seuilIndex !== -1 ? (parseInt(row[seuilIndex]) || 5) : 5,
          quantiteInitiale: initialIndex !== -1 ? (parseInt(row[initialIndex]) || 0) : 0,
          prixUnitaire: prixIndex !== -1 ? (parseFloat(row[prixIndex]) || 0) : 0
        };
        
        stocks.push(stockItem);
      }
    }
    
    console.log(`✅ ${stocks.length} articles de stock récupérés`);
    
    return {
      success: true,
      stocks: stocks,
      message: `${stocks.length} articles chargés depuis l'onglet Stock`
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stocks:', error);
    return {
      success: false,
      error: `Erreur serveur: ${error.message}`,
      stocks: []
    };
  }
}

/**
 * 🆕 Sauvegarde ou met à jour un article de stock
 */
function saveStockItem(stockItem) {
  console.log(`💾 Sauvegarde de l'article de stock: ${stockItem.nom}`);
  
  try {
    if (!stockItem.nom || stockItem.nom.trim() === '') {
      return { success: false, error: "Le nom de l'article est obligatoire" };
    }
    
    return withLock(() => {
      const sh = _sheet(SHEET_STOCK);
      
      // Vérifier/créer la structure de l'onglet Stock
      let headers = [];
      if (sh.getLastRow() >= 1) {
        headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      }
      
      if (headers.length === 0) {
        // Créer les en-têtes
        headers = ['Nom', 'Stock Actuel', 'Seuil Alerte', 'Quantité Initiale', 'Prix Unitaire'];
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Appliquer la mise en forme
        const headerRange = sh.getRange(1, 1, 1, headers.length);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#2ecc71');
        headerRange.setFontColor('white');
        headerRange.setHorizontalAlignment('center');
        sh.setFrozenRows(1);
      }
      
      // Identifier les colonnes
      const nomIndex = headers.findIndex(h => /nom|article/i.test((h || '').toString()));
      const stockIndex = headers.findIndex(h => /stock.*actuel/i.test((h || '').toString()));
      const seuilIndex = headers.findIndex(h => /seuil.*alerte/i.test((h || '').toString()));
      const initialIndex = headers.findIndex(h => /quantit[ée].*initiale/i.test((h || '').toString()));
      const prixIndex = headers.findIndex(h => /prix.*unitaire/i.test((h || '').toString()));
      
      // Vérifier si l'article existe déjà
      let targetRowIndex = -1;
      if (sh.getLastRow() > 1) {
        const existingData = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
        
        for (let i = 0; i < existingData.length; i++) {
          const existingNom = (existingData[i][nomIndex] || '').toString().trim();
          if (existingNom.toLowerCase() === stockItem.nom.trim().toLowerCase()) {
            targetRowIndex = i + 2; // +2 car les index commencent à 0 et on a l'en-tête
            break;
          }
        }
      }
      
      // Préparer les données de la ligne
      const newRow = new Array(headers.length).fill('');
      newRow[nomIndex] = stockItem.nom.trim();
      if (stockIndex !== -1) newRow[stockIndex] = stockItem.stockActuel || 0;
      if (seuilIndex !== -1) newRow[seuilIndex] = stockItem.seuilAlerte || 5;
      if (initialIndex !== -1) newRow[initialIndex] = stockItem.quantiteInitiale || 0;
      if (prixIndex !== -1) newRow[prixIndex] = stockItem.prixUnitaire || 0;
      
      if (targetRowIndex !== -1) {
        // Mettre à jour la ligne existante
        sh.getRange(targetRowIndex, 1, 1, headers.length).setValues([newRow]);
        console.log(`✅ Article ${stockItem.nom} mis à jour`);
      } else {
        // Ajouter une nouvelle ligne
        sh.appendRow(newRow);
        
        // Appliquer la mise en forme à la nouvelle ligne
        const newRowIndex = sh.getLastRow();
        const newRowRange = sh.getRange(newRowIndex, 1, 1, headers.length);
        newRowRange.setBorder(true, true, true, true, false, false);
        newRowRange.setVerticalAlignment('middle');
        
        console.log(`✅ Article ${stockItem.nom} ajouté`);
      }
      
      // 🔴 Appliquer la mise en forme avec les nouveaux seuils critiques ROUGES
      appliquerMiseEnFormeStock(sh);
      
      DataCache.clear();
      
      return {
        success: true,
        message: `Article ${stockItem.nom} sauvegardé avec succès`
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de l\'article:', error);
    return {
      success: false,
      error: `Erreur serveur: ${error.message}`
    };
  }
}

/**
 * 🆕 Réapprovisionne un article (augmente son stock)
 */
function restockItem(articleName, quantity) {
  console.log(`📦 Réapprovisionnement de ${articleName}: +${quantity}`);
  
  try {
    if (!articleName || !quantity || quantity <= 0) {
      return { success: false, error: "Nom d'article et quantité positive requis" };
    }
    
    return withLock(() => {
      const sh = _sheet(SHEET_STOCK);
      
      if (sh.getLastRow() < 2) {
        return { success: false, error: "Aucun article en stock" };
      }
      
      const allData = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
      const headers = allData[0];
      
      const nomIndex = headers.findIndex(h => /nom|article/i.test((h || '').toString()));
      const stockIndex = headers.findIndex(h => /stock.*actuel/i.test((h || '').toString()));
      
      if (nomIndex === -1 || stockIndex === -1) {
        return { success: false, error: "Structure de l'onglet Stock incorrecte" };
      }
      
      // Trouver l'article
      let targetRowIndex = -1;
      let currentStock = 0;
      
      for (let i = 1; i < allData.length; i++) {
        const rowNom = (allData[i][nomIndex] || '').toString().trim();
        if (rowNom.toLowerCase() === articleName.toLowerCase()) {
          targetRowIndex = i + 1; // +1 car les index Google Sheets commencent à 1
          currentStock = parseInt(allData[i][stockIndex]) || 0;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return { success: false, error: `Article ${articleName} non trouvé` };
      }
      
      // Mettre à jour le stock
      const newStock = currentStock + parseInt(quantity);
      sh.getRange(targetRowIndex, stockIndex + 1).setValue(newStock);
      
      // 🔴 Réappliquer la mise en forme pour les nouvelles couleurs ROUGES
      appliquerMiseEnFormeStock(sh);
      
      DataCache.clear();
      
      console.log(`✅ Stock de ${articleName} mis à jour: ${currentStock} → ${newStock}`);
      
      return {
        success: true,
        message: `Stock de ${articleName} augmenté de ${quantity} (${currentStock} → ${newStock})`
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du réapprovisionnement:', error);
    return {
      success: false,
      error: `Erreur serveur: ${error.message}`
    };
  }
}

/**
 * 🆕 Met à jour le stock suite à une vente (diminue le stock)
 */
function updateStockFromSale(articleName, quantitySold) {
  console.log(`📉 Mise à jour stock après vente: ${articleName} -${quantitySold}`);
  
  try {
    const sh = _sheet(SHEET_STOCK);
    
    if (sh.getLastRow() < 2) {
      console.log(`⚠️ Aucun stock à mettre à jour pour ${articleName}`);
      return { success: true, message: "Aucun stock à gérer" };
    }
    
    const allData = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    const headers = allData[0];
    
    const nomIndex = headers.findIndex(h => /nom|article/i.test((h || '').toString()));
    const stockIndex = headers.findIndex(h => /stock.*actuel/i.test((h || '').toString()));
    
    if (nomIndex === -1 || stockIndex === -1) {
      console.log(`⚠️ Structure stock incorrecte pour ${articleName}`);
      return { success: true, message: "Structure stock non configurée" };
    }
    
    // Trouver l'article
    let targetRowIndex = -1;
    let currentStock = 0;
    
    for (let i = 1; i < allData.length; i++) {
      const rowNom = (allData[i][nomIndex] || '').toString().trim();
      if (rowNom.toLowerCase() === articleName.toLowerCase()) {
        targetRowIndex = i + 1;
        currentStock = parseInt(allData[i][stockIndex]) || 0;
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      console.log(`⚠️ Article ${articleName} non trouvé dans le stock`);
      return { success: true, message: `Article ${articleName} non géré en stock` };
    }
    
    // Mettre à jour le stock
    const newStock = Math.max(0, currentStock - quantitySold);
    sh.getRange(targetRowIndex, stockIndex + 1).setValue(newStock);
    
    // 🔴 Réappliquer la mise en forme pour les nouvelles couleurs ROUGES
    appliquerMiseEnFormeStock(sh);
    
    console.log(`✅ Stock ${articleName} mis à jour: ${currentStock} → ${newStock}`);
    
    return {
      success: true,
      message: `Stock ${articleName} mis à jour après vente`
    };
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour stock pour ${articleName}:`, error);
    return {
      success: true, // Ne pas faire échouer la commande pour un problème de stock
      message: `Erreur stock: ${error.message}`
    };
  }
}

// =======================================================================
// 🔧 FONCTIONS POUR LE SYSTÈME À DEUX COLONNES CORRIGÉ
// =======================================================================

/**
 * 🆕 Marque une commande comme payée (passage colonne gauche → droite)
 */
function marquerCommandeCommePaye(payload) {
  console.log(`💰 Marquage comme payé: ${payload.commandeNumber}`);
  
  try {
    if (!payload.commandeNumber || !payload.clientName) {
      return { success: false, error: "Données d'identification manquantes" };
    }
    
    return withLock(() => {
      const sheet = _sheet(SHEET_ATTENTE);
      const lastRow = sheet.getLastRow();
      
      if (lastRow <= 1) {
        return { success: false, error: "Aucune commande en attente" };
      }
      
      // Récupérer toutes les données
      const allData = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
      const headers = allData[0];
      
      // Index des colonnes
      const cmdColumnIndex = headers.findIndex(h => /n[°o]?\s*commande|commande/i.test((h || '').toString()));
      const nomColumnIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()) || /client|nom/i.test((h || '').toString()));
      const statutColumnIndex = headers.findIndex(h => /statut.*paiement|statut.*commande/i.test((h || '').toString()));
      const paiementIndex = headers.findIndex(h => /paiement|mode.*paiement/i.test((h || '').toString()));
      const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
      
      if (cmdColumnIndex === -1 || nomColumnIndex === -1) {
        return { success: false, error: "Colonnes requises non trouvées" };
      }
      
      // Recherche de la commande
      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        const rowCmdNum = String(row[cmdColumnIndex] || '').trim();
        const rowClientName = String(row[nomColumnIndex] || '').trim();
        
        if (rowCmdNum === String(payload.commandeNumber).trim() && 
            rowClientName.toLowerCase() === String(payload.clientName).toLowerCase().trim()) {
          targetRowIndex = i;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return { 
          success: false, 
          error: `Commande ${payload.commandeNumber} de ${payload.clientName} introuvable`
        };
      }
      
      // 💳 DÉBIT DE LA CARTE RIPTIDE AU MOMENT DU PAIEMENT
      const modePaiement = paiementIndex !== -1 ? String(allData[targetRowIndex][paiementIndex] || '').trim() : '';
      const nomClient = String(allData[targetRowIndex][nomColumnIndex] || '').trim();
      const montantTotal = totalColIndex !== -1 ? parseFloat(allData[targetRowIndex][totalColIndex]) || 0 : 0;
      
      // Si paiement par Carte Riptide, débiter maintenant
      if (modePaiement.includes('Carte Riptide') && nomClient && montantTotal > 0) {
        const nomParts = nomClient.split(' ').filter(part => part.length > 0);
        
        if (nomParts.length >= 2) {
          const prenom = nomParts[0];
          const nomFamille = nomParts.slice(1).join(' ');
          
          console.log(`💳 Débit carte Riptide pour ${nomClient}: ${montantTotal}€`);
          
          const paiementResult = payerAvecCarteRiptide(prenom, nomFamille, montantTotal);
          
          if (paiementResult.success) {
            if (paiementResult.paiementComplet) {
              console.log(`✅ Paiement carte complet - Nouveau solde: ${paiementResult.creditRestant}€`);
            } else {
              console.log(`⚠️ Paiement partiel - ${paiementResult.montantDebite}€ débités, ${paiementResult.montantManquant}€ restants`);
            }
          } else {
            console.error(`❌ Erreur paiement carte: ${paiementResult.error}`);
            // Ne pas bloquer la validation pour un problème de carte
          }
        }
      }
      
      // Mettre à jour le statut
      if (statutColumnIndex !== -1) {
        const googleSheetRow = targetRowIndex + 1;
        sheet.getRange(googleSheetRow, statutColumnIndex + 1).setValue('paye_non_distribue');
      }
      
      // Vider le cache
      DataCache.clear();
      
      console.log(`✅ Commande ${payload.commandeNumber} marquée comme payée`);
      
      return { 
        success: true, 
        message: `Commande ${payload.commandeNumber} marquée comme payée`,
        action: 'marquer_paye'
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur dans marquerCommandeCommePaye:', error);
    return { success: false, error: `Erreur serveur: ${error.message}` };
  }
}

/**
 * 🆕 Marque une commande comme distribuée (validation finale)
 */
function marquerCommandeCommeDistribue(payload) {
  console.log(`🚚 Marquage comme distribué: ${payload.commandeNumber}`);
  
  try {
    if (!payload.commandeNumber || !payload.clientName) {
      return { success: false, error: "Données d'identification manquantes" };
    }
    
    return withLock(() => {
      const sheetAttente = _sheet(SHEET_ATTENTE);
      const sheetEffectuees = _sheet(SHEET_EFFECTUEES);
      const lastRow = sheetAttente.getLastRow();
      
      if (lastRow <= 1) {
        return { success: false, error: "Aucune commande en attente" };
      }
      
      // Récupérer toutes les données
      const allData = sheetAttente.getRange(1, 1, lastRow, sheetAttente.getLastColumn()).getValues();
      const headers = allData[0];
      
      // Index des colonnes
      const cmdColumnIndex = headers.findIndex(h => /n[°o]?\s*commande|commande/i.test((h || '').toString()));
      const nomColumnIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()) || /client|nom/i.test((h || '').toString()));
      const valideeColumnIndex = headers.findIndex(h => /valid[ée]e?/i.test((h || '').toString()));
      
      if (cmdColumnIndex === -1 || nomColumnIndex === -1 || valideeColumnIndex === -1) {
        return { success: false, error: "Colonnes requises non trouvées" };
      }
      
      // Recherche de la commande
      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        const rowCmdNum = String(row[cmdColumnIndex] || '').trim();
        const rowClientName = String(row[nomColumnIndex] || '').trim();
        
        if (rowCmdNum === String(payload.commandeNumber).trim() && 
            rowClientName.toLowerCase() === String(payload.clientName).toLowerCase().trim()) {
          targetRowIndex = i;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return { 
          success: false, 
          error: `Commande ${payload.commandeNumber} de ${payload.clientName} introuvable`
        };
      }
      
      const googleSheetRow = targetRowIndex + 1;
      const rowDataFromSheet = allData[targetRowIndex];
      
      // Préparer les données pour la validation
      const updatedRowData = [...rowDataFromSheet];
      updatedRowData[valideeColumnIndex] = `Validée le ${_now()}`;
      
      // 💳 GESTION AUTOMATIQUE DES CARTES RIPTIDE À LA VALIDATION
      try {
        const paiementIndex = headers.findIndex(h => /paiement|mode.*paiement/i.test((h || '').toString()));
        const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
        const statutColIndex = headers.findIndex(h => /statut.*paiement/i.test((h || '').toString()));
        
        const startItems = totalColIndex !== -1 ? totalColIndex + 1 : 6;
        const endItems = statutColIndex !== -1 ? statutColIndex : 
                        (valideeColumnIndex !== -1 ? valideeColumnIndex : headers.length);
        
        const modePaiement = paiementIndex !== -1 ? String(updatedRowData[paiementIndex] || '').trim() : '';
        const nomClient = String(updatedRowData[nomColumnIndex] || '').trim();
        const montantTotal = totalColIndex !== -1 ? parseFloat(updatedRowData[totalColIndex]) || 0 : 0;
        
        const estCartePure = modePaiement === 'Carte Riptide';
        const estCarteAvecComplement = modePaiement.includes('Carte Riptide') && modePaiement.includes('+');
        
        if ((estCartePure || estCarteAvecComplement) && nomClient && montantTotal > 0) {
          const nomParts = nomClient.split(' ').filter(part => part.length > 0);
          
          if (nomParts.length >= 2) {
            const prenom = nomParts[0];
            const nomFamille = nomParts.slice(1).join(' ');
            
            if (estCartePure) {
              let totalCartesRiptide = 0;
              for (let i = startItems; i < endItems; i++) {
                const articleHeader = String(headers[i] || '').trim().toLowerCase();
                const qte = parseInt(updatedRowData[i]) || 0;
                
                if (qte > 0 && articleHeader.includes('carte') && articleHeader.includes('riptide')) {
                  totalCartesRiptide += qte;
                }
              }
              
              if (totalCartesRiptide > 0) {
                console.log(`ðŸ'³ Validation Carte Riptide: ${totalCartesRiptide} carte(s) à créer pour ${nomClient}`);
                
                for (let i = 0; i < totalCartesRiptide; i++) {
                  const carteResult = acheterCarteRiptide(prenom, nomFamille);
                  if (carteResult.success) {
                    console.log(`âœ… Carte ${i+1}/${totalCartesRiptide} créée: ${carteResult.message}`);
                  }
                }
                
                // NE PAS COMPTER LES CARTES RIPTIDE DANS LE TOTAL
                updatedRowData[totalColIndex] = 0;
              }
              
            } else if (estCarteAvecComplement) {
              const modeComplement = modePaiement.replace('Carte Riptide + ', '').trim();
              const carteInfo = getCarteRiptide(prenom, nomFamille);
              
              if (carteInfo.success && carteInfo.hasCarte) {
                const creditRestant = carteInfo.creditRestant || 0;
                const montantDepuisCarte = Math.min(creditRestant, montantTotal);
                const montantManquant = Math.max(0, montantTotal - creditRestant);
                
                if (montantDepuisCarte > 0) {
                  const paiementResult = payerAvecCarteRiptide(prenom, nomFamille, montantDepuisCarte);
                  if (paiementResult.success) {
                    console.log(`ðŸ'³ Carte débitée de ${montantDepuisCarte}â‚¬ (complément: ${montantManquant}â‚¬)`);
                  }
                }
                
                // COMPTER UNIQUEMENT LE COMPLÉMENT
                updatedRowData[totalColIndex] = montantManquant;
              }
            }
          }
        }
      } catch (carteError) {
        console.error('âš ï¸ Erreur lors de la gestion des cartes Riptide:', carteError);
      }
      
      // 🆕 Écrire la ligne mise à jour dans "Commandes en attente"
      sheetAttente.getRange(googleSheetRow, 1, 1, headers.length).setValues([updatedRowData]);
      
      // Copier dans "Commandes effectuées"
      sheetEffectuees.appendRow(updatedRowData);
      
      // Supprimer de "Commandes en attente"
      sheetAttente.deleteRow(googleSheetRow);
      
      // Vider le cache
      DataCache.clear();
      
      console.log(`✅ Commande ${payload.commandeNumber} marquée comme distribuée et transférée`);
      
      return { 
        success: true, 
        message: `Commande ${payload.commandeNumber} validée et transférée`,
        action: 'marquer_distribue'
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur dans marquerCommandeCommeDistribue:', error);
    return { success: false, error: `Erreur serveur: ${error.message}` };
  }
}

/**
 * 🆕 Met à jour les stocks selon une commande validée
 */
function updateStocksFromCommand(rowData, headers) {
  console.log('ðŸ"¦ Mise à jour des stocks suite à une commande validée');
  
  try {
    const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
    const statutColIndex = headers.findIndex(h => /statut.*paiement/i.test((h || '').toString()));
    const valideeColIndex = headers.findIndex(h => /valid[ée]e?/i.test((h || '').toString()));
    
    const startItems = totalColIndex !== -1 ? totalColIndex + 1 : 6;
    const endItems = statutColIndex !== -1 ? statutColIndex : 
                     (valideeColIndex !== -1 ? valideeColIndex : headers.length);
    
    for (let i = startItems; i < endItems; i++) {
      const articleHeader = String(headers[i] || '').trim();
      const quantity = parseInt(rowData[i]) || 0;
      
      if (!articleHeader || quantity <= 0) continue;
      
      // ðŸ'³ IGNORER LES CARTES RIPTIDE
      if (articleHeader.toLowerCase().includes('carte') && articleHeader.toLowerCase().includes('riptide')) {
        console.log(`ðŸ'³ Cartes Riptide ignorées: ${quantity} carte(s) (gérées séparément)`);
        continue;
      }
      
      updateStockFromSale(articleHeader, quantity);
    }
    
    console.log('âœ… Mise à jour des stocks terminée');
    
  } catch (error) {
    console.error('âŒ Erreur lors de la mise à jour des stocks:', error);
  }
}

// =======================================================================
// FONCTIONS OPTIMISÉES TEMPS RÉEL
// =======================================================================

function generateDataChecksum(data) {
  if (!data || !data.length) return 'empty';
  
  const summary = {
    count: data.length,
    first: data[0] ? JSON.stringify(data[0]).substring(0, 100) : '',
    last: data[data.length - 1] ? JSON.stringify(data[data.length - 1]).substring(0, 100) : ''
  };
  
  return btoa(JSON.stringify(summary)).substring(0, 20);
}

function getTableAttenteOptimized() {
  const cacheKey = 'table_attente_optimized';
  const startTime = Date.now();
  
  try {
    const sheet = _sheet(SHEET_ATTENTE);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (lastRow <= 1 || lastCol === 0) {
      const emptyResult = { 
        headers: [], 
        rows: [], 
        lastUpdate: startTime,
        checksum: 'empty',
        processingTime: Date.now() - startTime
      };
      DataCache.set(cacheKey, emptyResult, 'empty');
      return emptyResult;
    }
    
    const allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = allData[0];
    const dataRows = allData.slice(1);
    
    const newChecksum = generateDataChecksum(dataRows);
    
    const cachedData = DataCache.get(cacheKey);
    if (cachedData && !DataCache.hasChanged(cacheKey, newChecksum)) {
      cachedData.lastUpdate = startTime;
      cachedData.fromCache = true;
      return cachedData;
    }
    
    console.log(`🔄 Traitement de ${dataRows.length} lignes TOTALES (sans filtrage)`);
    
    // ✅ CORRECTION CRITIQUE : Ne plus filtrer du tout ici !
    // On retourne TOUTES les lignes, le filtrage se fera dans le Dashboard
    
    const result = {
      headers: headers,
      rows: dataRows, // ✅ TOUTES les lignes, sans exception
      lastUpdate: startTime,
      checksum: newChecksum,
      processingTime: Date.now() - startTime,
      fromCache: false,
      totalRows: dataRows.length,
      filteredRows: dataRows.length
    };
    
    DataCache.set(cacheKey, result, newChecksum);
    
    console.log(`✅ ${result.filteredRows} commandes TOTALES retournées (aucun filtrage côté serveur)`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur dans getTableAttenteOptimized:', error);
    
    const fallbackData = DataCache.get(cacheKey, 300000);
    if (fallbackData) {
      fallbackData.fromCache = true;
      fallbackData.error = error.message;
      return fallbackData;
    }
    
    throw error;
  }
}

function getTableAttente() {
  try {
    const result = getTableAttenteOptimized();
    return { headers: result.headers, rows: result.rows };
  } catch (error) {
    return _getTableFor(SHEET_ATTENTE);
  }
}

// =======================================================================
// 🔧 AJOUT DE COMMANDE OPTIMISÉ AVEC CORRECTION STATUT FORCÉ
// =======================================================================

function ajouterCommande(nom, regime, panierJson, modePaiement, carteInfoJson) {
  const startTime = Date.now();
  console.log(`🛒 Nouvelle commande de ${nom} - Mode: ${modePaiement}`);
  
  try {
    const elevesAutorises = getEleves();
    if (elevesAutorises.length > 0 && !elevesAutorises.includes(nom)) {
      throw new Error(`L'élève "${nom}" n'est pas dans la liste autorisée.`);
    }
    
    const panier = Array.isArray(panierJson) ? panierJson : JSON.parse(panierJson || '[]');
    let total = panier.reduce((s, {qte, prix}) => s + (qte * prix), 0);
    
    // 💳 CALCUL DU TOTAL À ENREGISTRER ET DÉBIT IMMÉDIAT DE LA CARTE
    let totalAEnregistrer = total;
    let statutPaiement = 'non_paye';
    let modePaiementFinal = modePaiement;
    
    if (modePaiement.includes('Carte Riptide')) {
      const nomParts = nom.split(' ').filter(part => part.length > 0);
      
      if (nomParts.length < 2) {
        throw new Error("Format de nom invalide. Attendu: 'Prénom Nom'");
      }
      
      const prenom = nomParts[0];
      const nomFamille = nomParts.slice(1).join(' ');
      const carteInfo = getCarteRiptide(prenom, nomFamille);
      
      if (!carteInfo.success || !carteInfo.hasCarte) {
        throw new Error("Vous n'avez pas de Carte Riptide");
      }
      
      const creditRestant = carteInfo.creditRestant || 0;
      
      if (modePaiement === 'Carte Riptide') {
        // ✅ PAIEMENT PUR PAR CARTE RIPTIDE
        if (creditRestant < total) {
          throw new Error(`Solde insuffisant (${creditRestant.toFixed(2)}€ disponible, ${total.toFixed(2)}€ requis)`);
        }
        
        // Débiter la carte immédiatement
        const paiementResult = payerAvecCarteRiptide(prenom, nomFamille, total);
        if (!paiementResult.success) {
          throw new Error(paiementResult.error || "Erreur paiement carte");
        }
        
        console.log(`💳 Carte débitée de ${total}€ pour ${nom}`);
        totalAEnregistrer = 0; // Ne rien compter dans la compta
        
      } else if (modePaiement.includes('Carte Riptide') && modePaiement.includes('+')) {
        // ✅ PAIEMENT MIXTE : Carte Riptide + Espèces/CB
        if (creditRestant <= 0) {
          throw new Error("Votre carte Riptide n'a plus de crédit");
        }
        
        const montantDepuisCarte = Math.min(creditRestant, total);
        const montantManquant = Math.max(0, total - creditRestant);
        
        // Débiter la carte immédiatement du montant disponible
        if (montantDepuisCarte > 0) {
          const paiementResult = payerAvecCarteRiptide(prenom, nomFamille, montantDepuisCarte);
          if (!paiementResult.success) {
            throw new Error(paiementResult.error || "Erreur paiement carte");
          }
          console.log(`💳 Carte débitée de ${montantDepuisCarte}€ (complément: ${montantManquant}€)`);
        }
        
        // Enregistrer uniquement le complément à payer
        totalAEnregistrer = montantManquant;
      }
    }
    
    const prefix = { "Carte bancaire": "CB", "Espèces": "ESP" }[modePaiement] || "CA";
    
    majEntetesCommandes();
    const numero = _nextNumero(prefix);
    const headers = buildDynamicHeaders();
    
    const qteByArticle = panier.reduce((map, {article, qte}) => {
      if (article && qte > 0) map[article] = (map[article] || 0) + qte;
      return map;
    }, {});
    
    const ligne = [
      _now(),
      numero,
      nom,
      regime,
      modePaiementFinal,
      totalAEnregistrer,  // ⭐ TOTAL AJUSTÉ (0 pour Carte pure, complément pour mixte)
      ...headers.slice(6, -2).map(a => qteByArticle[a] || 0),
      statutPaiement,
      false
    ];
    
    withLock(() => {
      const sh = _sheet(SHEET_ATTENTE);
      sh.appendRow(ligne);
      sh.getRange(sh.getLastRow(), headers.length)
        .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
    });
    
    DataCache.clear('table_attente_optimized');
    DataCache.clear('eleves_list_optimized');
    DataCache.clear();
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Commande ${numero} créée en ${processingTime}ms (Total enregistré: ${totalAEnregistrer}€)`);
    
    return {
      success: true,
      numero: numero,
      nom: nom,
      regime: regime,
      total: total,
      totalEnregistre: totalAEnregistrer,
      paiement: modePaiementFinal,
      date: ligne[0],
      processingTime: processingTime,
      statutPaiement: statutPaiement
    };
    
  } catch (error) {
    console.error('❌ Erreur ajout commande:', error);
    throw new Error(`Erreur lors de l'ajout de la commande: ${error.message}`);
  }
}
// =======================================================================
// NUMÉROTATION ET GESTION
// =======================================================================

function _scanMaxCounter() {
  const sh = _sheet(SHEET_ATTENTE);
  if (sh.getLastRow() < 2) return 0;
  
  // ✅ Scanner TOUS les numéros de commande, peu importe le préfixe
  return sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues()
    .map(r => {
      const numStr = String(r[0] || '');
      // Extraire le numéro après le tiret (CB-001 → 1, ESP-042 → 42)
      const parts = numStr.split('-');
      return parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);
}

function _nextNumero(prefix) {
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  return withLock(() => {
    // ✅ Compteur unique pour tous les moyens de paiement
    const key = `COUNTER_GLOBAL_${today}`;
    let cur = parseInt(getProp(key, _scanMaxCounter()), 10) || 0;
    setProp(key, ++cur);
    return `${prefix}-${String(cur).padStart(3, '0')}`;
  });
}

const buildDynamicHeaders = () => [
  "Date",
  "N° Commande", 
  "Nom",
  "Commentaires",
  "Paiement",
  "Total €",
  ...getMenu().map(m => m.article),
  "Statut Paiement", // 🆕 Colonne critique pour le système deux colonnes
  "Validée"
];

function _applyCheckboxValidation(sh, colIndex) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;
  const colRange = sh.getRange(2, colIndex, lastRow - 1, 1);
  const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  colRange.setDataValidation(rule);
  colRange.setValues(colRange.getValues().map(([v]) => [!!v]));
}

function majEntetesCommandes() {
  const headers = buildDynamicHeaders();

  [SHEET_ATTENTE, SHEET_EFFECTUEES].forEach(name => {
    const sh = _sheet(name);

    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);

    if (sh.getLastColumn() > headers.length) {
      sh.deleteColumns(headers.length + 1, sh.getLastColumn() - headers.length);
    }

    if (name === SHEET_ATTENTE) {
      _applyCheckboxValidation(sh, headers.length);
    }
  });
  
  DataCache.clear();
}

function transfererCommandesValidees() {
  console.log('🔄 Début du transfert des commandes validées');
  const startTime = Date.now();
  
  return withLock(() => {
    const src = _sheet(SHEET_ATTENTE);
    const dst = _sheet(SHEET_EFFECTUEES);

    if (src.getLastRow() < 2) {
      return { transferred: 0, message: "Aucune commande à transférer" };
    }

    const headers = src.getRange(1, 1, 1, src.getLastColumn()).getValues()[0];
    const validColIndex = headers.indexOf("Validée");
    if (validColIndex === -1) throw new Error("Colonne 'Validée' introuvable !");

    const data = src.getRange(2, 1, src.getLastRow() - 1, headers.length).getValues();
    const now = _now();

    const [validees, restantes] = data.reduce(([val, keep], row) => {
      if (row[validColIndex] === true) {
        row[validColIndex] = `Validée le ${now}`;
        
        // 🆕 Mise à jour des stocks pour chaque commande validée
        try {
          updateStocksFromCommand(row, headers);
        } catch (stockError) {
          console.error("Erreur stocks:", stockError);
        }
        
        majCommandesDepuisRow(row, headers);
        val.push(row);
      } else {
        keep.push(row);
      }
      return [val, keep];
    }, [[], []]);

    if (validees.length) {
      const dstLastRow = dst.getLastRow();
      const startRow = dstLastRow === 0 ? 2 : dstLastRow + 1;
      dst.insertRowsAfter(dstLastRow || 1, validees.length);
      dst.getRange(startRow, 1, validees.length, headers.length).setValues(validees);
    }

    src.deleteRows(2, src.getLastRow() - 1);
    if (restantes.length) {
      src.insertRowsAfter(1, restantes.length);
      src.getRange(2, 1, restantes.length, headers.length).setValues(restantes);
      _applyCheckboxValidation(src, validColIndex + 1);
    }
    
    DataCache.clear();
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ${validees.length} commandes transférées en ${processingTime}ms`);
    
    return { 
      transferred: validees.length, 
      remaining: restantes.length,
      processingTime: processingTime,
      message: `${validees.length} commande(s) transférée(s) avec succès`
    };
  });
}

function majCommandesDepuisRow(row, headers) {
  try {
    const sh = _sheet(SHEET_MENU);
    if (sh.getLastRow() < 2) return;

    const menu = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
    const map = {};
    const quantities = [];
    
    for (let i = 0; i < menu.length; i++) {
      const articleName = String(menu[i][1] || '').trim();
      if (articleName) {
        map[articleName] = i;
        quantities[i] = Number(menu[i][3]) || 0;
      }
    }

    const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
    const statutColIndex = headers.findIndex(h => /statut.*paiement/i.test((h || '').toString()));
    const valideeColIndex = headers.findIndex(h => /valid[ée]e?/i.test((h || '').toString()));
    
    const startItems = totalColIndex !== -1 ? totalColIndex + 1 : 6;
    const endItems = statutColIndex !== -1 ? statutColIndex : 
                     (valideeColIndex !== -1 ? valideeColIndex : headers.length);
    
    for (let i = startItems; i < endItems; i++) {
      const articleHeader = String(headers[i] || '').trim();
      const qte = Number(row[i]) || 0;
      
      if (!articleHeader || qte <= 0) continue;
      
      let foundIndex = -1;
      
      if (map[articleHeader] !== undefined) {
        foundIndex = map[articleHeader];
      } else {
        const normalizedHeader = articleHeader.toLowerCase().replace(/\s+/g, ' ');
        for (const [menuArticle, index] of Object.entries(map)) {
          const normalizedMenu = menuArticle.toLowerCase().replace(/\s+/g, ' ');
          if (normalizedMenu === normalizedHeader || 
              normalizedMenu.includes(normalizedHeader) || 
              normalizedHeader.includes(normalizedMenu)) {
            foundIndex = index;
            break;
          }
        }
      }
      
      if (foundIndex !== -1) {
        quantities[foundIndex] += qte;
      }
    }

    if (quantities.length > 0) {
      sh.getRange(2, 4, quantities.length, 1).setValues(quantities.map(q => [q]));
    }
    
    DataCache.clear('menu_data');
    
  } catch (error) {
    console.error("Erreur dans majCommandesDepuisRow:", error);
  }
}

// =======================================================================
// MENU ET LECTURE
// =======================================================================

function getMenu() {
  const cacheKey = 'menu_data';
  let cached = DataCache.get(cacheKey, 60000);
  if (cached) return cached;

  const sheet = SpreadsheetApp.getActive().getSheetByName("Menu");
  const values = sheet.getDataRange().getValues();
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    data.push({
      categorie: row[0],
      article: row[1],
      prix: row[2],
      actif: row[4] === true
    });
  }
  
  DataCache.set(cacheKey, data);
  return data;
}

function _getTableFor(name) {
  const cacheKey = `table_${name.toLowerCase().replace(/\s+/g, '_')}`;
  let cached = DataCache.get(cacheKey);
  if (cached) return cached;

  const sh = _sheet(name);
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  
  if (lastRow < 2 || lastCol === 0) {
    const result = { headers: [], rows: [] };
    DataCache.set(cacheKey, result);
    return result;
  }
  
  const headers = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  const rows = sh.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
  const result = { headers, rows };
  
  DataCache.set(cacheKey, result);
  return result;
}

function getTableValidees() { 
  return _getTableFor(SHEET_EFFECTUEES); 
}

// =======================================================================
// FONCTIONS UTILITAIRES
// =======================================================================

function resetCompteursJour() {
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const props = PropertiesService.getDocumentProperties();
  
  return withLock(() => {
    // ✅ 1. Supprimer le compteur global du jour dans les propriétés
    const key = `COUNTER_GLOBAL_${today}`;
    props.deleteProperty(key);
    
    // ✅ 2. Nettoyer aussi les anciens compteurs par préfixe si présents
    Object.keys(props.getProperties()).forEach(k => {
      if (k.startsWith('COUNTER_')) {
        props.deleteProperty(k);
      }
    });
    
    // ✅ 3. Forcer la réinitialisation en définissant explicitement à 0
    setProp(key, '0');
    
    // ✅ 4. Vider le cache pour forcer le rechargement
    DataCache.clear();
    
    console.log('✅ Compteur réinitialisé à 0');
    
    // ✅ 5. Vérification : afficher le prochain numéro
    const nextCB = _nextNumero("CB");
    const nextESP = _nextNumero("ESP");
    
    SpreadsheetApp.getUi().alert(
      '✅ Compteur réinitialisé avec succès !\n\n' +
      'Prochains numéros :\n' +
      `- CB: ${nextCB}\n` +
      `- ESP: ${nextESP}\n\n` +
      'Note : Les commandes existantes dans la feuille ne sont pas affectées.'
    );
    
    return {
      success: true,
      message: 'Compteur réinitialisé',
      nextCB: nextCB,
      nextESP: nextESP
    };
  });
}
/**
 * 🔄 Reset COMPLET : efface le compteur ET ignore les commandes existantes
 */
function resetCompletCompteur() {
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  
  return withLock(() => {
    // 1. Supprimer toutes les propriétés de compteur
    const props = PropertiesService.getDocumentProperties();
    Object.keys(props.getProperties()).forEach(k => {
      if (k.startsWith('COUNTER_')) {
        props.deleteProperty(k);
      }
    });
    
    // 2. Forcer le compteur à 0
    const key = `COUNTER_GLOBAL_${today}`;
    setProp(key, '0');
    
    // 3. Vider le cache
    DataCache.clear();
    
    // 4. Test : générer 3 numéros pour vérifier
    const test1 = _nextNumero("CB");
    const test2 = _nextNumero("ESP");
    const test3 = _nextNumero("CA");
    
    SpreadsheetApp.getUi().alert(
      '🔄 Reset COMPLET effectué !\n\n' +
      'Tests :\n' +
      `1. ${test1}\n` +
      `2. ${test2}\n` +
      `3. ${test3}\n\n` +
      'Le compteur repart bien de 1 !'
    );
    
    return {
      success: true,
      test1: test1,
      test2: test2,
      test3: test3
    };
  });
}
function clearPerformanceCache() {
  DataCache.clear();
  SpreadsheetApp.getUi().alert('Cache de performance vidé.');
}

function showCacheStats() {
  const stats = DataCache.getStats();
  const message = `Stats du Cache:
- Entrées: ${stats.cacheSize}
- Plus ancienne: ${new Date(stats.oldestEntry).toLocaleString()}
- Plus récente: ${new Date(stats.newestEntry).toLocaleString()}`;
  
  SpreadsheetApp.getUi().alert(message);
}

// =======================================================================
// WEB UI
// =======================================================================

function doGet(e) {
  if (e?.parameter?.page === "dashboard") {
    return HtmlService.createHtmlOutputFromFile("Dashboard")
      .setTitle("Gestion des commandes - Deux Colonnes")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createHtmlOutputFromFile("PageCommande")
    .setTitle("Passer une commande")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =======================================================================
// AUTRES FONCTIONS DE COMPATIBILITÉ
// =======================================================================

function performSingleActionByIdentification(payload) {
  // Rediriger vers les nouvelles fonctions selon l'action
  if (payload.action === 'marquer_paye') {
    return marquerCommandeCommePaye(payload);
  } else if (payload.action === 'marquer_distribue') {
    return marquerCommandeCommeDistribue(payload);
  } else if (payload.action === 'validate') {
    return marquerCommandeCommeDistribue(payload);
  } else if (payload.action === 'annuler') {
    return annulerCommande(payload);
  } else if (payload.action === 'delete') {
    // Fonction de suppression classique
    return performSingleActionByIdentificationClassic(payload);
  } else {
    return { success: false, error: "Action non reconnue" };
  }
}

function performSingleActionByIdentificationClassic(payload) {
  const { commandeNumber, clientName, action } = payload;
  
  if (!['delete'].includes(action)) {
    return { success: false, error: "Action non valide pour cette fonction" };
  }
  
  try {
    return withLock(() => {
      const sheet = _sheet(SHEET_ATTENTE);
      const lastRow = sheet.getLastRow();
      
      if (lastRow <= 1) {
        return { success: false, error: "Aucune commande en attente" };
      }
      
      const allData = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
      const headers = allData[0];
      
      const cmdColumnIndex = headers.findIndex(h => /n[°o]?\s*commande|commande/i.test((h || '').toString()));
      const nomColumnIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()) || /client|nom/i.test((h || '').toString()));
      
      if (cmdColumnIndex === -1 || nomColumnIndex === -1) {
        return { success: false, error: "Colonnes requises non trouvées" };
      }
      
      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        const rowCmdNum = String(row[cmdColumnIndex] || '').trim();
        const rowClientName = String(row[nomColumnIndex] || '').trim();
        
        if (rowCmdNum === String(commandeNumber).trim() && 
            rowClientName.toLowerCase() === String(clientName).toLowerCase().trim()) {
          targetRowIndex = i;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return { 
          success: false, 
          error: `Commande ${commandeNumber} de ${clientName} introuvable`
        };
      }
      
      const googleSheetRow = targetRowIndex + 1;
      sheet.deleteRow(googleSheetRow);
      
      DataCache.clear();
      
      return { 
        success: true, 
        message: `Commande ${commandeNumber} supprimée avec succès`,
        action: 'delete'
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur dans performSingleActionByIdentificationClassic:', error);
    return { success: false, error: `Erreur serveur: ${error.message}` };
  }
}

// =======================================================================
// 💳 GESTION DES CARTES RIPTIDE - VERSION CORRIGÉE SANS DOUBLONS
// =======================================================================

/**
 * 💳 Crée automatiquement l'onglet Cartes Riptide s'il n'existe pas
 */
function creerOngletCartesRiptide() {
  console.log('💳 Vérification/Création de l\'onglet Cartes Riptide...');
  
  try {
    const ss = _ss();
    let sheet = ss.getSheetByName(SHEET_CARTES_RIPTIDE);
    
    if (!sheet) {
      console.log('💳 Création de l\'onglet Cartes Riptide...');
      sheet = ss.insertSheet(SHEET_CARTES_RIPTIDE);
      
      const headers = ['Prénom', 'Nom', 'Crédit restant (€)', 'Crédit total (€)', 'Montant payé (€)', 'Date d\'achat', 'Nombre de cartes achetées'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#FF6B6B');
      headerRange.setFontColor('white');
      headerRange.setHorizontalAlignment('center');
      
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 7, 120);
      
      console.log('✅ Onglet Cartes Riptide créé');
    }
    
    return { success: true, sheet: sheet };
    
  } catch (error) {
    console.error('❌ Erreur création onglet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 💳 Initialise l'onglet au démarrage
 */
function initCartesRiptide() {
  try {
    const result = creerOngletCartesRiptide();
    return result.success;
  } catch (error) {
    console.error('❌ Erreur init:', error);
    return false;
  }
}

/**
 * 💳 Récupère les informations de carte d'un élève - VERSION UNIQUE
 */
function getCarteRiptide(prenom, nom) {
  Logger.log('DEBUT getCarteRiptide: ' + prenom + ' ' + nom);
  
  try {
    // Test basique
    if (!prenom || !nom) {
      Logger.log('Prenom ou nom manquant');
      return {
        success: true,
        hasCarte: false,
        creditRestant: 0,
        message: "Données manquantes"
      };
    }

    const ss = _ss();
    const sh = ss.getSheetByName(SHEET_CARTES_RIPTIDE);
    
    if (!sh) {
      Logger.log('Onglet inexistant');
      return {
        success: true,
        hasCarte: false,
        creditRestant: 0,
        message: "Onglet Cartes Riptide non trouvé"
      };
    }

    if (sh.getLastRow() < 2) {
      Logger.log('Onglet vide');
      return {
        success: true,
        hasCarte: false,
        creditRestant: 0,
        message: "Aucune carte enregistrée"
      };
    }

    const data = sh.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('Headers: ' + JSON.stringify(headers));
    
    const prenomIdx = headers.findIndex(h => /pr[ée]nom/i.test(String(h)));
    const nomIdx = headers.findIndex(h => /^nom$/i.test(String(h)));
    const creditIdx = headers.findIndex(h => /cr[ée]dit.*restant/i.test(String(h)));
    
    Logger.log('Index: prenom=' + prenomIdx + ', nom=' + nomIdx + ', credit=' + creditIdx);
    
    if (prenomIdx === -1 || nomIdx === -1 || creditIdx === -1) {
      return {
        success: true,
        hasCarte: false,
        creditRestant: 0,
        message: "Structure incorrecte"
      };
    }

    for (let i = 1; i < data.length; i++) {
      const rowPrenom = String(data[i][prenomIdx] || '').trim().toLowerCase();
      const rowNom = String(data[i][nomIdx] || '').trim().toLowerCase();
      
      if (rowPrenom === prenom.toLowerCase() && rowNom === nom.toLowerCase()) {
        const credit = parseFloat(data[i][creditIdx]) || 0;
        Logger.log('Carte trouvee: ' + credit + ' euros');
        return {
          success: true,
          hasCarte: true,
          creditRestant: credit,
          rowIndex: i + 1
        };
      }
    }

    Logger.log('Aucune carte trouvee');
    return {
      success: true,
      hasCarte: false,
      creditRestant: 0,
      message: "Aucune carte Riptide"
    };

  } catch (error) {
    Logger.log('ERREUR: ' + error.toString());
    return {
      success: false,
      hasCarte: false,
      creditRestant: 0,
      error: error.message
    };
  }
}

/**
 * 💳 Acheter ou recharger une carte Riptide
 */
function acheterCarteRiptide(prenom, nom) {
  console.log(`💳 Achat/Rechargement: ${prenom} ${nom}`);

  try {
    if (!prenom || !nom) {
      return { success: false, error: "Prénom et nom requis" };
    }

    return withLock(() => {
      // Créer l'onglet si nécessaire
      const initResult = creerOngletCartesRiptide();
      if (!initResult.success) {
        return { success: false, error: "Impossible de créer l'onglet" };
      }

      const sh = initResult.sheet;
      let headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

      const prenomIndex = headers.findIndex(h => /pr[ée]nom/i.test((h || '').toString()));
      const nomIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()));
      const creditRestantIndex = headers.findIndex(h => /cr[ée]dit.*restant/i.test((h || '').toString()));
      const creditTotalIndex = headers.findIndex(h => /cr[ée]dit.*total/i.test((h || '').toString()));
      const montantPayeIndex = headers.findIndex(h => /montant.*pay[ée]/i.test((h || '').toString()));
      const dateAchatIndex = headers.findIndex(h => /date.*achat/i.test((h || '').toString()));
      const nbCartesIndex = headers.findIndex(h => /nombre.*cartes/i.test((h || '').toString()));

      let targetRowIndex = -1;
      let currentData = null;

      if (sh.getLastRow() > 1) {
        const existingData = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();

        for (let i = 0; i < existingData.length; i++) {
          const row = existingData[i];
          if (String(row[prenomIndex] || '').trim().toLowerCase() === prenom.toLowerCase() && 
              String(row[nomIndex] || '').trim().toLowerCase() === nom.toLowerCase()) {
            targetRowIndex = i + 2;
            currentData = row;
            break;
          }
        }
      }

      const now = _now();

      if (targetRowIndex !== -1) {
        // Recharge
        const newRow = [...currentData];
        newRow[creditRestantIndex] = (parseFloat(currentData[creditRestantIndex]) || 0) + 11;
        newRow[creditTotalIndex] = (parseFloat(currentData[creditTotalIndex]) || 0) + 11;
        newRow[montantPayeIndex] = (parseFloat(currentData[montantPayeIndex]) || 0) + 10;
        newRow[dateAchatIndex] = now;
        newRow[nbCartesIndex] = (parseInt(currentData[nbCartesIndex]) || 0) + 1;

        sh.getRange(targetRowIndex, 1, 1, headers.length).setValues([newRow]);

        return {
          success: true,
          message: `Carte rechargée — 11 € crédités`,
          creditRestant: newRow[creditRestantIndex],
          action: 'recharge'
        };

      } else {
        // Nouvelle carte
        const newRow = new Array(headers.length).fill('');
        newRow[prenomIndex] = prenom;
        newRow[nomIndex] = nom;
        newRow[creditRestantIndex] = 11;
        newRow[creditTotalIndex] = 11;
        newRow[montantPayeIndex] = 10;
        newRow[dateAchatIndex] = now;
        newRow[nbCartesIndex] = 1;

        sh.appendRow(newRow);

        return {
          success: true,
          message: `Carte créée — 11 € crédités`,
          creditRestant: 11,
          action: 'creation'
        };
      }
    });

  } catch (error) {
    console.error('❌ Erreur acheterCarteRiptide:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 💳 Payer avec une carte Riptide
 */
function payerAvecCarteRiptide(prenom, nom, montantCommande) {
  console.log(`💳 Paiement: ${prenom} ${nom} - ${montantCommande}€`);

  try {
    if (!prenom || !nom || !montantCommande || montantCommande <= 0) {
      return { success: false, error: "Données invalides" };
    }

    return withLock(() => {
      const carteInfo = getCarteRiptide(prenom, nom);

      if (!carteInfo.success || !carteInfo.hasCarte) {
        return {
          success: false,
          error: "Aucune carte",
          needsCard: true
        };
      }

      const creditRestant = carteInfo.creditRestant;

      if (creditRestant <= 0) {
        return {
          success: false,
          error: "Solde insuffisant",
          creditRestant: 0,
          montantManquant: montantCommande,
          needsComplement: true
        };
      }

      const ss = _ss();
      const sh = ss.getSheetByName(SHEET_CARTES_RIPTIDE);
      const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const creditRestantIndex = headers.findIndex(h => /cr[ée]dit.*restant/i.test((h || '').toString()));

      if (creditRestant >= montantCommande) {
        // Paiement complet
        const nouveauCredit = creditRestant - montantCommande;
        sh.getRange(carteInfo.rowIndex, creditRestantIndex + 1).setValue(nouveauCredit);

        return {
          success: true,
          message: `Paiement effectué`,
          creditRestant: nouveauCredit,
          montantDebite: montantCommande,
          paiementComplet: true
        };

      } else {
        // Paiement partiel
        const montantManquant = montantCommande - creditRestant;
        sh.getRange(carteInfo.rowIndex, creditRestantIndex + 1).setValue(0);

        return {
          success: true,
          message: `Reste ${montantManquant.toFixed(2)} € à payer`,
          creditRestant: 0,
          montantDebite: creditRestant,
          montantManquant: montantManquant,
          paiementComplet: false,
          needsComplement: true
        };
      }
    });

  } catch (error) {
    console.error('❌ Erreur paiement:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 🎨 Mise en forme de l'onglet Cartes Riptide
 */
function appliquerMiseEnFormeCartesRiptide(sheet) {
  if (sheet.getLastRow() < 1) return;
  
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#FF6B6B');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  if (sheet.getLastRow() > 1) {
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBorder(true, true, true, true, false, false);
    
    const headers = headerRange.getValues()[0];
    const creditRestantIndex = headers.findIndex(h => /crédit.*restant/i.test((h || '').toString()));
    
    if (creditRestantIndex !== -1) {
      const creditRange = sheet.getRange(2, creditRestantIndex + 1, sheet.getLastRow() - 1, 1);
      creditRange.setNumberFormat('0.00"€"');
      
      for (let i = 2; i <= sheet.getLastRow(); i++) {
        const creditValue = sheet.getRange(i, creditRestantIndex + 1).getValue();
        const rowRange = sheet.getRange(i, 1, 1, sheet.getLastColumn());
        
        if (typeof creditValue === 'number') {
          if (creditValue <= 0) {
            rowRange.setBackground('#ffcdd2');
          } else if (creditValue <= 5) {
            rowRange.setBackground('#ffebee');
          }
        }
      }
    }
  }
  
  sheet.setFrozenRows(1);
}

/**
 * 💳 Récupère toutes les cartes pour le dashboard
 */
function getCartesRiptideData() {
  try {
    const ss = _ss();
    const sh = ss.getSheetByName(SHEET_CARTES_RIPTIDE);
    
    if (!sh || sh.getLastRow() < 2) {
      return { success: true, cartes: [] };
    }
    
    const allData = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    const headers = allData[0];
    
    const prenomIndex = headers.findIndex(h => /pr[ée]nom/i.test((h || '').toString()));
    const nomIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()));
    const creditRestantIndex = headers.findIndex(h => /cr[ée]dit.*restant/i.test((h || '').toString()));
    
    const cartes = [];
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      cartes.push({
        prenom: row[prenomIndex] || '',
        nom: row[nomIndex] || '',
        creditRestant: parseFloat(row[creditRestantIndex]) || 0
      });
    }
    
    return { success: true, cartes: cartes };
    
  } catch (error) {
    console.error('❌ Erreur getCartesRiptideData:', error);
    return { success: false, error: error.message, cartes: [] };
  }
}
/**
 * 🗑️ Annule une commande (suppression définitive)
 */
function annulerCommande(payload) {
  console.log(`🗑️ Annulation commande: ${payload.commandeNumber}`);
  
  try {
    if (!payload.commandeNumber || !payload.clientName) {
      return { success: false, error: "Données d'identification manquantes" };
    }
    
    return withLock(() => {
      const sheet = _sheet(SHEET_ATTENTE);
      const lastRow = sheet.getLastRow();
      
      if (lastRow <= 1) {
        return { success: false, error: "Aucune commande en attente" };
      }
      
      const allData = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
      const headers = allData[0];
      
      const cmdColumnIndex = headers.findIndex(h => /n[°o]?\s*commande|commande/i.test((h || '').toString()));
      const nomColumnIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()) || /client|nom/i.test((h || '').toString()));
      
      if (cmdColumnIndex === -1 || nomColumnIndex === -1) {
        return { success: false, error: "Colonnes requises non trouvées" };
      }
      
      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        const rowCmdNum = String(row[cmdColumnIndex] || '').trim();
        const rowClientName = String(row[nomColumnIndex] || '').trim();
        
        if (rowCmdNum === String(payload.commandeNumber).trim() && 
            rowClientName.toLowerCase() === String(payload.clientName).toLowerCase().trim()) {
          targetRowIndex = i;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return { 
          success: false, 
          error: `Commande ${payload.commandeNumber} de ${payload.clientName} introuvable`
        };
      }
      
      const googleSheetRow = targetRowIndex + 1;
      sheet.deleteRow(googleSheetRow);
      
      DataCache.clear();
      
      console.log(`✅ Commande ${payload.commandeNumber} annulée et supprimée`);
      
      return { 
        success: true, 
        message: `Commande ${payload.commandeNumber} annulée avec succès`,
        action: 'annuler'
      };
    });
    
  } catch (error) {
    console.error('❌ Erreur dans annulerCommande:', error);
    return { success: false, error: `Erreur serveur: ${error.message}` };
  }
}
/**
 * 🆕 Vérifie si une commande ne contient QUE des cartes Riptide
 */
function isCarteRiptideOnly(rowData, headers) {
  const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
  const statutColIndex = headers.findIndex(h => /statut.*paiement/i.test((h || '').toString()));
  const valideeColIndex = headers.findIndex(h => /validée?/i.test((h || '').toString()));
  
  const startItems = totalColIndex !== -1 ? totalColIndex + 1 : 6;
  const endItems = statutColIndex !== -1 ? statutColIndex : 
                   (valideeColIndex !== -1 ? valideeColIndex : headers.length);
  
  let hasCarteRiptide = false;
  let hasOtherItems = false;
  
  for (let i = startItems; i < endItems; i++) {
    const articleHeader = String(headers[i] || '').trim().toLowerCase();
    const qte = parseInt(rowData[i]) || 0;
    
    if (qte > 0) {
      if (articleHeader.includes('carte') && articleHeader.includes('riptide')) {
        hasCarteRiptide = true;
      } else {
        hasOtherItems = true;
      }
    }
  }
  
  return hasCarteRiptide && !hasOtherItems;
}
/**
 * 🆕 Met à jour les stocks selon une commande validée
 */
function updateStocksFromCommand(rowData, headers) {
  console.log('📦 Mise à jour des stocks suite à une commande validée');
  
  try {
    // Identifier la plage des articles dans les headers
    const totalColIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
    const statutColIndex = headers.findIndex(h => /statut.*paiement/i.test((h || '').toString()));
    const valideeColIndex = headers.findIndex(h => /validée?/i.test((h || '').toString()));
    
    const startItems = totalColIndex !== -1 ? totalColIndex + 1 : 6;
    const endItems = statutColIndex !== -1 ? statutColIndex : 
                     (valideeColIndex !== -1 ? valideeColIndex : headers.length);
    
    let stockUpdates = [];
    
    // Pour chaque article dans la commande
    for (let i = startItems; i < endItems; i++) {
      const articleHeader = String(headers[i] || '').trim();
      const quantity = parseInt(rowData[i]) || 0;
      
      if (!articleHeader || quantity <= 0) continue;
      
      // 🆕 NE PAS déduire du stock si c'est une carte Riptide
      const isCarteRiptide = articleHeader.toLowerCase().includes('carte') && 
                             articleHeader.toLowerCase().includes('riptide');
      
      if (isCarteRiptide) {
        console.log(`💳 ${articleHeader} x${quantity} - Carte Riptide, pas de déduction de stock`);
        continue;
      }
      
      // Mettre à jour le stock de cet article
      stockUpdates.push({ article: articleHeader, quantity: quantity });
      updateStockFromSale(articleHeader, quantity);
    }
    
    if (stockUpdates.length > 0) {
      console.log(`✅ Mise à jour des stocks terminée - ${stockUpdates.length} article(s) traité(s)`);
    } else {
      console.log('ℹ️ Aucun stock à mettre à jour (commande de cartes Riptide uniquement)');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des stocks:', error);
    // Ne pas propager l'erreur pour ne pas faire échouer la validation de commande
  }
}
/**
 * 🆕 Récupère les commandes de cartes Riptide séparément
 */
function getCommandesCartesRiptide() {
  try {
    const sheetAttente = _sheet(SHEET_ATTENTE);
    const sheetEffectuees = _sheet(SHEET_EFFECTUEES);
    
    const commandesCartes = [];
    
    // Fonction helper pour analyser une feuille
    function analyserFeuille(sheet, statut) {
      if (sheet.getLastRow() < 2) return;
      
      const allData = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
      const headers = allData[0];
      
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        
        if (isCarteRiptideOnly(row, headers)) {
          const cmdIndex = headers.findIndex(h => /n°.*commande|commande/i.test((h || '').toString()));
          const nomIndex = headers.findIndex(h => /^nom$/i.test((h || '').toString()));
          const dateIndex = headers.findIndex(h => /date/i.test((h || '').toString()));
          const totalIndex = headers.findIndex(h => /total/i.test((h || '').toString()));
          
          commandesCartes.push({
            numero: cmdIndex !== -1 ? row[cmdIndex] : '?',
            nom: nomIndex !== -1 ? row[nomIndex] : '?',
            date: dateIndex !== -1 ? row[dateIndex] : '',
            total: totalIndex !== -1 ? row[totalIndex] : 0,
            statut: statut
          });
        }
      }
    }
    
    analyserFeuille(sheetAttente, 'En attente');
    analyserFeuille(sheetEffectuees, 'Effectuée');
    
    return {
      success: true,
      commandesCartes: commandesCartes,
      total: commandesCartes.length
    };
    
  } catch (error) {
    console.error('❌ Erreur getCommandesCartesRiptide:', error);
    return {
      success: false,
      error: error.message,
      commandesCartes: []
    };
  }
}
