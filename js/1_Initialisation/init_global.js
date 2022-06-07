import {reglage_chair} from "/js/1_Initialisation/init_coord.js";
import {reglage_patient} from "/js/1_Initialisation/init_coord.js";
import {patient} from "/js/1_Initialisation/init_coord.js";

export let repere_chair = Array();
export let points_chair = Array();
export let repere_patient={};
export let data = Array();
init_global();

export function init_global() {
    data = Array();
    init_data();
    let layout = init_layout();
    Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
}


// Fonction principale

export function init_data() {
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
    let mesh_accuracy = 8;
    let mesh_opacity = 0.6;
    let mesh_lineWidth = 0;

    let mesh = {};
    let data_temp = {};


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
        [mesh.tete.x,mesh.tete.y,mesh.tete.z] = ellipsoid(0,0,1.5*patient.Htronc+0.5*patient.Ltete,patient.ltete,patient.ltete,patient.Ltete,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
            opacity: mesh_opacity,
            x: mesh.tete.y.flat(),
            y: mesh.tete.x.flat(),
            z: mesh.tete.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh epaule
    mesh.epaule = {};
    for (let i in [0,1]) {
        [mesh.epaule.x,mesh.epaule.y,mesh.epaule.z] = ellipsoid(0,0,1.5*patient.Htronc-5/8*patient.lbassin,patient.lbassin,patient.Lepaule,patient.lbassin,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
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
        [mesh.brasD.x,mesh.brasD.y,mesh.brasD.z] = ellipsoid(0,-0.5*(patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin,patient.pbras,patient.Lbras,patient.lbras,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
            opacity: mesh_opacity,
            x: mesh.brasD.x.flat(),
            y: mesh.brasD.y.flat(),
            z: mesh.brasD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.brasG = {};
    for (let i in [0,1]) {
        [mesh.brasG.x,mesh.brasG.y,mesh.brasG.z] = ellipsoid(0,0.5*(patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin,patient.pbras,patient.Lbras,patient.lbras,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
            opacity: 0.6,
            x: mesh.brasG.x.flat(),
            y: mesh.brasG.y.flat(),
            z: mesh.brasG.z.flat(),
        }
        data.push(data_temp);
    }

    // Mesh avtBras
    mesh.avtBrasD = {};
    for (let i in [0,1]) {
        [mesh.avtBrasD.x,mesh.avtBrasD.y,mesh.avtBrasD.z] = ellipsoid(0,-(0.5*patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin-1/2*patient.LavtBras,patient.pavtBras,patient.lavtBras,patient.LavtBras,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
            opacity: mesh_opacity,
            x: mesh.avtBrasD.x.flat(),
            y: mesh.avtBrasD.y.flat(),
            z: mesh.avtBrasD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.avtBrasG = {};
    for (let i in [0,1]) {
        [mesh.avtBrasG.x,mesh.avtBrasG.y,mesh.avtBrasG.z] = ellipsoid(0,(0.5*patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin-1/2*patient.LavtBras,patient.pavtBras,patient.lavtBras,patient.LavtBras,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
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
        [mesh.mainD.x,mesh.mainD.y,mesh.mainD.z] = ellipsoid(0,-(0.5*patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin-1/2*patient.Lmain-patient.LavtBras,patient.pavtBras/2,patient.lavtBras/2,patient.Lmain,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
            opacity: mesh_opacity,
            x: mesh.mainD.x.flat(),
            y: mesh.mainD.y.flat(),
            z: mesh.mainD.z.flat(),
        }
        data.push(data_temp);
    }

    mesh.mainG = {};
    for (let i in [0,1]) {
        [mesh.mainG.x,mesh.mainG.y,mesh.mainG.z] = ellipsoid(0,(0.5*patient.Lepaule+patient.Lbras),1.5*patient.Htronc-5/8*patient.lbassin-1/2*patient.Lmain-patient.LavtBras,patient.pavtBras/2,patient.lavtBras/2,patient.Lmain,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
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
        [mesh.bassin.x,mesh.bassin.y,mesh.bassin.z] = ellipsoid(0,0,0.5*patient.Htronc,patient.lbassin,patient.Lbassin,patient.lbassin,mesh_accuracy,i);

        data_temp = {
            type: 'mesh3d',
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
            0.5*patient.Lcuisse,-(0.5*patient.Lbassin),0.5*patient.Htronc,
            patient.Lcuisse,patient.lcuisse,patient.lcuisse,
            mesh_accuracy,i
        );

        data_temp = {
            type: 'mesh3d',
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
                0.5*patient.Lcuisse,(0.5*patient.Lbassin),0.5*patient.Htronc,
                patient.Lcuisse,patient.lcuisse,patient.lcuisse,
                mesh_accuracy,i
            );

        data_temp = {
            type: 'mesh3d',
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
                patient.Lcuisse,-(0.5*patient.Lbassin),0.5*(patient.Htronc-patient.Ltibia),
                patient.ltibia,patient.ltibia,patient.Ltibia,
                mesh_accuracy,i
            );

        data_temp = {
            type: 'mesh3d',
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
                patient.Lcuisse,(0.5*patient.Lbassin),0.5*(patient.Htronc-patient.Ltibia),
                patient.ltibia,patient.ltibia,patient.Ltibia,
                mesh_accuracy,i
            );

        data_temp = {
            type: 'mesh3d',
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
                patient.Lcuisse+0.5*patient.Lpied,-(0.5*patient.Lbassin),0.5*(patient.Htronc)-patient.Ltibia,
                patient.Lpied,patient.lpied,patient.lpied,
                mesh_accuracy,i
            );

        data_temp = {
            type: 'mesh3d',
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
                patient.Lcuisse+0.5*patient.Lpied,(0.5*patient.Lbassin),0.5*(patient.Htronc)-patient.Ltibia,
                patient.Lpied,patient.lpied,patient.lpied,
                mesh_accuracy,i
            );

        data_temp = {
            type: 'mesh3d',
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
