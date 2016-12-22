//Level names
var level_names_en = ["Orange is the new ghost", "Cross the line", "Death from above", "Still not bullet hell", "Encapsulated",
   "Stand behind me", "Banzai", "Target almost locked", "Well Played", "Rainbow",
   "Eleven","Deadly checkers", "To the top with you", "Not based on opinion", "Thanks for the gold",
   "Hard core", "Caution : unstable", "Getting tougher", "All over the place", "Cyano the Sprinkling Photon",
   "Attack of the ninjas", "Twenty two", "Looks simple ?...", "Stand behind me II"
];

var level_names_fr = ["Alerte orange", "La ligne rouge", "La mort vient d'en haut", "Ceci n'est pas un bullet hell", "Capsule",
    "Reste derrière moi", "Banzai", "Cible presque verrouillée", "Bien joué", "Arc-en-ciel",
    "Onze","Échiquier fatal", "Au top", "Pas basé sur l'opinion", "Merci pour l'or",
    "Noyau dur", "Danger : instable", "Ça se complique", "Y en a partout", "Cyano le Photon Arroseur",
    "L'attaque des ninjas", "Vingt-deux", "Trop facile ?...", "Reste derrière moi II"
];

//var hints_fr = ["Appuyez sur MAJ pour lancer un tir spécial. Vous en avez un par vie.", "Chaque niveau de puissance possède un tir spécial différent.", "Ramassez des pièces pour gagner des tirs spéciaux !"];
var hints_fr = new Map();
    hints_fr.set(1, "Appuyez sur MAJ pour lancer un tir spécial. Vous en avez un par vie.");
    hints_fr.set(5, "Chaque niveau de puissance possède un tir spécial différent.");
    hints_fr.set(9, "Ramassez des pièces pour gagner des tirs spéciaux !");
    hints_fr.set(18, "Le prochain niveau est un boss !");

//Speed values for each level : Start speed, speedup each time an enemy is killed, acceleration of the speedup
var speed_values = [[20,4,0.25], [20,5,0.25], [20,4,0.25], [20,5,0.5], [10,5,0.5], //5
    [20,4,0.3],  [20,6,0.5],  [20,4,0.4],  [10,4,0.25], [20,4,0.5], //10
    [20,5,0.5], [25,4,0.5],  [20,15,0.5], [20,15,0.5], [15,4,0.4], //15
    [15,4,0.3],  [25,5,0.4],  [15,4,0.25], [20,4,0.25], [80,4,0.25], //20
    [20,4,0.5], [20,5,0.25], [5, 300, 300], [20,3,0.15]
];
