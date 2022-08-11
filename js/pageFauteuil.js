let taille = 175;
init_coord_chair();
init_coord_patient()
init_layout();
init_option();
cal_model_fauteuil();
init_slider();

function init_coord_chair() {
    reglage_chair = {
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
                angle: 90,
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
                MC_distance: 3.5,
                MC_rayon: 28,
            },
        },
    };
    reglage_patient = {
        bras:{
            angle: 45,
        },
        main:{
            angle: 0,
        }
    }
}

function init_coord_patient(){
    patient = {
        Lpied: 0.146*taille,
        Ltibia: 0.246*taille,
        Lcuisse: 0.245*taille,
        Lbassin: 0.174*taille,
        Htronc: 0.34*taille,
        Lepaule: 0.259*taille,
        Ltete:0.130*taille,
        Lbras:0.136*taille,
        LavtBras:0.146*taille,
        Lmain:1/3*0.108*taille,

        lbassin: 0.1*taille,
        ltronc: 0.15*taille,
    }
    patient.ltete = 3/4*patient.Ltete;
    patient.lpied = 1/2*patient.ltete;

    patient.lcuisse = 0.3*patient.Lcuisse;
    patient.ltibia = 0.3*patient.Ltibia;
    patient.lbras = 0.4*patient.Lbras;
    patient.lavtBras = 0.4*patient.LavtBras;

    patient.ptronc = 1/3*patient.Htronc;
    patient.pbras = patient.lbras;
    patient.pavtBras = patient.lavtBras;

    patient.pointure = Math.ceil((patient.Lpied+1)*3/2);
}

function init_slider() {
    // Reglage Fauteuil
    for (let i1 in reglage_chair) {
        for (let i2 in reglage_chair[i1]) {
            for (let i3 in reglage_chair [i1][i2]) {
                let slider = document.getElementById('RangeInput_' + i1 + '_' + i2 + '_' + i3);
                let output = document.getElementById('RangeOutput_' + i1 + '_' + i2 + '_' + i3);
                try {
                    slider.value = reglage_chair[i1][i2][i3];
                    output.innerHTML = slider.value;
                    slider.addEventListener("input", ValueChanged);

                    function ValueChanged() {
                        output = document.getElementById('RangeOutput_' + i1 + '_' + i2 + '_' + i3);
                        output.innerHTML = this.value;
                        reglage_chair[i1][i2][i3] = parseFloat(this.value);
                        cal_model_fauteuil();
                        // let data = init_data();
                        // let layout = init_layout();
                        // Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
                    }
                } catch (error) {
                    // console.log(error)
                }
            }
        }
    }

    refreshSliderPatient();

    document.getElementById('RangeInputPatient_taille').value = taille;
    document.getElementById('RangeOutputPatient_taille').innerHTML = taille;
    document.getElementById('RangeInputPatient_taille').addEventListener("input", function () {
        output = document.getElementById('RangeOutputPatient_taille');
        output.innerHTML = this.value;
        taille = parseFloat(this.value);
        init_coord_patient();
        cal_model_fauteuil();
        refreshSliderPatient();
    });
}

function refreshSliderPatient(){
    // Reglage Patient
    for (let i1 in patient) {
        let slider = document.getElementById('RangeInputPatient_' + i1);
        let output = document.getElementById('RangeOutputPatient_' + i1);
        try {
            slider.value = patient[i1];
            output.innerHTML = slider.value;
            slider.addEventListener("input", function(){
                output = document.getElementById('RangeOutputPatient_' + i1);
                output.innerHTML = this.value;
                patient[i1] = parseFloat(this.value);
                cal_model_fauteuil();
            });
        } catch (error) {
            // console.log(error)
        }
    }
}

function init_option() {
    modelMode = 1;
    document.getElementById('modeleMode').addEventListener('change',(event) =>{
        if (event.currentTarget.checked) {
            modelMode = 0;
            cal_model_fauteuil();

        } else {
            modelMode = 1;
            cal_model_fauteuil();
        }
    })

    showFauteuil = 1;
    showPatient = 1;
}

function cal_model_fauteuil() {
    data = Array();
    cal_data_plotly()
    // let layout = init_layout();
    Plotly.react('myPloty3DChart', data, plotly_layout, plotly_config);
}

// Fonction principale

