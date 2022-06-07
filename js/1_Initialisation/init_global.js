// import {reglage_chair} from "/js/1_Initialisation/init_coord.js";
// import {reglage_patient} from "/js/1_Initialisation/init_coord.js";
// import {patient} from "/js/1_Initialisation/init_coord.js";

let repere_chair = Array();
let points_chair = Array();
let repere_patient={};
let data = Array();
init_global();

function init_global() {
    data = Array();
    init_data();
    let layout = init_layout();
    Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
}


// Fonction principale

function init_data() {
    // Fauteuil
    cal_repere_chair();
    cal_points_chair();
    cal_mesh_chair();

    // Patient
    cal_repere_patient();
    cal_mesh_patient();
}
function cal_repere_chair() {
    repere_chair = {
        siege: {
            assise: cal_repere_assise(reglage_chair.roue.arr.deport, reglage_chair.siege.assise.hauteur, reglage_chair.siege.assise.profondeur, reglage_chair.siege.assise.angle),
            potence: cal_repere_potence(reglage_chair.siege.assise.profondeur, reglage_chair.siege.potence.longueur, reglage_chair.siege.potence.angle),
            repose: cal_repere_repose(reglage_chair.siege.repose.angle),
        },
        roue: {
            avt: {
                g: cal_repere_roue(-1, reglage_chair.roue.avt.deport, reglage_chair.roue.avt.rayon, reglage_chair.roue.avt.voie, reglage_chair.roue.avt.carrosage),
                d: cal_repere_roue(1, reglage_chair.roue.avt.deport, reglage_chair.roue.avt.rayon, reglage_chair.roue.avt.voie, reglage_chair.roue.avt.carrosage),
            },
            arr: {
                g: cal_repere_roue(-1, reglage_chair.roue.arr.deport, reglage_chair.roue.arr.rayon, reglage_chair.roue.arr.voie, reglage_chair.roue.arr.carrosage),
                d: cal_repere_roue(1, reglage_chair.roue.arr.deport, reglage_chair.roue.arr.rayon, reglage_chair.roue.arr.voie, reglage_chair.roue.arr.carrosage),
            },
            mc: {
                g: cal_repere_roue(-1, reglage_chair.roue.arr.deport, reglage_chair.roue.arr.rayon, reglage_chair.roue.arr.voie, reglage_chair.roue.arr.carrosage),
                d: cal_repere_roue(1, reglage_chair.roue.arr.deport, reglage_chair.roue.arr.rayon, reglage_chair.roue.arr.voie, reglage_chair.roue.arr.carrosage),
            }
        },
    };
    repere_chair.siege.repose = math.multiply(math.multiply(repere_chair.siege.assise, repere_chair.siege.potence), repere_chair.siege.repose);
    repere_chair.siege.potence = math.multiply(repere_chair.siege.assise, repere_chair.siege.potence);
}


function cal_points_chair() {
    points_chair = {
        siege: {
            assise: {
                AvtDroit1: [reglage_chair.siege.assise.profondeur, 0, reglage_chair.siege.assise.largeur / 2],
                AvtDroit2: [reglage_chair.siege.assise.profondeur, 3, reglage_chair.siege.assise.largeur / 2],
                AvtGauche1: [reglage_chair.siege.assise.profondeur, 0, -reglage_chair.siege.assise.largeur / 2],
                AvtGauche2: [reglage_chair.siege.assise.profondeur, 3, -reglage_chair.siege.assise.largeur / 2],
                ArrDroit1: [0, 0, reglage_chair.siege.assise.largeur / 2],
                ArrDroit2: [0, 3, reglage_chair.siege.assise.largeur / 2],
                ArrGauche1: [0, 0, -reglage_chair.siege.assise.largeur / 2],
                ArrGauche2: [0, 3, -reglage_chair.siege.assise.largeur / 2],
            },
            fourche: {
                g: [0, reglage_chair.roue.arr.rayon - reglage_chair.roue.avt.rayon, 0],
                d: [0, reglage_chair.roue.arr.rayon - reglage_chair.roue.avt.rayon, 0],
            },
            fourcheBas: {
                g: [0, 0, 0],
                d: [0, 0, 0],
            },
            dossier: {
                g: [-reglage_chair.siege.dossier.hauteur * Math.sin((reglage_chair.siege.dossier.angle - 90) * Math.PI / 180), reglage_chair.siege.dossier.hauteur * Math.cos((reglage_chair.siege.dossier.angle - 90) * Math.PI / 180), reglage_chair.siege.dossier.largeur / 2],
                d: [-reglage_chair.siege.dossier.hauteur * Math.sin((reglage_chair.siege.dossier.angle - 90) * Math.PI / 180), reglage_chair.siege.dossier.hauteur * Math.cos((reglage_chair.siege.dossier.angle - 90) * Math.PI / 180), -reglage_chair.siege.dossier.largeur / 2],
            },
            potence: {
                g: [0, 0, -reglage_chair.siege.assise.largeur / 2],
                d: [0, 0, reglage_chair.siege.assise.largeur / 2]
            },
            repose: {
                g: [[-reglage_chair.siege.repose.largeur / 2, 0, -reglage_chair.siege.assise.largeur / 2],
                    [reglage_chair.siege.repose.largeur / 2, 0, -reglage_chair.siege.assise.largeur / 2],
                    [reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.repose.longueur - reglage_chair.siege.assise.largeur / 2],
                    [-reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.repose.longueur - reglage_chair.siege.assise.largeur / 2]
                ],
                d: [[-reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.assise.largeur / 2],
                    [reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.assise.largeur / 2],
                    [reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.assise.largeur / 2 - reglage_chair.siege.repose.longueur],
                    [-reglage_chair.siege.repose.largeur / 2, 0, reglage_chair.siege.assise.largeur / 2 - reglage_chair.siege.repose.longueur]
                ],
            }
        },
        roue: {
            avt: {
                g: cercle([0, 0, 0], reglage_chair.roue.avt.rayon, -1, 0),
                d: cercle([0, 0, 0], reglage_chair.roue.avt.rayon, 1, 0),
            },
            arr: {
                g: cercle([0, 0, 0], reglage_chair.roue.arr.rayon, -1, 0),
                d: cercle([0, 0, 0], reglage_chair.roue.arr.rayon, 1, 0),
            },
            mc: {
                g: cercle([0, 0, 0], reglage_chair.roue.arr.MC_rayon, -1, reglage_chair.roue.arr.MC_distance),
                d: cercle([0, 0, 0], reglage_chair.roue.arr.MC_rayon, 1, reglage_chair.roue.arr.MC_distance),
            }
        },
        roue_centre: {
            avt: {
                g: [0, 0, 0, 1],
                d: [0, 0, 0, 1],
            },
            arr: {
                g: [0, 0, 0, 1],
                d: [0, 0, 0, 1],
            },
            mc: {
                g: [0, 0, 0, 1],
                d: [0, 0, 0, 1],
            }
        }
    }

    for (let i in points_chair.roue) {
        for (let i2 in points_chair.roue[i]) {
            points_chair.roue[i][i2].push(new Array(points_chair.roue[i][i2][0].length).fill(1))
        }
    }

    for (let i in points_chair.siege.fourche) {
        points_chair.siege.fourche[i].push(1);
    }
    for (let i in points_chair.siege.fourcheBas) {
        points_chair.siege.fourcheBas[i].push(1);
    }

    for (let i in points_chair.siege.assise) {
        points_chair.siege.assise[i].push(1);
    }
    for (let i in points_chair.siege.dossier) {
        points_chair.siege.dossier[i].push(1);
    }

    for (let i in points_chair.siege.potence) {
        points_chair.siege.potence[i].push(1);
    }

    for (let i in points_chair.siege.repose) {
        for (let i2 in points_chair.siege.repose[i]) {
            points_chair.siege.repose[i][i2].push(1);
        }
    }


    for (let i in points_chair.roue) {
        for (let i2 in points_chair.roue[i]) {
            points_chair.roue[i][i2] = matrice_transpose(points_chair.roue[i][i2]);
            for (let i3 in points_chair.roue[i][i2]) {
                points_chair.roue[i][i2][i3] = math.multiply(repere_chair.roue[i][i2], points_chair.roue[i][i2][i3]);
            }
            points_chair.roue[i][i2] = matrice_transpose(points_chair.roue[i][i2]);
        }
    }

    for (let i in points_chair.roue_centre) {
        for (let i2 in points_chair.roue_centre[i]) {
            points_chair.roue_centre[i][i2] = math.multiply(repere_chair.roue[i][i2], points_chair.roue_centre[i][i2]);
        }
    }
    for (let i in points_chair.siege.fourche) {
        points_chair.siege.fourche[i] = math.multiply(repere_chair.roue.avt[i], points_chair.siege.fourche[i]);
    }
    for (let i in points_chair.siege.fourcheBas) {
        points_chair.siege.fourcheBas[i] = math.multiply(repere_chair.roue.avt[i], points_chair.siege.fourcheBas[i]);
    }

    for (let i in points_chair.siege.assise) {
        points_chair.siege.assise[i] = math.multiply(repere_chair.siege.assise, points_chair.siege.assise[i]);
    }
    for (let i in points_chair.siege.dossier) {
        points_chair.siege.dossier[i] = math.multiply(repere_chair.siege.assise, points_chair.siege.dossier[i]);
    }

    for (let i in points_chair.siege.potence) {
        points_chair.siege.potence[i] = math.multiply(repere_chair.siege.potence, points_chair.siege.potence[i]);
    }

    for (let i in points_chair.siege.repose) {
        for (let i2 in points_chair.siege.repose[i]) {
            points_chair.siege.repose[i][i2] = math.multiply(repere_chair.siege.repose, points_chair.siege.repose[i][i2]);
        }
    }
}

    // Plotly Data

