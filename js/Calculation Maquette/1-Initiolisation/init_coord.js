let reglage = {
    siege: {
        assise:{
            largeur: 35,
            profondeur: 40,
            hauteur: 45,
            angle: 10,
            distanceFourche: 0,
        },
        dossier:{
            largeur: 40,
            hauteur: 20,
            angle: 90,
        },
        potence:{
            longueur: 35,
            angle: 130,
        },
        repose:{
            longueur: 15,
            largeur: 5,
            angle: 90,
        }
    },
    roue: {
        avt: {
            deport: 50,
            voie: 18,
            rayon: 5,
            carrosage: 0,
        },
        arr: {
            deport: 0,
            voie: 20,
            rayon: 30,
            carrosage: 0,
            MC_distance: 2,
            MC_rayon: 28,
        },
    },
};

let taille = 175;
let patient = {
    taille: taille,
    Lpied: 0.146*taille,
    Ltibia: 0.246*taille,
    Lcuisse: 0.245*taille,
    Lbassin: 0.174*taille,
    Htronc: 0.34*taille,
    Lepaules: 0.259*taille,
    Ltete:0.130*taille,
    Lbras:0.136*taille,
    LavtBras:0.146*taille,
    Lmain:1/3*0.108*taille,

    lbassin: 0.1*taille,
    ltronc: 0.15*taille,
}
patient.ltete = 3/4*patient.Ltete;
patient.lpien = 1/2*patient.ltete;

patient.lcuisse = 0.3*patient.Lcuisse;
patient.ltibia = 0.3*patient.Ltibia;
patient.lbras = 0.4*patient.Lbras;
patient.lavtBras = 0.4*patient.LavtBras;

patient.ptronc = 1/3*patient.Htronc;
patient.pbras = patient.lbras;
patient.pavtBras = patient.lavtBras;

patient.pointure = Math.ceil((patient.Lpied+1)*3/2);