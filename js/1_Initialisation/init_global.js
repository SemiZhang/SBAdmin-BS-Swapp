function transpose(input){
    return input[0].map(function(col, i) {
        return input.map(function(row) {
            return row[i];
        });
    });
};

function cal_repere_roue(side,deportX,deportY,deportZ,theta) {
    //repere_roue.m
    theta = theta * Math.PI / 180;
    let centre = [deportX, deportY, side * deportZ];
    let vectX = [1, 0, 0];
    let vectY = [0, Math.cos(-side * theta), Math.sin(-side * theta)];
    let vectZ = [0, -Math.sin(-side * theta), Math.cos(-side * theta)];

    let rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cal_repere_assise(deport,hauteurSiege,profondeurSiege,angleSiege){
    let theta = angleSiege*Math.PI/180;
    let centre = [deport,hauteurSiege-profondeurSiege*Math.sin(theta),0];
    let vectX = [Math.cos( theta),Math.sin(theta),0];
    let vectY = [-Math.sin( theta),Math.cos(theta),0];
    let vectZ = [0,0,1];

    let rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cal_repere_potence(profondeurSiege,longueurPotence,anglePotence){
    let theta = (anglePotence-90)*Math.PI/180;
    let centre = [profondeurSiege+longueurPotence*Math.sin(theta),-longueurPotence*Math.cos(theta),0];
    let vectX = [Math.cos(theta),Math.sin(theta),0];
    let vectY = [-Math.sin(theta),Math.cos(theta),0];
    let vectZ = [0,0,1];

    let rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cal_repere_repose(angleRepose){
    let theta = (90-angleRepose)*Math.PI/180;
    let centre = [0,0,0];
    let vectX = [Math.cos(theta),Math.sin(theta),0];
    let vectY = [-Math.sin(theta),Math.cos(theta),0];
    let vectZ = [0,0,1];

    let rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cercle(centre,rayon,side,MC_distance){
    let point=Array()
    for (let i=0;i<=360;i+=10) {
        // console.log(i);
        let theta = i * Math.PI / 180;
        x = centre[0] + rayon * Math.cos(theta);
        y = centre[1] + rayon * Math.sin(theta);
        z = centre[2] + (side * MC_distance);
        point.push([x,y,z]);
    }
    point = transpose(point);
    return point;
}
// Fonction principale

function init_data() {

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
            points_chair.roue[i][i2] = transpose(points_chair.roue[i][i2]);
            for (let i3 in points_chair.roue[i][i2]) {
                points_chair.roue[i][i2][i3] = math.multiply(repere_chair.roue[i][i2], points_chair.roue[i][i2][i3]);
            }
            points_chair.roue[i][i2] = transpose(points_chair.roue[i][i2]);
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




    let data = Array();
    // Plotly Data

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
    /*
    let data_temp = {
        type: 'mesh3d',
        color : color.siege.assise,
        opacity: 1,
        flatshading: true, // important
        lighting: {
            facenormalsepsilon: 0 // important
        },
        x: Array(),
        y: Array(),
        z: Array(),
        i: [0, 2, 1, 3, 0, 1, 4, 5, 0, 0, 3, 2],
        j: [2, 4, 3, 5, 1, 2, 6, 6, 4, 1, 6, 3],
        k: [4, 6, 5, 7, 2, 3, 5, 7, 5, 5, 7, 6],
    }
    let data_temp = {
        type: 'scatter3d',
        surfaceaxis: 2,
        // color : color.siege.assise,
        // opacity: 1,
        x: Array(),
        y: Array(),
        z: Array(),
    }
    for (let i in points.siege.assise) {
        data_temp.x.push(points.siege.assise[i][0]);
        data_temp.y.push(-points.siege.assise[i][2]);
        data_temp.z.push(points.siege.assise[i][1]);
    }
    */

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
            x: transpose(points_chair.siege.repose[i])[0],
            y: math.multiply(transpose(points_chair.siege.repose[i])[2], -1),
            z: transpose(points_chair.siege.repose[i])[1],
        }
        data.push(data_temp);
    }

    // Chassis
    let chassisConnection = Array();
    chassisConnection.push(transpose([points_chair.roue_centre.arr.g, points_chair.roue_centre.arr.d]));
    chassisConnection.push(transpose([points_chair.siege.assise.ArrGauche1, points_chair.roue_centre.arr.g, points_chair.siege.fourche.g, points_chair.siege.fourcheBas.g]));
    chassisConnection.push(transpose([points_chair.siege.assise.ArrDroit1, points_chair.roue_centre.arr.d, points_chair.siege.fourche.d, points_chair.siege.fourcheBas.d]));
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





    // Repere Patient
    let thetaD = reglage_chair.siege.dossier.angle;
    let thetaBras = reglage_patient.bras.angle;
    let thetaP = reglage_chair.siege.potence.angle;

    repere_patient={};

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
    let MP_R0_Rbassin_org=MP_R0_Rassise_Construction;
    let Centre_loc=[lBassin,lBassin+3,0,1];
    let Centre_glob=math.multiply(MP_R0_Rbassin_org,Centre_loc);
    let MP_R0_Rbassin_construction=math.transpose(MP_R0_Rbassin_org);
    MP_R0_Rbassin_construction[3] = Centre_glob;
    MP_R0_Rbassin_construction=math.transpose(MP_R0_Rbassin_construction);
    let MP_R0_Rbassin_visualisation=math.multiply(rotx_90,MP_R0_Rbassin_construction);
    repere_patient.bassin=MP_R0_Rbassin_visualisation;

    // Repere Tronc
    let MP_R0_Rtronc_org=MP_R0_Rbassin_org;
    let R1=matrice_Rotation('z',thetaD-90,3);
    let MP_R0_Rtronc_construction = math.transpose(MP_R0_Rtronc_org);
    MP_R0_Rtronc_construction[3] = Centre_glob;
    MP_R0_Rtronc_construction = math.transpose(MP_R0_Rtronc_construction);
    let MP_R0_Rtronc_visualisation = math.multiply(rotx_90,MP_R0_Rtronc_construction);
    console.log(MP_R0_Rtronc_visualisation);
    repere_patient.tronc=MP_R0_Rtronc_visualisation;



    console.log(data)
    return data;
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
        Matrice_Rotation=transpose(Matrice_Rotation);
        Matrice_Rotation.push([0,0,0,1]);
        Matrice_Rotation=transpose(Matrice_Rotation);
    }

    return Matrice_Rotation;
}

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

function init_global() {
    let data = init_data();
    let layout = init_layout();
    Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
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

// require("/js/init_slider.js")