function cal_mesh_chair() {
    let color = {
        siege: {
            assise: 'red',
        },
        roue: {
            avt: 'green',
            arr: 'green',
            mc: 'red',
        }
    }

    let width = {
        roue: {
            avt: 10,
            arr: 14,
            mc: 8,
        }
    }

    // Roues
    for (let i in points_chair.roue) {
        for (let i2 in points_chair.roue[i]) {
            let data_temp = {
                type: 'scatter3d',
                mode: 'lines',
                marker: {
                    color: color.roue[i],
                },
                line: {
                    width: width.roue[i],
                },
                x: points_chair.roue[i][i2][0],
                y: points_chair.roue[i][i2][2],
                z: points_chair.roue[i][i2][1],
            }
            data.push(data_temp);
        }
    }
    // Barres des Roues
    for (let a = 0; a < 4; a += 1) {
        for (let i = 0; i < (data[a].x.length - 1) / 2; i += 2) {
            let data_temp = {
                type: 'scatter3d',
                mode: 'lines',
                opacity: 0.2,
                marker: {
                    color: 'black',
                },
                line: {
                    width: 3,
                },
                x: [data[a].x[i], data[a].x[i + (data[a].x.length - 1) / 2]],
                y: [data[a].y[i], data[a].y[i + (data[a].x.length - 1) / 2]],
                z: [data[a].z[i], data[a].z[i + (data[a].x.length - 1) / 2]],
            }
            data.push(data_temp);
        }
    }

    // Assise

    let x = [
        [points_chair.siege.assise.AvtDroit1[0], points_chair.siege.assise.AvtGauche1[0], points_chair.siege.assise.ArrDroit1[0], points_chair.siege.assise.ArrGauche1[0]],
        [points_chair.siege.assise.AvtDroit2[0], points_chair.siege.assise.AvtGauche2[0], points_chair.siege.assise.ArrDroit2[0], points_chair.siege.assise.ArrGauche2[0]],
        [points_chair.siege.assise.AvtDroit1[0], points_chair.siege.assise.AvtGauche1[0], points_chair.siege.assise.AvtDroit2[0], points_chair.siege.assise.AvtGauche2[0]],
        [points_chair.siege.assise.ArrDroit1[0], points_chair.siege.assise.ArrGauche1[0], points_chair.siege.assise.ArrDroit2[0], points_chair.siege.assise.ArrGauche2[0]],
        [points_chair.siege.assise.AvtDroit1[0], points_chair.siege.assise.ArrDroit1[0], points_chair.siege.assise.AvtDroit2[0], points_chair.siege.assise.ArrDroit2[0]],
        [points_chair.siege.assise.AvtGauche1[0], points_chair.siege.assise.ArrGauche1[0], points_chair.siege.assise.AvtGauche2[0], points_chair.siege.assise.ArrGauche2[0]],
        [points_chair.siege.assise.ArrGauche2[0], points_chair.siege.assise.ArrDroit2[0], points_chair.siege.dossier.g[0], points_chair.siege.dossier.d[0]]
    ];
    let y = [
        [points_chair.siege.assise.AvtDroit1[2], points_chair.siege.assise.AvtGauche1[2], points_chair.siege.assise.ArrDroit1[2], points_chair.siege.assise.ArrGauche1[2]],
        [points_chair.siege.assise.AvtDroit2[2], points_chair.siege.assise.AvtGauche2[2], points_chair.siege.assise.ArrDroit2[2], points_chair.siege.assise.ArrGauche2[2]],
        [points_chair.siege.assise.AvtDroit1[2], points_chair.siege.assise.AvtGauche1[2], points_chair.siege.assise.AvtDroit2[2], points_chair.siege.assise.AvtGauche2[2]],
        [points_chair.siege.assise.ArrDroit1[2], points_chair.siege.assise.ArrGauche1[2], points_chair.siege.assise.ArrDroit2[2], points_chair.siege.assise.ArrGauche2[2]],
        [points_chair.siege.assise.AvtDroit1[2], points_chair.siege.assise.ArrDroit1[2], points_chair.siege.assise.AvtDroit2[2], points_chair.siege.assise.ArrDroit2[2]],
        [points_chair.siege.assise.AvtGauche1[2], points_chair.siege.assise.ArrGauche1[2], points_chair.siege.assise.AvtGauche2[2], points_chair.siege.assise.ArrGauche2[2]],
        [points_chair.siege.assise.ArrGauche2[2], points_chair.siege.assise.ArrDroit2[2], points_chair.siege.dossier.g[2], points_chair.siege.dossier.d[2]]
    ];
    let z = [
        [points_chair.siege.assise.AvtDroit1[1], points_chair.siege.assise.AvtGauche1[1], points_chair.siege.assise.ArrDroit1[1], points_chair.siege.assise.ArrGauche1[1]],
        [points_chair.siege.assise.AvtDroit2[1], points_chair.siege.assise.AvtGauche2[1], points_chair.siege.assise.ArrDroit2[1], points_chair.siege.assise.ArrGauche2[1]],
        [points_chair.siege.assise.AvtDroit1[1], points_chair.siege.assise.AvtGauche1[1], points_chair.siege.assise.AvtDroit2[1], points_chair.siege.assise.AvtGauche2[1]],
        [points_chair.siege.assise.ArrDroit1[1], points_chair.siege.assise.ArrGauche1[1], points_chair.siege.assise.ArrDroit2[1], points_chair.siege.assise.ArrGauche2[1]],
        [points_chair.siege.assise.AvtDroit1[1], points_chair.siege.assise.ArrDroit1[1], points_chair.siege.assise.AvtDroit2[1], points_chair.siege.assise.ArrDroit2[1]],
        [points_chair.siege.assise.AvtGauche1[1], points_chair.siege.assise.ArrGauche1[1], points_chair.siege.assise.AvtGauche2[1], points_chair.siege.assise.ArrGauche2[1]],
        [points_chair.siege.assise.ArrGauche2[1], points_chair.siege.assise.ArrDroit2[1], points_chair.siege.dossier.g[1], points_chair.siege.dossier.d[1]]
    ];

    let data_temp;
    for (let i = 0; i < 7; i++) {
        if (i >= 4 && i < 6) {
            data_temp = {
                type: 'scatter3d',
                mode: 'none',
                surfaceaxis: 1,
                surfacecolor: 'blue',
                // color : color.siege.assise,
                x: x[i],
                y: y[i],
                z: z[i],
            }
        } else {
            data_temp = {
                type: 'mesh3d',
                // color : color.siege.assise,
                x: x[i],
                y: y[i],
                z: z[i],
            }
        }
        data.push(data_temp);
    }

    // Potence
    let potence_connection = ['AvtGauche1', 'AvtDroit1'];
    for (let i in points_chair.siege.potence) {
        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            opacity: 1,
            marker: {},
            line: {
                color: 'black',
                width: 8,
            },
            x: [points_chair.siege.assise[potence_connection[Object.keys(points_chair.siege.potence).indexOf(i)]][0], points_chair.siege.potence[i][0]],
            y: [-points_chair.siege.assise[potence_connection[Object.keys(points_chair.siege.potence).indexOf(i)]][2], -points_chair.siege.potence[i][2]],
            z: [points_chair.siege.assise[potence_connection[Object.keys(points_chair.siege.potence).indexOf(i)]][1], points_chair.siege.potence[i][1]],
        }
        data.push(data_temp);
    }

    // Repose pied
    for (let i in points_chair.siege.repose) {
        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            opacity: 0.2,
            surfaceaxis: 2,
            marker: {
                color: 'red',
            },
            line: {
                width: 3,
            },
            x: matrice_transpose(points_chair.siege.repose[i])[0],
            y: math.multiply(matrice_transpose(points_chair.siege.repose[i])[2], -1),
            z: matrice_transpose(points_chair.siege.repose[i])[1],
        }
        data.push(data_temp);
    }

    // Chassis
    let chassisConnection = Array();
    chassisConnection.push(matrice_transpose([points_chair.roue_centre.arr.g, points_chair.roue_centre.arr.d]));
    chassisConnection.push(matrice_transpose([points_chair.siege.assise.ArrGauche1, points_chair.roue_centre.arr.g, points_chair.siege.fourche.g, points_chair.siege.fourcheBas.g]));
    chassisConnection.push(matrice_transpose([points_chair.siege.assise.ArrDroit1, points_chair.roue_centre.arr.d, points_chair.siege.fourche.d, points_chair.siege.fourcheBas.d]));
    for (let i in chassisConnection) {
        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            opacity: 0.6,
            marker: {
                color: 'grey',
            },
            line: {
                width: 4,
            },
            x: chassisConnection[i][0],
            y: chassisConnection[i][2],
            z: chassisConnection[i][1],
        }
        data.push(data_temp);
    }
}



    // Patient