function cal_data_plotly() {
    // Fauteuil
    cal_repere_chair();
    cal_points_chair();
    cal_mesh_chair();

    // Patient
    cal_repere_patient();
    cal_mesh_patient();

    // let mesha = ndmesh([-1, 1, 0.2], [0, 10, 1]);
    // console.log(mesha)

    // console.log(repere_patient)
    // console.log(data)
    // return data;
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

function cal_repere_patient() {
    repere_patient = {};
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
    // console.log(R1_D)

    let MP_R0_RbrasD_org = matSlice(MP_R0_Rtronc_construction);
    MP_R0_RbrasD_org = math.multiply(R1_D,MP_R0_RbrasD_org);

    let MP_R0_RbrasD_construction = matComb(MP_R0_RbrasD_org,MP_R0_Rbassin_construction);
    MP_R0_RbrasD_construction = math.transpose(MP_R0_RbrasD_construction);
    MP_R0_RbrasD_construction[3] = Centre_glob_D;
    MP_R0_RbrasD_construction = math.transpose(MP_R0_RbrasD_construction);
    // console.log(MP_R0_RbrasD_construction)

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


    // repere_patient.tete = repere_patient.tronc;
    // repere_patient.epaule = repere_patient.tronc;
    //
    // repere_patient.piedD = repere_patient.tibiaD;
    // repere_patient.piedG = repere_patient.tibiaG;

    point_coude();
    // repere_patient.mainD = repere_patient.avtBrasD;
    // repere_patient.mainG = repere_patient.avtBrasG;

    meshlist = {
        tronc: {
            cx: 0,
            cy: patient.Htronc / 2,
            cz: 0,
            x: patient.ptronc,
            y: patient.Htronc,
            z: patient.ltronc,
            repere: "tronc"
        },
        tete: {
            cx: 0,
            cy: patient.Htronc + 0.5 * patient.Ltete,
            cz: 0,
            x: patient.ltete,
            y: patient.Ltete,
            z: patient.ltete,
            repere: "tronc"
        },
        epaule: {
            cx: 0,
            cy: patient.Htronc - 5 / 8 * patient.lbassin,
            cz: 0,
            x: patient.lbassin,
            y: patient.lbassin,
            z: patient.Lepaule,
            repere: "tronc"
        },
        brasD: {
            cx: 0,
            cy: -0.5 * patient.Lbras,
            cz: 0,
            x: patient.lbras,
            y: patient.Lbras,
            z: patient.pbras,
            repere: "brasD"
        },
        brasG: {
            cx: 0,
            cy: -0.5 * patient.Lbras,
            cz: 0,
            x: patient.lbras,
            y: patient.Lbras,
            z: patient.pbras,
            repere: "brasG"
        },
        avtBrasD: {
            cx: 0,
            cy: -0.5 * (patient.LavtBras + patient.Lmain),
            cz: 0,
            x: patient.lavtBras,
            y: patient.LavtBras,
            z: patient.pavtBras,
            repere: "avtBrasD"
        },
        avtBrasG: {
            cx: 0,
            cy: -0.5 * (patient.LavtBras + patient.Lmain),
            cz: 0,
            x: patient.lavtBras,
            y: patient.LavtBras,
            z: patient.pavtBras,
            repere: "avtBrasG"
        },
        mainD: {
            cx: 0,
            cy: -(patient.LavtBras + patient.Lmain),
            cz: 0,
            x: 0.5 * patient.lavtBras,
            y: patient.Lmain,
            z: 0.5 * patient.pavtBras,
            repere: "avtBrasD"
        },
        mainG: {
            cx: 0,
            cy: -(patient.LavtBras + patient.Lmain),
            cz: 0,
            x: 0.5 * patient.lavtBras,
            y: patient.Lmain,
            z: 0.5 * patient.pavtBras,
            repere: "avtBrasG"
        },
        bassin: {
            cx: 0,
            cy: 0,
            cz: 0,
            x: patient.lbassin,
            y: patient.lbassin,
            z: patient.Lbassin,
            repere: "bassin"
        },
        cuisseD: {
            cx: -0.5 * patient.Lcuisse,
            cy: 0,
            cz: 0,
            x: patient.Lcuisse,
            y: patient.lcuisse,
            z: patient.lcuisse,
            repere: "cuisseD"
        },
        cuisseG: {
            cx: -0.5 * patient.Lcuisse,
            cy: 0,
            cz: 0,
            x: patient.Lcuisse,
            y: patient.lcuisse,
            z: patient.lcuisse,
            repere: "cuisseG"
        },
        tibiaD: {
            cx: 0,
            cy: -0.5 * patient.Ltibia,
            cz: 0,
            x: patient.ltibia,
            y: patient.Ltibia,
            z: patient.ltibia,
            repere: "tibiaD"
        },
        tibiaG: {
            cx: 0,
            cy: -0.5 * patient.Ltibia,
            cz: 0,
            x: patient.ltibia,
            y: patient.Ltibia,
            z: patient.ltibia,
            repere: "tibiaG"
        },
        piedD: {
            cx: 0.25 * patient.Lpied,
            cy: -patient.Ltibia - 0.25 * patient.lpied,
            cz: 0,
            x: patient.Lpied,
            y: patient.lpied,
            z: patient.lpied,
            repere: "tibiaD"
        },
        piedG: {
            cx: 0.25 * patient.Lpied,
            cy: -patient.Ltibia - 0.25 * patient.lpied,
            cz: 0,
            x: patient.Lpied,
            y: patient.lpied,
            z: patient.lpied,
            repere: "tibiaG"
        }
    }
    
    for (let element in meshlist) {
        mesh[element] = {};

        switch (modelMode){
            case 0:
                for (let i in [0,1]) {
                    [mesh[element].x,mesh[element].y,mesh[element].z]=ellipsoid(meshlist[element].cx,meshlist[element].cy,meshlist[element].cz,meshlist[element].x,meshlist[element].y,meshlist[element].z,mesh_accuracy,i);

                    for (let i1 in mesh[element].x){
                        for (let i2 in mesh[element].x[i1]) {
                            // let repere_tronc = math.multiply(repere_patient.tronc,matrice_Translation(0,patient.Htronc/2,0));
                            let vector_rotate = math.multiply(repere_patient[meshlist[element].repere],[mesh[element].x[i1][i2],mesh[element].y[i1][i2],mesh[element].z[i1][i2],1])
                            mesh[element].x[i1][i2] = vector_rotate[0];
                            mesh[element].y[i1][i2] = vector_rotate[1];
                            mesh[element].z[i1][i2] = vector_rotate[2];
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
                        x: [mesh[element].x].flat().flat(),
                        y: [mesh[element].y].flat().flat(),
                        z: [mesh[element].z].flat().flat(),
                    }
                    data.push(data_temp);
                }
                break;
            case 1:
                for (let i in [0,1,2]) {
                    [mesh[element].x,mesh[element].y,mesh[element].z] = barre(meshlist[element].cx,meshlist[element].cy,meshlist[element].cz,meshlist[element].x,meshlist[element].y,meshlist[element].z,meshlist[element].repere,i);

                    // for (let i1 in mesh[element].x){
                    //     for (let i2 in mesh[element].x[i1]) {
                    //         // let repere_tronc = math.multiply(repere_patient.tronc,matrice_Translation(0,patient.Htronc/2,0));
                    //         let vector_rotate = math.multiply(repere_patient[meshlist[element].repere],[mesh[element].x[i1][i2],mesh[element].y[i1][i2],mesh[element].z[i1][i2],1])
                    //         mesh[element].x[i1][i2] = vector_rotate[0];
                    //         mesh[element].y[i1][i2] = vector_rotate[1];
                    //         mesh[element].z[i1][i2] = vector_rotate[2];
                    //     }
                    // }

                    data_temp = {
                        type: 'scatter3d',
                        mode: 'lines',
                        line: {
                            width: 20,
                        },
                        // opacity: mesh_opacity,
                        x: [mesh[element].x].flat().flat(),
                        y: [mesh[element].y].flat().flat(),
                        z: [mesh[element].z].flat().flat(),
                    }
                    data.push(data_temp);
                }
                break;
        }




    }
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

function barre(cx,cy,cz,x,y,z,repere,i) {
    // y_mesh.push(cy+y/2);
    // y_mesh.push(cy-y/2);
    // for (let i=0;i<2;i++) {
    //     x_mesh.push(cx)
    //     z_mesh.push(cz)
    // }

    let x_mesh = [cx];
    let y_mesh = [cy];
    let z_mesh = [cz];

    let meshes=[x_mesh,y_mesh,z_mesh];
    let centers=[cx,cy,cz];
    let coord=[x,y,z];

    meshes[i].push(centers[i]+coord[i]/2);
    meshes[i].push(centers[i]-coord[i]/2);
    for (let i2=0;i2<2;i2++) {
        meshes[(i+1)%3].push(centers[(i+1)%3])
        meshes[(i+2)%3].push(centers[(i+2)%3])
    }

    for (let i1 in x_mesh){
        let vector_rotate = math.multiply(repere_patient[repere],[x_mesh[i1],y_mesh[i1],z_mesh[i1],1])
        x_mesh[i1] = vector_rotate[0];
        y_mesh[i1] = vector_rotate[1];
        z_mesh[i1] = vector_rotate[2];
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
    plotly_layout = {
        hovermode: false,
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

    plotly_config = {
        responsive: true,
    };

    return [plotly_layout, plotly_config];
}


// Animation Plotly

function rotation_model() {
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
// rotation_model();




