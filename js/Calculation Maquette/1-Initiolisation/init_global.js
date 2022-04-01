function transpose(input){
    return input[0].map(function(col, i) {
        return input.map(function(row) {
            return row[i];
        });
    });
};


let centre;
let vectX;
let vectY;
let vectZ;
let rep;

function cal_repere_roue(side,deportX,deportY,deportZ,theta) {
    // rep_roue = [];
    //repere_roue.m
    centre=[deportX, deportY, side * deportZ];
    vectX=[1,0,0];
    vectY=[0,Math.cos( -side * theta),Math.sin(-side * theta)];
    vectZ=[0,-Math.sin(-side * theta),Math.cos(-side * theta)];

    rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cal_repere_assise(deport,hauteurSiege,profondeurSiege,angleSiege){
    centre = [deport,hauteurSiege-profondeurSiege*Math.sin(angleSiege*Math.PI/180),0];
    vectX = [Math.cos( angleSiege*Math.PI/180),Math.sin(angleSiege*Math.PI/180),0];
    vectY = [-Math.sin( angleSiege*Math.PI/180),Math.cos(angleSiege*Math.PI/180),0];
    vectZ = [0,0,1];

    rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

function cal_repere_potence(profondeurSiege,longueurPotence,anglePotence){
    centre = [profondeurSiege+longueurPotence*Math.sin((anglePotence-90)*Math.PI/180),-longueurPotence*Math.cos((anglePotence-90)*Math.PI/180),0];
    vectX = [Math.cos((anglePotence-90)*Math.PI/180),Math.sin((anglePotence-90)*Math.PI/180),0];
    vectY = [-Math.sin((anglePotence-90)*Math.PI/180),Math.cos((anglePotence-90)*Math.PI/180),0];
    vectZ = [0,0,1];

    rep=transpose([vectX,vectY,vectZ,centre]);
    rep.push([0,0,0,1]);
    return rep;
}

let point;
let theta;
function cercle(centre,rayon,side,MC_distance){
    point=Array()
    for (let i=0;i<=360;i+=10) {
        // console.log(i);
        theta = i * Math.PI / 180;
        x = centre[0] + rayon * Math.cos(theta);
        y = centre[1] + rayon * Math.sin(theta);
        z = centre[2] + (side * MC_distance);
        point.push([x,y,z]);
    }
    point = transpose(point);
    return point;
}

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

let repere = {
    siege:{
        assise: cal_repere_assise(reglage.roue.arr.deport,reglage.siege.assise.hauteur,reglage.siege.assise.profondeur,reglage.siege.assise.angle),
        potence: cal_repere_potence(reglage.siege.assise.profondeur,reglage.siege.potence.longueur,reglage.siege.potence.angle),
    },
    roue:{
        avt:{
            g: cal_repere_roue(-1, reglage.roue.avt.deport, reglage.roue.avt.rayon, reglage.roue.avt.voie, reglage.roue.avt.carrosage),
            d: cal_repere_roue(1, reglage.roue.avt.deport, reglage.roue.avt.rayon, reglage.roue.avt.voie, reglage.roue.avt.carrosage),
        },
        arr:{
            g: cal_repere_roue(-1, reglage.roue.arr.deport, reglage.roue.arr.rayon, reglage.roue.arr.voie, reglage.roue.arr.carrosage),
            d: cal_repere_roue(1, reglage.roue.arr.deport, reglage.roue.arr.rayon, reglage.roue.arr.voie, reglage.roue.arr.carrosage),
        },
        mc: {
            g: cal_repere_roue(-1, reglage.roue.arr.deport, reglage.roue.arr.rayon, reglage.roue.arr.voie, reglage.roue.arr.carrosage),
            d: cal_repere_roue(1, reglage.roue.arr.deport, reglage.roue.arr.rayon, reglage.roue.arr.voie, reglage.roue.arr.carrosage),
        }
    },
};
repere.siege.potence = math.multiply(repere.siege.assise,repere.siege.potence);

let points = {
    siege:{
        assise:{
            AvtDroit1: [reglage.siege.assise.profondeur,0,reglage.siege.assise.largeur/2],
            AvtDroit2: [reglage.siege.assise.profondeur,3,reglage.siege.assise.largeur/2],
            AvtGauche1: [reglage.siege.assise.profondeur,0,-reglage.siege.assise.largeur/2],
            AvtGauche2: [reglage.siege.assise.profondeur,3,-reglage.siege.assise.largeur/2],
            ArrDroit1: [0,0,reglage.siege.assise.largeur/2],
            ArrDroit2: [0,3,reglage.siege.assise.largeur/2],
            ArrGauche1: [0,0,-reglage.siege.assise.largeur/2],
            ArrGauche2: [0,3,-reglage.siege.assise.largeur/2],
        },
        fourchette:{
            g: [Math.sqrt(Math.pow(reglage.siege.distanceFourche,2)-Math.pow((reglage.roue.avt.voie-reglage.siege.largeur)/2,2)),reglage.roue.arr.rayon-reglage.roue.avt.rayon,-(reglage.roue.avt.voie-reglage.siege.largeur)/2],
            d: [Math.sqrt(Math.pow(reglage.siege.distanceFourche,2)-Math.pow((reglage.roue.avt.voie-reglage.siege.largeur)/2,2)),reglage.roue.arr.rayon-reglage.roue.avt.rayon,(reglage.roue.avt.voie-reglage.siege.largeur)/2],
        },
        fourchetteBas:{
            g: [Math.sqrt(Math.pow(reglage.siege.distanceFourche,2)-Math.pow((reglage.roue.avt.voie-reglage.siege.largeur)/2,2)),0,-(reglage.roue.avt.voie-reglage.siege.largeur)/2],
            d: [Math.sqrt(Math.pow(reglage.siege.distanceFourche,2)-Math.pow((reglage.roue.avt.voie-reglage.siege.largeur)/2,2)),0,(reglage.roue.avt.voie-reglage.siege.largeur)/2],
        },
        Dossier:{
            g: [-reglage.siege.dossier.hauteur*Math.sin((reglage.siege.dossier.angle-90)*Math.PI/180),reglage.siege.dossier.hauteur*Math.cos((reglage.siege.dossier.angle-90)*Math.PI/180),reglage.siege.dossier.largeur/2],
            d: [-reglage.siege.dossier.hauteur*Math.sin((reglage.siege.dossier.angle-90)*Math.PI/180),-reglage.siege.dossier.hauteur*Math.cos((reglage.siege.dossier.angle-90)*Math.PI/180),reglage.siege.dossier.largeur/2],
        },
        potence:{
            g: [0,0,-reglage.siege.assise.largeur/2],
            d: [0,0,reglage.siege.assise.largeur/2]
        }
    },
    roue: {
        avt:{
            g: cercle([0,0,0], reglage.roue.avt.rayon, -1, 0),
            d: cercle([0,0,0], reglage.roue.avt.rayon, 1, 0),
        },
        arr: {
            g: cercle([0,0,0], reglage.roue.arr.rayon, -1, 0),
            d: cercle([0,0,0], reglage.roue.arr.rayon, 1, 0),
        },
        mc: {
            g: cercle([0,0,0], reglage.roue.arr.MC_rayon, -1, reglage.roue.arr.MC_distance),
            d: cercle([0,0,0], reglage.roue.arr.MC_rayon, 1, reglage.roue.arr.MC_distance),
        }
    }
}

for (let i in points.roue) {
    for (let i2 in points.roue[i]) {
        points.roue[i][i2].push(new Array(points.roue[i][i2][0].length).fill(1))
    }
}

for (let i in points.siege.assise) {
    points.siege.assise[i].push(1);
}

for (let i in points.siege.potence) {
    points.siege.potence[i].push(1);
}


let points_r_local = points;

for (let i in points.roue) {
    for (let i2 in points.roue[i]) {
        points_r_local.roue[i][i2] = transpose(points.roue[i][i2]);
        for (let i3 in points_r_local.roue[i][i2]) {
            points.roue[i][i2][i3]=math.multiply(repere.roue[i][i2],points_r_local.roue[i][i2][i3]);
        }
        points.roue[i][i2] = transpose(points.roue[i][i2]);
    }
}

for (let i in points.siege.assise) {
    points.siege.assise[i]=math.multiply(repere.siege.assise,points.siege.assise[i]);
}

for (let i in points.siege.potence) {
    points.siege.potence[i]=math.multiply(repere.siege.potence,points.siege.potence[i]);
}


let data = Array();

let color = {
    siege:{
        assise: 'red',
    },
    roue:{
        avt: 'green',
        arr: 'green',
        mc: 'red',
    }
}

// Roues
for (let i in points.roue) {
    for (let i2 in points.roue[i]) {
        let data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            marker:{
                color : color.roue[i],
            },
            line:{
                width: 10,
            },
            x: points.roue[i][i2][0],
            y: points.roue[i][i2][2],
            z: points.roue[i][i2][1],
        }
        data.push(data_temp);
    }
}
// Barres des Roues
for (let a=0;a<4;a+=1) {
    for (let i=0;i<(data[a].x.length-1)/2;i+=2) {
        let data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            opacity: 0.2,
            marker:{
                color : 'black',
            },
            line:{
                width: 3,
            },
            x: [data[a].x[i],data[a].x[i+(data[a].x.length-1)/2]],
            y: [data[a].y[i],data[a].y[i+(data[a].x.length-1)/2]],
            z: [data[a].z[i],data[a].z[i+(data[a].x.length-1)/2]],
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

x = [
    [points.siege.assise.AvtDroit1[0],points.siege.assise.AvtGauche1[0],points.siege.assise.ArrDroit1[0],points.siege.assise.ArrGauche1[0]],
    [points.siege.assise.AvtDroit2[0],points.siege.assise.AvtGauche2[0],points.siege.assise.ArrDroit2[0],points.siege.assise.ArrGauche2[0]],
    [points.siege.assise.AvtDroit1[0],points.siege.assise.AvtGauche1[0],points.siege.assise.AvtDroit2[0],points.siege.assise.AvtGauche2[0]],
    [points.siege.assise.ArrDroit1[0],points.siege.assise.ArrGauche1[0],points.siege.assise.ArrDroit2[0],points.siege.assise.ArrGauche2[0]],
    [points.siege.assise.AvtDroit1[0],points.siege.assise.ArrDroit1[0],points.siege.assise.AvtDroit2[0],points.siege.assise.ArrDroit2[0]],
    [points.siege.assise.AvtGauche1[0],points.siege.assise.ArrGauche1[0],points.siege.assise.AvtGauche2[0],points.siege.assise.ArrGauche2[0]]
];
y = [
    [points.siege.assise.AvtDroit1[2],points.siege.assise.AvtGauche1[2],points.siege.assise.ArrDroit1[2],points.siege.assise.ArrGauche1[2]],
    [points.siege.assise.AvtDroit2[2],points.siege.assise.AvtGauche2[2],points.siege.assise.ArrDroit2[2],points.siege.assise.ArrGauche2[2]],
    [points.siege.assise.AvtDroit1[2],points.siege.assise.AvtGauche1[2],points.siege.assise.AvtDroit2[2],points.siege.assise.AvtGauche2[2]],
    [points.siege.assise.ArrDroit1[2],points.siege.assise.ArrGauche1[2],points.siege.assise.ArrDroit2[2],points.siege.assise.ArrGauche2[2]],
    [points.siege.assise.AvtDroit1[2],points.siege.assise.ArrDroit1[2],points.siege.assise.AvtDroit2[2],points.siege.assise.ArrDroit2[2]],
    [points.siege.assise.AvtGauche1[2],points.siege.assise.ArrGauche1[2],points.siege.assise.AvtGauche2[2],points.siege.assise.ArrGauche2[2]]
];
z = [
    [points.siege.assise.AvtDroit1[1],points.siege.assise.AvtGauche1[1],points.siege.assise.ArrDroit1[1],points.siege.assise.ArrGauche1[1]],
    [points.siege.assise.AvtDroit2[1],points.siege.assise.AvtGauche2[1],points.siege.assise.ArrDroit2[1],points.siege.assise.ArrGauche2[1]],
    [points.siege.assise.AvtDroit1[1],points.siege.assise.AvtGauche1[1],points.siege.assise.AvtDroit2[1],points.siege.assise.AvtGauche2[1]],
    [points.siege.assise.ArrDroit1[1],points.siege.assise.ArrGauche1[1],points.siege.assise.ArrDroit2[1],points.siege.assise.ArrGauche2[1]],
    [points.siege.assise.AvtDroit1[1],points.siege.assise.ArrDroit1[1],points.siege.assise.AvtDroit2[1],points.siege.assise.ArrDroit2[1]],
    [points.siege.assise.AvtGauche1[1],points.siege.assise.ArrGauche1[1],points.siege.assise.AvtGauche2[1],points.siege.assise.ArrGauche2[1]]
];

let data_temp;
for (let i=0;i<6;i++) {
    if (i >= 4) {
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

let potence_connection = ['AvtGauche1','AvtDroit1'];
for (let i in points.siege.potence){
    Object.keys(points.siege.potence).indexOf()
    let data_temp = {
        type: 'scatter3d',
        mode: 'lines',
        opacity: 1,
        marker:{

        },
        line:{
            color : 'black',
            width: 8,
        },
        x: [points.siege.assise[potence_connection[Object.keys(points.siege.potence).indexOf(i)]][0],points.siege.potence[i][0]],
        y: [-points.siege.assise[potence_connection[Object.keys(points.siege.potence).indexOf(i)]][2],-points.siege.potence[i][2]],
        z: [points.siege.assise[potence_connection[Object.keys(points.siege.potence).indexOf(i)]][1],points.siege.potence[i][1]],
    }
    data.push(data_temp);
}


var layout = {
    margin: {t: 0, l: 0, b: 0, r: 0},
    autosize: true, // set autosize to rescale
    automargin: true,
    showlegend: false,
};

var config = {
    responsive: true,
};

Plotly.react('myPloty3DChart', data, layout, config);