function cal_repere_patient() {
    // Repere Patient
    let thetaD = reglage_chair.siege.dossier.angle;
    let thetaBras = reglage_patient.bras.angle;
    let thetaP = reglage_chair.siege.potence.angle;



    let MP_R0_Rassise_construction = repere_chair.siege.assise;
    let rotx_90 = matrice_Rotation('x',90,4);

    let LBassin = patient.Lbassin;
    let lBassin = patient.lbassin / 2;
    let hTronc=patient.Htronc;
    let LEpaule=patient.Lepaule/2;
    let LCuisse=patient.Lcuisse;
    let lCuisse=patient.lcuisse/2;
    let LTibia=patient.Ltibia;
    let lTibia=patient.ltibia;

    // Repere bassin
    let Centre_loc=[lBassin,lBassin+3,0,1];
    let Centre_glob=math.multiply(MP_R0_Rassise_construction,Centre_loc);

    let MP_R0_Rbassin_construction=math.transpose(MP_R0_Rassise_construction);
    MP_R0_Rbassin_construction[3] = Centre_glob;
    MP_R0_Rbassin_construction=math.transpose(MP_R0_Rbassin_construction);
    let MP_R0_Rbassin_visualisation=math.multiply(rotx_90,MP_R0_Rbassin_construction);
    repere_patient.bassin=MP_R0_Rbassin_visualisation;

    // Repere Tronc
    let MP_R0_Rtronc_org = matSlice(MP_R0_Rassise_construction);
    let R1=matrice_Rotation('z',thetaD-90,3);

    let MP_R0_Rtronc_construction = math.multiply(R1,MP_R0_Rtronc_org);
    MP_R0_Rtronc_construction = matComb(MP_R0_Rtronc_construction,MP_R0_Rbassin_construction);

    let MP_R0_Rtronc_visualisation = math.multiply(rotx_90,MP_R0_Rtronc_construction);
    repere_patient.tronc=MP_R0_Rtronc_visualisation;
    // console.log(MP_R0_Rtronc_visualisation)

    // Repere Bras
    let Centre_loc_D = [0,hTronc-5/4*lBassin,LEpaule,1];
    let Centre_glob_D = math.multiply(MP_R0_Rtronc_construction,Centre_loc_D);
    let R1_D=matrice_Rotation('x',-thetaBras,3);

    let MP_R0_RbrasD_org = matSlice(MP_R0_Rtronc_construction);
    MP_R0_RbrasD_org = math.multiply(R1_D,MP_R0_RbrasD_org);

    let MP_R0_RbrasD_construction = matComb(MP_R0_RbrasD_org,MP_R0_Rbassin_construction);
    MP_R0_RbrasD_construction = math.transpose(MP_R0_RbrasD_construction);
    MP_R0_RbrasD_construction[3] = Centre_glob_D;
    MP_R0_RbrasD_construction = math.transpose(MP_R0_RbrasD_construction);

    let MP_R0_RbrasD_visualisation = math.multiply(rotx_90,MP_R0_RbrasD_construction);
    repere_patient.brasD=MP_R0_RbrasD_visualisation;
    // console.log(MP_R0_RbrasD_visualisation);


    let Centre_loc_G = [0,hTronc-5/4*lBassin,-LEpaule,1];
    let Centre_glob_G = math.multiply(MP_R0_Rtronc_construction,Centre_loc_G);
    let R1_G=matrice_Rotation('x',thetaBras,3);

    let MP_R0_RbrasG_org = matSlice(MP_R0_Rtronc_construction);
    MP_R0_RbrasG_org = math.multiply(R1_G,MP_R0_RbrasG_org);

    let MP_R0_RbrasG_construction = matComb(MP_R0_RbrasG_org,MP_R0_Rbassin_construction);
    MP_R0_RbrasG_construction = math.transpose(MP_R0_RbrasG_construction);
    MP_R0_RbrasG_construction[3] = Centre_glob_G;
    MP_R0_RbrasG_construction = math.transpose(MP_R0_RbrasG_construction);

    let MP_R0_RbrasG_visualisation = math.multiply(rotx_90,MP_R0_RbrasG_construction);
    repere_patient.brasG=MP_R0_RbrasG_visualisation;
    // console.log(MP_R0_RbrasG_visualisation);


    // Repere Cuisse
    Centre_loc = [lBassin/2+LCuisse,lCuisse+3,-(LBassin-lCuisse)/2,1];
    Centre_glob = math.multiply(MP_R0_Rassise_construction,Centre_loc);

    let MP_R0_Rcuisse_construction = math.transpose(MP_R0_Rassise_construction);
    MP_R0_Rcuisse_construction[3] = Centre_glob;
    MP_R0_Rcuisse_construction = math.transpose(MP_R0_Rcuisse_construction);

    let MP_R0_RcuisseD_visualisation = math.multiply(rotx_90,MP_R0_Rcuisse_construction);
    repere_patient.cuisseD=MP_R0_RcuisseD_visualisation;
    //console.log(repere_patient.cuisseD);

    let MP_R0_RcuisseG_visualisation = math.multiply(rotx_90,MP_R0_Rcuisse_construction);
    MP_R0_RcuisseG_visualisation[1][3] = -1 * MP_R0_RcuisseG_visualisation[1][3];
    repere_patient.cuisseG=MP_R0_RcuisseG_visualisation;
    //console.log(repere_patient.cuisseG);


    // Repere Tibia
    let MP_R0_Rtibia_org = matSlice(MP_R0_Rassise_construction);
    R1 = matrice_Rotation('z',thetaP-90,3);

    let MP_R0_Rtibia_construction = math.multiply(R1,MP_R0_Rtibia_org);
    MP_R0_Rtibia_construction = matComb(MP_R0_Rtibia_construction,MP_R0_Rcuisse_construction);

    let MP_R0_RtibiaD_visualisation = math.multiply(rotx_90,MP_R0_Rtibia_construction);
    repere_patient.tibiaD=MP_R0_RtibiaD_visualisation;
    //console.log(repere_patient.tibiaD);

    let MP_R0_RtibiaG_visualisation = math.multiply(rotx_90,MP_R0_Rtibia_construction);
    MP_R0_RtibiaG_visualisation[1][3] = -1 * MP_R0_RtibiaG_visualisation[1][3];
    repere_patient.tibiaG=MP_R0_RtibiaG_visualisation;
    //console.log(repere_patient.tibiaG);
}


