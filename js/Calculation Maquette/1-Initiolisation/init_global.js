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
    roue: {
        avt: {
            deport: 50,
            voie: 35,
            rayon: 5,
            carrosage: 0,
        },
        arr: {
            deport: 0,
            voie: 40,
            rayon: 30,
            carrosage: 0,
            MC_distance: 2,
            MC_rayon: 28,
        },
    },
};

let repere = {
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

let points = {
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

let data = Array();

let color = {
    roue:{
        avt: 'green',
        arr: 'green',
        mc: 'red',
    }
}

for (let i in points.roue) {
    for (let i2 in points.roue[i]) {
        let data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            marker:{
                color : color.roue[i],
            },
            x: points.roue[i][i2][0],
            y: points.roue[i][i2][2],
            z: points.roue[i][i2][1],
        }
        data.push(data_temp);
    }
}

for (let a=0;a<4;a+=1) {
    for (let i=0;i<(data[a].x.length-1)/2;i+=2) {
        data_temp = {
            type: 'scatter3d',
            mode: 'lines',
            opacity: 0.2,
            marker:{
                color : 'black',
            },
            x: [data[a].x[i],data[a].x[i+(data[a].x.length-1)/2]],
            y: [data[a].y[i],data[a].y[i+(data[a].x.length-1)/2]],
            z: [data[a].z[i],data[a].z[i+(data[a].x.length-1)/2]],
        }
        data.push(data_temp);
    }
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