//Level names
var level_names_en = ["Orange is the new ghost", "Cross the line", "Death from above", "Still not bullet hell", "Encapsulated",
   "Stand behind me", "Banzai", "Target almost locked", "Well Played", "Rainbow",
   "Eleven","Deadly checkers", "To the top with you", "Not based on opinion", "Thanks for the gold",
   "Hard core", "Caution : unstable", "Getting tougher", "All over the place", "BOSS (COMING SOON)",
   "Attack of the ninjas"
];

var level_names_fr = ["Alerte orange", "La ligne rouge", "La mort vient d'en haut", "Ceci n'est pas un bullet hell", "Capsule",
    "Reste derrière moi", "Banzai", "Cible presque verrouillée", "Bien joué", "Arc-en-ciel",
    "Onze","Échiquier fatal", "Au top", "Pas basé sur l'opinion", "Merci pour l'or",
    "Noyau dur", "Danger : instable", "Ça se complique", "Y en a partout", "BOSS (BIENTÔT)",
    "L'attaque des ninjas"
];

//Speed values for each level : Start speed, speedup each time an enemy is killed, acceleration of the speedup
var speed_values = [[20,4,0.25], [20,5,0.25], [20,4,0.25], [20,5,0.5], [10,5,0.5], //5
    [20,4,0.3],  [20,6,0.5],  [20,4,0.4],  [15,5,0.3], [20,4,0.5], //10
    [20,5,0.25], [25,4,0.5],  [20,15,0.5], [20,15,0.5], [15,4,0.4], //15
    [15,4,0.3],  [25,5,0.4],  [15,4,0.25], [20,4,0.25], [0,0,0], //20
    [20,4,0.5],
];