function cal_mesh_patient() {
    // Mesh
    let mesh_accuracy = 12;
    let mesh_opacity = 0.6;
    let mesh_lineWidth = 0;

    let mesh = {};
    let data_temp = {};


    point_coude();
    // Mesh Tronc
    mesh.tronc = {};
    for (let i in [0,1]) {
        [mesh.tronc.x,mesh.tronc.y,mesh.tronc.z] = ellipsoid(0,patient.Htronc/2,0,patient.ptronc,patient.Htronc,patient.ltronc,mesh_accuracy,i);

        for (let i1 in mesh.tronc.x){
            for (let i2 in mesh.tronc.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.tronc,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.tronc,[mesh.tronc.x[i1][i2],mesh.tronc.y[i1][i2],mesh.tronc.z[i1][i2],1])
                mesh.tronc.x[i1][i2] = vector_rotate[0];
                mesh.tronc.y[i1][i2] = vector_rotate[1];
                mesh.tronc.z[i1][i2] = vector_rotate[2];
            }
        }
        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.tronc.x.flat(),
            y: mesh.tronc.y.flat(),
            z: mesh.tronc.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh tête
    mesh.tete = {};
    for (let i in [0,1]) {
        [mesh.tete.x,mesh.tete.y,mesh.tete.z] = ellipsoid(0,patient.Htronc+0.5*patient.Ltete,0,patient.ltete,patient.Ltete,patient.ltete,mesh_accuracy,i);

        for (let i1 in mesh.tete.x){
            for (let i2 in mesh.tete.x[i1]) {
                let vector_rotate = math.multiply(repere_patient.tronc,[mesh.tete.x[i1][i2],mesh.tete.y[i1][i2],mesh.tete.z[i1][i2],1])
                mesh.tete.x[i1][i2] = vector_rotate[0];
                mesh.tete.y[i1][i2] = vector_rotate[1];
                mesh.tete.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.tete.x.flat(),
            y: mesh.tete.y.flat(),
            z: mesh.tete.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh epaule
    mesh.epaule = {};
    for (let i in [0,1]) {
        [mesh.epaule.x,mesh.epaule.y,mesh.epaule.z] = ellipsoid(0,patient.Htronc-5/8*patient.lbassin,0,patient.lbassin,patient.lbassin,patient.Lepaule,mesh_accuracy,i);

        for (let i1 in mesh.epaule.x){
            for (let i2 in mesh.epaule.x[i1]) {
                let vector_rotate = math.multiply(repere_patient.tronc,[mesh.epaule.x[i1][i2],mesh.epaule.y[i1][i2],mesh.epaule.z[i1][i2],1])
                mesh.epaule.x[i1][i2] = vector_rotate[0];
                mesh.epaule.y[i1][i2] = vector_rotate[1];
                mesh.epaule.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.epaule.x.flat(),
            y: mesh.epaule.y.flat(),
            z: mesh.epaule.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh bras
    mesh.brasD = {};
    for (let i in [0,1]) {
        [mesh.brasD.x,mesh.brasD.y,mesh.brasD.z] = ellipsoid(0,-0.5*patient.Lbras,0,patient.lbras,patient.Lbras,patient.pbras,mesh_accuracy,i);

        for (let i1 in mesh.brasD.x){
            for (let i2 in mesh.brasD.x[i1]) {
                let vector_rotate = math.multiply(repere_patient.brasD,[mesh.brasD.x[i1][i2],mesh.brasD.y[i1][i2],mesh.brasD.z[i1][i2],1])
                mesh.brasD.x[i1][i2] = vector_rotate[0];
                mesh.brasD.y[i1][i2] = vector_rotate[1];
                mesh.brasD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.brasD.x.flat(),
            y: mesh.brasD.y.flat(),
            z: mesh.brasD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.brasG = {};
    for (let i in [0,1]) {
        [mesh.brasG.x,mesh.brasG.y,mesh.brasG.z] = ellipsoid(0,-0.5*patient.Lbras,0,patient.lbras,patient.Lbras,patient.pbras,mesh_accuracy,i);

        for (let i1 in mesh.brasG.x){
            for (let i2 in mesh.brasG.x[i1]) {
                let vector_rotate = math.multiply(repere_patient.brasG,[mesh.brasG.x[i1][i2],mesh.brasG.y[i1][i2],mesh.brasG.z[i1][i2],1])
                mesh.brasG.x[i1][i2] = vector_rotate[0];
                mesh.brasG.y[i1][i2] = vector_rotate[1];
                mesh.brasG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.brasG.x.flat(),
            y: mesh.brasG.y.flat(),
            z: mesh.brasG.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh avtBras
    mesh.avtBrasD = {};
    for (let i in [0,1]) {
        [mesh.avtBrasD.x,mesh.avtBrasD.y,mesh.avtBrasD.z] = ellipsoid(0,-0.5*(patient.LavtBras+patient.Lmain),0,patient.lavtBras,patient.LavtBras,patient.pavtBras,mesh_accuracy,i);

        for (let i1 in mesh.avtBrasD.x){
            for (let i2 in mesh.avtBrasD.x[i1]) {
                let vector_rotate = math.multiply(repere_patient.avtBrasD,[mesh.avtBrasD.x[i1][i2],mesh.avtBrasD.y[i1][i2],mesh.avtBrasD.z[i1][i2],1])
                mesh.avtBrasD.x[i1][i2] = vector_rotate[0];
                mesh.avtBrasD.y[i1][i2] = vector_rotate[1];
                mesh.avtBrasD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.avtBrasD.x.flat(),
            y: mesh.avtBrasD.y.flat(),
            z: mesh.avtBrasD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.avtBrasG = {};
    for (let i in [0,1]) {
        [mesh.avtBrasG.x,mesh.avtBrasG.y,mesh.avtBrasG.z] = ellipsoid(0,-0.5*(patient.LavtBras+patient.Lmain),0,patient.lavtBras,patient.LavtBras,patient.pavtBras,mesh_accuracy,i);

        for (let i1 in mesh.avtBrasG.x){
            for (let i2 in mesh.avtBrasG.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.avtBrasG,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.avtBrasG,[mesh.avtBrasG.x[i1][i2],mesh.avtBrasG.y[i1][i2],mesh.avtBrasG.z[i1][i2],1])
                mesh.avtBrasG.x[i1][i2] = vector_rotate[0];
                mesh.avtBrasG.y[i1][i2] = vector_rotate[1];
                mesh.avtBrasG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.avtBrasG.x.flat(),
            y: mesh.avtBrasG.y.flat(),
            z: mesh.avtBrasG.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh main
    mesh.mainD = {};
    for (let i in [0,1]) {
        [mesh.mainD.x,mesh.mainD.y,mesh.mainD.z] = ellipsoid(0,-(patient.LavtBras+patient.Lmain),0,0.5*patient.lavtBras,patient.Lmain,0.5*patient.pavtBras,mesh_accuracy,i);

        for (let i1 in mesh.mainD.x){
            for (let i2 in mesh.mainD.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.mainD,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.avtBrasD,[mesh.mainD.x[i1][i2],mesh.mainD.y[i1][i2],mesh.mainD.z[i1][i2],1])
                mesh.mainD.x[i1][i2] = vector_rotate[0];
                mesh.mainD.y[i1][i2] = vector_rotate[1];
                mesh.mainD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.mainD.x.flat(),
            y: mesh.mainD.y.flat(),
            z: mesh.mainD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.mainG = {};
    for (let i in [0,1]) {
        [mesh.mainG.x,mesh.mainG.y,mesh.mainG.z] = ellipsoid(0,-(patient.LavtBras+patient.Lmain),0,0.5*patient.lavtBras,patient.Lmain,0.5*patient.pavtBras,mesh_accuracy,i);

        for (let i1 in mesh.mainG.x){
            for (let i2 in mesh.mainG.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.mainG,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.avtBrasG,[mesh.mainG.x[i1][i2],mesh.mainG.y[i1][i2],mesh.mainG.z[i1][i2],1])
                mesh.mainG.x[i1][i2] = vector_rotate[0];
                mesh.mainG.y[i1][i2] = vector_rotate[1];
                mesh.mainG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.mainG.x.flat(),
            y: mesh.mainG.y.flat(),
            z: mesh.mainG.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh bassin
    mesh.bassin = {};
    for (let i in [0,1]) {
        [mesh.bassin.x,mesh.bassin.y,mesh.bassin.z] = ellipsoid(0,0,0,patient.lbassin,patient.lbassin,patient.Lbassin,mesh_accuracy,i);

        for (let i1 in mesh.bassin.x){
            for (let i2 in mesh.bassin.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.bassin,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.bassin,[mesh.bassin.x[i1][i2],mesh.bassin.y[i1][i2],mesh.bassin.z[i1][i2],1])
                mesh.bassin.x[i1][i2] = vector_rotate[0];
                mesh.bassin.y[i1][i2] = vector_rotate[1];
                mesh.bassin.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.bassin.x.flat(),
            y: mesh.bassin.y.flat(),
            z: mesh.bassin.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh cuisse
    mesh.cuisseD = {};
    for (let i in [0,1]) {
        [mesh.cuisseD.x,mesh.cuisseD.y,mesh.cuisseD.z] =
            ellipsoid(
                -0.5*patient.Lcuisse,0,0,
                patient.Lcuisse,patient.lcuisse,patient.lcuisse,
                mesh_accuracy,i
            );

        for (let i1 in mesh.cuisseD.x){
            for (let i2 in mesh.cuisseD.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.cuisseD,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.cuisseD,[mesh.cuisseD.x[i1][i2],mesh.cuisseD.y[i1][i2],mesh.cuisseD.z[i1][i2],1])
                mesh.cuisseD.x[i1][i2] = vector_rotate[0];
                mesh.cuisseD.y[i1][i2] = vector_rotate[1];
                mesh.cuisseD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.cuisseD.x.flat(),
            y: mesh.cuisseD.y.flat(),
            z: mesh.cuisseD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.cuisseG = {};
    for (let i in [0,1]) {
        [mesh.cuisseG.x,mesh.cuisseG.y,mesh.cuisseG.z] =
            ellipsoid(
                -0.5*patient.Lcuisse,0,0,
                patient.Lcuisse,patient.lcuisse,patient.lcuisse,
                mesh_accuracy,i
            );

        for (let i1 in mesh.cuisseG.x){
            for (let i2 in mesh.cuisseG.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.cuisseG,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.cuisseG,[mesh.cuisseG.x[i1][i2],mesh.cuisseG.y[i1][i2],mesh.cuisseG.z[i1][i2],1])
                mesh.cuisseG.x[i1][i2] = vector_rotate[0];
                mesh.cuisseG.y[i1][i2] = vector_rotate[1];
                mesh.cuisseG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.cuisseG.x.flat(),
            y: mesh.cuisseG.y.flat(),
            z: mesh.cuisseG.z.flat(),
        }
        data.push(data_temp);
    }


    // Mesh tibia
    mesh.tibiaD = {};
    for (let i in [0,1]) {
        [mesh.tibiaD.x,mesh.tibiaD.y,mesh.tibiaD.z] =
            ellipsoid(
                0,-0.5*patient.Ltibia,0,
                patient.ltibia,patient.Ltibia,patient.ltibia,
                mesh_accuracy,i
            );

        for (let i1 in mesh.tibiaD.x){
            for (let i2 in mesh.tibiaD.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.tibiaD,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.tibiaD,[mesh.tibiaD.x[i1][i2],mesh.tibiaD.y[i1][i2],mesh.tibiaD.z[i1][i2],1])
                mesh.tibiaD.x[i1][i2] = vector_rotate[0];
                mesh.tibiaD.y[i1][i2] = vector_rotate[1];
                mesh.tibiaD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.tibiaD.x.flat(),
            y: mesh.tibiaD.y.flat(),
            z: mesh.tibiaD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.tibiaG = {};
    for (let i in [0,1]) {
        [mesh.tibiaG.x,mesh.tibiaG.y,mesh.tibiaG.z] =
            ellipsoid(
                0,-0.5*patient.Ltibia,0,
                patient.ltibia,patient.Ltibia,patient.ltibia,
                mesh_accuracy,i
            );

        for (let i1 in mesh.tibiaG.x){
            for (let i2 in mesh.tibiaG.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.tibiaG,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.tibiaG,[mesh.tibiaG.x[i1][i2],mesh.tibiaG.y[i1][i2],mesh.tibiaG.z[i1][i2],1])
                mesh.tibiaG.x[i1][i2] = vector_rotate[0];
                mesh.tibiaG.y[i1][i2] = vector_rotate[1];
                mesh.tibiaG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.tibiaG.x.flat(),
            y: mesh.tibiaG.y.flat(),
            z: mesh.tibiaG.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh pied
    mesh.piedD = {};
    for (let i in [0,1]) {
        [mesh.piedD.x,mesh.piedD.y,mesh.piedD.z] =
            ellipsoid(
                0.25*patient.Lpied,-patient.Ltibia-0.25*patient.lpied,0,
                patient.Lpied,patient.lpied,patient.lpied,
                mesh_accuracy,i
            );

        for (let i1 in mesh.piedD.x){
            for (let i2 in mesh.piedD.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.piedD,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.tibiaD,[mesh.piedD.x[i1][i2],mesh.piedD.y[i1][i2],mesh.piedD.z[i1][i2],1])
                mesh.piedD.x[i1][i2] = vector_rotate[0];
                mesh.piedD.y[i1][i2] = vector_rotate[1];
                mesh.piedD.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.piedD.x.flat(),
            y: mesh.piedD.y.flat(),
            z: mesh.piedD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.piedG = {};
    for (let i in [0,1]) {
        [mesh.piedG.x,mesh.piedG.y,mesh.piedG.z] =
            ellipsoid(
                0.25*patient.Lpied,-patient.Ltibia-0.25*patient.lpied,0,
                patient.Lpied,patient.lpied,patient.lpied,
                mesh_accuracy,i
            );

        for (let i1 in mesh.piedG.x){
            for (let i2 in mesh.piedG.x[i1]) {
                // let repere_tronc = math.multiply(repere_patient.piedG,matrice_Translation(0,patient.Htronc/2,0));
                let vector_rotate = math.multiply(repere_patient.tibiaG,[mesh.piedG.x[i1][i2],mesh.piedG.y[i1][i2],mesh.piedG.z[i1][i2],1])
                mesh.piedG.x[i1][i2] = vector_rotate[0];
                mesh.piedG.y[i1][i2] = vector_rotate[1];
                mesh.piedG.z[i1][i2] = vector_rotate[2];
            }
        }

        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            surfaceaxis: 1,
            line:{
                width: mesh_lineWidth,
            },
            opacity: mesh_opacity,
            x: mesh.piedG.x.flat(),
            y: mesh.piedG.y.flat(),
            z: mesh.piedG.z.flat(),
        }
        data.push(data_temp);
    }
    console.log(data)
    return data;
}

function ellipsoid(cx,cy,cz,x,y,z,accuracy,side) {
    let ellipsoid_accuracy = accuracy;
    let theta_all = [[-Math.PI/2,0],[0,Math.PI/2]];
    // theta_all = theta_all[side];
    // for (let theta_range in theta_all) {
        let phi = makeArr(0,2*Math.PI,ellipsoid_accuracy);
        // console.log(phi)
        let theta = makeArr(theta_all[side][0], theta_all[side][1], ellipsoid_accuracy);
        // console.log(theta)

        let phi_mesh = Array(ellipsoid_accuracy).fill(phi);
        // console.log(phi_mesh)
        let theta_mesh = Array(ellipsoid_accuracy).fill(theta);
        theta_mesh = math.transpose(theta_mesh);
        // console.log(theta_mesh)

        let x_mesh = [];
        let y_mesh = [];
        let z_mesh = [];

        for (let i1 in phi_mesh) {
            x_mesh[i1]=[];
            y_mesh[i1]=[];
            z_mesh[i1]=[];
            for (let i2 in phi_mesh[i1]) {
                x_mesh[i1][i2] = Math.cos(theta_mesh[i1][i2]) * Math.sin(phi_mesh[i1][i2]) * x/2 + cx;
                y_mesh[i1][i2] = Math.cos(theta_mesh[i1][i2]) * Math.cos(phi_mesh[i1][i2]) * y/2 + cy;
                z_mesh[i1][i2] = Math.sin(theta_mesh[i1][i2]) * z/2 + cz;
            }
        }
    return [x_mesh,y_mesh,z_mesh];
}

function point_coude() {
    let thetaMain = reglage_patient.main.angle;
    let Lbras = patient.Lbras;
    let LavtBras = patient.LavtBras;
    let Lmain = patient.Lmain;

    let rayonMC = reglage_chair.roue.arr.MC_rayon;
    let d = reglage_chair.roue.arr.MC_distance;

    let MP_R0_Rroue = repere_chair.roue.arr.d;
    let MP_R0_Rbras_visualisation = repere_patient.brasD;
    // console.log(MP_R0_Rbras_visualisation)

    let R = matrice_Rotation('x',-90,4);
    let MP_R0_Rbras_construction = math.multiply(R,MP_R0_Rbras_visualisation)

    let thetaM = (90-thetaMain)*Math.PI/180;
    // console.log(thetaM)

    let x = rayonMC * Math.cos(thetaM);
    let y = rayonMC * Math.sin(thetaM);
    let z = d;

    let main_Rroue = [x,y,z,1];
    let mainD_R0 = math.multiply(MP_R0_Rroue,main_Rroue);
    // console.log(MP_R0_Rroue)
    // console.log(main_Rroue)
    // console.log(mainD_R0)
    // console.log(MP_R0_Rbras_construction)

    let main_Rbras = math.lusolve(MP_R0_Rbras_construction,mainD_R0);
    // let main_Rbras = math.divide(MP_R0_Rbras_construction,math.transpose(mainD_R0));
    main_Rbras = math.transpose(main_Rbras);
    // console.log(main_Rbras)

    // Calcul des coordonnées du coudeD par calcul d'intersection cercle-spehere
    // cercle de plan normal n, centre c_s et rayon Lbras
    // sphere de centre c_s et de rayon LAvtBras

    let n = [MP_R0_Rbras_construction[0][2],MP_R0_Rbras_construction[1][2],MP_R0_Rbras_construction[2][2]];
    let c_c = [MP_R0_Rbras_construction[0][3],MP_R0_Rbras_construction[1][3],MP_R0_Rbras_construction[2][3]];
    let c_s = [mainD_R0[0],mainD_R0[1],mainD_R0[2]];
    let coudeD = circle_sphere_intersection(c_c,Lbras,c_s,LavtBras+Lmain,n)
    // console.log(coudeD)
    let coudeD_R0;
    // console.log(coudeD.length)
    if (coudeD.length==2) {
        let coude1_R0 = coudeD[0];
        coude1_R0.push(1);
        let coude2_R0 = coudeD[1]
        coude2_R0.push(1);
        if (coude1_R0[0] < coude2_R0[0]) {
            // console.log("coude1_R0[0] < coude2_R0[0]")
            coudeD_R0 = coude1_R0;
        }else{
            // console.log("coude1_R0[0] > coude2_R0[0]")
            coudeD_R0 = coude2_R0;
        }
    }else{
        coudeD_R0 = coudeD;
        coudeD_R0.push(1);
    }
    // console.log(coudeD);
    // console.log(coudeD_R0);

    if (coudeD == 0) {
        let coudeD_Rbras = [0,0,Lbras,1];
        coudeD_R0 = math.multiply(MP_R0_Rbras_construction,coudeD_Rbras);

        let theta_coude = 60 * Math.PI / 180;
        let mainD_Rbras = [0,(LavtBras+Lmain)*Math.sin(theta_coude),Lbras+(LavtBras+Lmain)*Math.cos(theta_coude),1];
        let mainD_R0 = math.multiply(MP_R0_Rbras_construction,mainD_Rbras);
    }

    let coudeG_R0 = [coudeD_R0[0],coudeD_R0[1],-coudeD_R0[2],coudeD_R0[3]];
    let mainG_R0 = [mainD_R0[0],mainD_R0[1],-mainD_R0[2],mainD_R0[3]];

    // Repere avtBras
    let rotx_90 = matrice_Rotation('x',90,4);
    // console.log(rotx_90);
    let epauleD_R0 = math.transpose(MP_R0_Rbras_construction)[3];
    // console.log(epauleD_R0)
    let MP_R0_RbrasD_construction = cal_repere_membre_sup(epauleD_R0,coudeD_R0,0);
    // console.log(MP_R0_RbrasD_construction)
    repere_patient.brasD = math.multiply(rotx_90,MP_R0_RbrasD_construction);

    let epauleG_R0 = [epauleD_R0[0],epauleD_R0[1],-epauleD_R0[2],epauleD_R0[3]];
    let MP_R0_RbrasG_construction = cal_repere_membre_sup(epauleG_R0,coudeG_R0,0);
    // console.log(MP_R0_RbrasG_construction)
    repere_patient.brasG = math.multiply(rotx_90,MP_R0_RbrasG_construction);

    let coudeD_Rbras = math.lusolve(MP_R0_RbrasD_construction,coudeD_R0).flat();
    let mainD_Rbras = math.lusolve(MP_R0_RbrasD_construction,mainD_R0).flat();
    // console.log(coudeD_Rbras);
    // console.log(mainD_Rbras);

    let MP_RbrasD_RavtBrasD_construction = cal_repere_membre_sup(coudeD_Rbras,mainD_Rbras,MP_R0_RbrasD_construction);
    // console.log(MP_RbrasD_RavtBrasD_construction)
    let MP_R0_RavtBrasD_construction = math.multiply(MP_R0_RbrasD_construction,MP_RbrasD_RavtBrasD_construction);
    // console.log(MP_R0_RavtBrasD_construction)
    repere_patient.avtBrasD = math.multiply(rotx_90,MP_R0_RavtBrasD_construction);
    // console.log(repere_patient.avtBrasD)

    let coudeG_Rbras = math.lusolve(MP_R0_RbrasG_construction,coudeG_R0).flat();
    let mainG_Rbras = math.lusolve(MP_R0_RbrasG_construction,mainG_R0).flat();
    // console.log(coudeD_Rbras);
    // console.log(mainD_Rbras);

    let MP_RbrasG_RavtBrasG_construction = cal_repere_membre_sup(coudeG_Rbras,mainG_Rbras,MP_R0_RbrasG_construction);
    // console.log(MP_RbrasD_RavtBrasD_construction)
    let MP_R0_RavtBrasG_construction = math.multiply(MP_R0_RbrasG_construction,MP_RbrasG_RavtBrasG_construction);
    // console.log(MP_R0_RavtBrasD_construction)
    repere_patient.avtBrasG = math.multiply(rotx_90,MP_R0_RavtBrasG_construction);
    // console.log(repere_patient.avtBrasD)

}

// import {matrice_normalize} from "/js/1_Initialisation/Functions/matrice_normalize.js";
// import * as THREE from 'https://unpkg.com/three/build/three.module.js';

function circle_sphere_intersection(c_c,r_c,c_s,r_s,n) {
    // console.log(c_c,r_c,c_s,r_s,n)
    let points;
    let d=math.dot(n, math.add(c_c,math.multiply(c_s,-1)));
    // console.log(d)
    if (Math.abs(d)>r_s) {
        // aucune solution : le plan n ne coupe pas la sphere
        let points = 0;
    }else{
        let c_p = math.add(c_s,math.multiply(d,n));
        // console.log(c_p)
        // si la distance entre le centre de la sphere et le plan n est égale au rayon de la sphere
        if (d == r_s) {
            let d2 = math.norm(math.add(c_p,math.multiply(c_c,-1)));
            let r_p = Math.sqrt(Math.pow(r_s,2)-Math.pow(d,2));
            if (d2 == r_c+r_p){
                points=c_p;
            }else{
                points=0;
            }
        }else{
            let r_p = Math.sqrt(Math.pow(r_s,2)-Math.pow(d,2));
            // console.log(r_p)
            let t = vecteur_normalize((math.cross(math.add(c_p,math.multiply(c_c,-1)),n)));
            // console.log(t)
            let d2 = math.norm(math.add(c_p,math.multiply(c_c,-1)));
            if (d2 > r_c+r_p){
                let points=0;
            }else{
                if (d2 == r_c+r_p){
                    // points=c_c+(c_p-c_c)*r_c/d2;
                    points = math.mul(math.multiply(math.add(c_c,math.add(c_p,math.multiply(c_c,-1))),r_c),1/d2);
                }else{
                    let h = 1/2+(Math.pow(r_c,2)-Math.pow(r_p,2))/(2*Math.pow(d2,2));
                    // console.log(h)
                    // let c_i = c_c+h*(c_p-c_c);
                    let c_i = math.add(c_c,math.multiply(h,math.add(c_p,math.multiply(c_c,-1))));
                    // console.log(c_i)
                    let r_i = Math.sqrt(Math.pow(r_c,2)-Math.pow(h,2)*Math.pow(d2,2));
                    // console.log(r_i)

                    let p_0 = math.add(c_i,math.multiply(math.multiply(t,r_i),-1));
                    // console.log(p_0)
                    let p_1 = math.add(c_i,math.multiply(t,r_i));
                    // console.log(p_1)

                    points = [p_0,p_1];
                }
            }
        }
    }
    return points;
}

function cal_repere_membre_sup(p1,p2,MP_R0_Rloc) {
    if (MP_R0_Rloc == 0) {
        MP_R0_Rloc = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    }
    p1 = p1.slice(0,3);
    // console.log(p1);
    p2 = p2.slice(0,3);
    // console.log(p2);
    let vectY = math.multiply((math.add(p1,math.multiply(p2,-1))),1/math.norm((math.add(p1,math.multiply(p2,-1)))))
    // console.log(vectY)
    let vect = math.lusolve(MP_R0_Rloc,[0,0,1,1]);
    vect = vect.slice(0,3);
    let vectX = math.cross(vectY,vect)[0];
    vectX = math.multiply(vectX,1/math.norm(vectX));

    let vectZ = math.cross(vectX,vectY);
    vectZ = math.multiply(vectZ,1/math.norm(vectZ));
    // console.log(vectZ)

    let MP_Rloc_Rmembre_construction = [vectX,vectY,vectZ,p1];
    MP_Rloc_Rmembre_construction = math.transpose(MP_Rloc_Rmembre_construction);
    MP_Rloc_Rmembre_construction.push([0,0,0,1]);
    // console.log(MP_Rloc_Rmembre_construction)
    return MP_Rloc_Rmembre_construction;
}

// Calcul Repere

function cal_repere_roue(side, deportX, deportY, deportZ, theta) {
    //repere_roue.m
    theta = theta * Math.PI / 180;
    let centre = [deportX, deportY, side * deportZ];
    let vectX = [1, 0, 0];
    let vectY = [0, Math.cos(-side * theta), Math.sin(-side * theta)];
    let vectZ = [0, -Math.sin(-side * theta), Math.cos(-side * theta)];

    let rep = math.transpose([vectX, vectY, vectZ, centre]);
    rep.push([0, 0, 0, 1]);
    return rep;
}

function cal_repere_assise(deport, hauteurSiege, profondeurSiege, angleSiege) {
    let theta = angleSiege * Math.PI / 180;
    let centre = [deport, hauteurSiege - profondeurSiege * Math.sin(theta), 0];
    let vectX = [Math.cos(theta), Math.sin(theta), 0];
    let vectY = [-Math.sin(theta), Math.cos(theta), 0];
    let vectZ = [0, 0, 1];

    let rep = math.transpose([vectX, vectY, vectZ, centre]);
    rep.push([0, 0, 0, 1]);
    return rep;
}

function cal_repere_potence(profondeurSiege, longueurPotence, anglePotence) {
    let theta = (anglePotence - 90) * Math.PI / 180;
    let centre = [profondeurSiege + longueurPotence * Math.sin(theta), -longueurPotence * Math.cos(theta), 0];
    let vectX = [Math.cos(theta), Math.sin(theta), 0];
    let vectY = [-Math.sin(theta), Math.cos(theta), 0];
    let vectZ = [0, 0, 1];

    let rep = math.transpose([vectX, vectY, vectZ, centre]);
    rep.push([0, 0, 0, 1]);
    return rep;
}

function cal_repere_repose(angleRepose) {
    let theta = (90 - angleRepose) * Math.PI / 180;
    let centre = [0, 0, 0];
    let vectX = [Math.cos(theta), Math.sin(theta), 0];
    let vectY = [-Math.sin(theta), Math.cos(theta), 0];
    let vectZ = [0, 0, 1];

    let rep = math.transpose([vectX, vectY, vectZ, centre]);
    rep.push([0, 0, 0, 1]);
    return rep;
}

// Fonction math

function matrice_transpose(input) {
    return input[0].map(function (col, i) {
        return input.map(function (row) {
            return row[i];
        });
    });
};

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

function vecteur_normalize(input) {
    let output = [];
    for (let i in input){
        output[i] = (input[i] - math.mean(input)) / (math.std(input))
    }
    return output;
}

// Fonction Graph

function cercle(centre, rayon, side, MC_distance) {
    let point = Array()
    for (let i = 0; i <= 360; i += 10) {
        // console.log(i);
        let theta = i * Math.PI / 180;
        let x = centre[0] + rayon * Math.cos(theta);
        let y = centre[1] + rayon * Math.sin(theta);
        let z = centre[2] + (side * MC_distance);
        point.push([x, y, z]);
    }
    point = matrice_transpose(point);
    return point;
}


// Fonction special

function matSlice(input,range) {
    let output = input.slice(0,3);
    output = math.transpose(output);
    output = output.slice(0,3);
    output = math.transpose(output);
    return output;
}

function matComb(input1,input2) {
    return [
        [input1[0][0],input1[0][1],input1[0][2],input2[0][3]],
        [input1[1][0],input1[1][1],input1[1][2],input2[1][3]],
        [input1[2][0],input1[2][1],input1[2][2],input2[2][3]],
        [input2[3][0],input2[3][1],input2[3][2],input2[3][3]],
    ]
}

function matrice_Rotation(axe,angle_deg,dim) {
    let angle_rad = angle_deg * Math.PI / 180;
    let Matrice_Rotation=[];
    switch (axe) {
        case'x':
            Matrice_Rotation=[
                [1,0,0],
                [0,Math.cos(angle_rad),-Math.sin(angle_rad)],
                [0,Math.sin(angle_rad),Math.cos(angle_rad)]
            ]
            break;
        case'y':
            Matrice_Rotation=[
                [Math.cos(angle_rad),0,Math.sin(angle_rad)],
                [0,1,0,],
                [-Math.sin(angle_rad),0,Math.cos(angle_rad)]
            ]
            break;
        case'z':
            Matrice_Rotation=[
                [Math.cos(angle_rad),-Math.sin(angle_rad),0],
                [Math.sin(angle_rad),Math.cos(angle_rad),0],
                [0,0,1]
            ]
            break;
    }

    if (dim == 4){
        Matrice_Rotation.push([0,0,0]);
        Matrice_Rotation=matrice_transpose(Matrice_Rotation);
        Matrice_Rotation.push([0,0,0,1]);
        Matrice_Rotation=matrice_transpose(Matrice_Rotation);
    }

    return Matrice_Rotation;
}

function matrice_Translation(x,y,z) {
    return [
        [1,0,0,x],
        [0,1,0,y],
        [0,0,1,z],
        [0,0,0,1]
    ]
}

// Config Plotly

function init_layout() {
    var layout = {
        margin: {t: 0, l: 0, b: 0, r: 0},
        autosize: true, // set autosize to rescale
        automargin: true,
        showlegend: false,
        scene: {
            xaxis: {
                showgrid: false,
                // showline: false,
                // zeroline: false,
                showticklabels: false,
                title: {text: ""},
                // type: "linear"
            },
            yaxis: {
                showgrid: false,
                // showline: false,
                // zeroline: false,
                showticklabels: false,
                title: {text: ""},
                // type: "linear"
            },
            zaxis: {
                showgrid: false,
                // showline: false,
                // zeroline: false,
                showticklabels: false,
                title: {text: ""},
                // type: "linear"
            },
            // hovermode: false,
            camera: {
                center:{
                    x: 0,
                    y: 0,
                    z: -0.1,
                },
                eye: {
                    x: 1,
                    y: 1,
                    z: 1,
                },
            },

            // aspectratio: {
            //     x: 1,
            //     y: 1,
            //     z: 1
            // }
        },
    };

    var config = {
        responsive: true,
    };

    return [layout, config];
}


// Animation Plotly

function rotation() {
    var gd = document.getElementById('myPloty3DChart');

    function run() {
        rotate('scene', Math.PI / 360);
        // rotate('scene2', -Math.PI / 180);
        requestAnimationFrame(run);
    }

    run();

    function rotate(id, angle) {
        var eye0 = gd.layout[id].camera.eye
        var rtz = xyz2rtz(eye0);
        rtz.t += angle;

        var eye1 = rtz2xyz(rtz);
        Plotly.relayout(gd, id + '.camera.eye', eye1)
    }

    function xyz2rtz(xyz) {
        return {
            r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
            t: Math.atan2(xyz.y, xyz.x),
            z: xyz.z
        };
    }

    function rtz2xyz(rtz) {
        return {
            x: rtz.r * Math.cos(rtz.t),
            y: rtz.r * Math.sin(rtz.t),
            z: rtz.z
        };
    }
}
// rotation();
