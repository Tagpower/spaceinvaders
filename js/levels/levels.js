// Levels
var levels = [[[0,0,1,1,1,1,1,1,0,0], //Level 1
    [0,1,1,1,1,1,1,1,1,0], //Orange is the new ghost
    [1,1,1,1,1,1,1,1,1,1], //Alerte Orange
    [1,1,1,1,1,1,1,1,1,1]],

    [[0,0,1,1,1,1,1,1,0,0], //Level 2
    [0,1,1,1,1,1,1,1,1,0], //Cross the line
    [2,2,2,2,2,2,2,2,2,2], //La ligne rouge
    [1,1,1,1,1,1,1,1,1,1]],

    [[0,0,1,1,1,1,1,1,0,0], //Level 3
    [0,1,1,1,1,1,1,1,1,0], //Death from above
    [3,3,3,3,3,3,3,3,3,3], //La mort vient d'en haut
    [3,3,3,3,3,3,3,3,3,3]],

    [[0,0,1,1,1,1,1,1,0,0], //Level 4
    [0,4,4,4,4,4,4,4,4,0], //Still not bullet hell
    [4,4,4,4,4,4,4,4,4,4], //Ceci n'est pas un bullet hell
    [1,1,1,1,1,1,1,1,1,1]],

    [[0,0,5,5,5,5,5,5,0,0], //Level 5
    [0,5,4,4,4,4,4,4,5,0], //Encapsulated
    [0,5,4,4,4,4,4,4,5,0], //Capsule
    [0,0,5,5,5,5,5,5,0,0]],

    [[3,3,3,3,3,3,3,3,3,3], //Level 6
    [1,1,1,1,1,1,1,1,1,1], //Stand behind me
    [1,1,1,1,1,1,1,1,1,1], //Reste derrière moi
    [5,5,5,5,5,5,5,5,5,5]],

    [[0,6,6,6,6,6,6,6,6,0], //Level 7
    [6,6,6,6,6,6,6,6,6,6], //Banzai
    [6,6,6,6,6,6,6,6,6,6]],//Banzai

    [[7,7,7,7,7,7,7,7,7,7,7,7], //Level 8
    [0,1,1,1,1,1,1,1,1,1,1,0], //Target almost locked
    [0,0,4,4,4,4,4,4,4,4,0,0], //Cible presque verrouillée
    [0,0,0,1,1,1,1,1,1,0,0,0]],

    [[8,8,8,8,8,0,8,8,8,8,8], //Level 9
    [8,0,0,0,0,0,8,0,0,0,0], 
    [8,0,0,8,8,0,8,0,0,8,8], 
    [8,0,0,0,8,0,8,0,0,0,8],
    [8,8,8,8,8,0,8,8,8,8,8]],

    [[2,1,6,3,7,9,8,4,5], //Level 10
    [2,1,6,3,7,9,8,4,5], //Rainbow
    [2,1,6,3,7,9,8,4,5], //Arc-en-ciel
    [2,1,6,3,7,9,8,4,5]],

    [[0,0,1,0,0,0,0,0,1,0,0], //Level 11
    [0,1,1,0,0,0,0,1,1,0,0], //Eleven
    [0,0,1,0,0,0,0,0,1,0,0], //Onze
    [0,0,1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,0,1,1,1,1,1]],

    [[2,7,2,7,2,7,2,7], //Level 12
    [7,2,7,2,7,2,7,2], //Deadly checkers
    [2,7,2,7,2,7,2,7], //Échiquier fatal
    [7,2,7,2,7,2,7,2]],

    [[0,0,0,1,0,0,0], //Level 13
    [0,0,1,1,1,0,0], //To the top with you
    [0,1,1,1,1,1,0], //Au top
    [1,1,1,1,1,1,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1]],

    [[0,0,0,9], //Level 14
    [0,0,0,9], //Not based on opinion
    [0,0,0,9], //Pas basé sur l'opinion
    [0,0,0,9],
    [9,9,9,9,9,9,9],
    [0,9,9,9,9,9,0],
    [0,0,9,9,9,0,0],
    [0,0,0,9,0,0,0]],

    [[0,0,6,6,6],     //Level 15
    [0,6,6,6,6,6],   //Thanks for the gold
    [6,6,6,0,6,6,6], //Merci pour l'or
    [6,6,0,10,0,6,6], 
    [6,6,6,0,6,6,6],
    [0,6,6,6,6,6],
    [0,0,6,6,6]],

    [[0,0,0,1,1], //Level 16
    [0,0,1,1,1,1],
    [0,1,1,5,5,1,1],
    [1,1,5,8,8,5,1,1],
    [1,1,5,8,8,5,1,1],
    [0,1,1,5,5,1,1],
    [0,0,1,1,1,1],
    [0,0,0,1,1]],

    [[1,1,1,1,1,1,1,1], //Level 17
    [1,6,6,6,6,6,6,1],
    [1,6,10,10,10,10,6,1],
    [1,6,6,6,6,6,6,1],
    [1,1,1,1,1,1,1,1]],

    [[0,0,2,2,2,2,2,2,0,0], //Level 18
    [0,12,1,1,1,1,1,1,12,0], 
    [12,1,1,1,1,1,1,1,1,12], 
    [12,1,1,1,1,1,1,1,1,12]],

    [[12,7,9,9,9,9,7,12], //Level 19
     [12,7,9,9,9,9,7,12],
     [12,7,9,9,9,9,7,12],
     [12,7,9,9,9,9,7,12]],

    [[101] //Level 20 (BOSS 1)
    ],

    [[0,0,13,13,13,13,13,13,0,0], //Level 21
    [0,13,13,13,13,13,13,13,13,0], 
    [13,13,13,13,13,13,13,13,13,13], 
    [13,13,13,13,13,13,13,13,13,13]],

    [[0,2,2,2,0,0,0,2,2,2,0], //Level 22
     [2,0,0,0,2,0,2,0,0,0,2], //
     [0,0,2,2,0,0,0,0,2,2,0], //
     [0,2,0,0,0,0,0,2,0,0,0],
     [2,2,2,2,2,0,2,2,2,2,2]],

    [[4,0,0,0,0,4,0,0,0,0,4]], //Level 23

    [[3,3,3,3,3,3,3,3,3,3], //Level 24
    [9,9,9,9,9,9,9,9,9,9],
    [1,1,1,1,1,1,1,1,1,1],
    [8,8,8,8,8,8,8,8,8,8]]

    ];
