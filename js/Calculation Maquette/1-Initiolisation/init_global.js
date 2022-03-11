function transition(input){
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
let rep_roue;

function cal_repere_roue(side,deportX,deportY,deportZ,theta) {
    // rep_roue = [];
    centre=[deportX, deportY, side * deportZ];
    vectX=[1,0,0];
    vectY=[0,Math.cos( -side * theta),Math.sin(-side * theta)];
    vectZ=[0,-Math.sin(-side * theta),Math.cos(-side * theta)];

    rep_roue=transition([vectX,vectY,vectZ,centre]);
    rep_roue.push([0,0,0,1]);
    return rep_roue;
}


let point;
let theta;
let i
function cercle(centre,rayon,side,MC_distance){
    point=Array()
    for (i=0;i<=360;i+=10) {
        // console.log(i);
        theta = i * Math.PI / 180;
        x = centre[1] + rayon * Math.cos(theta);
        y = centre[2] + rayon * Math.sin(theta);
        z = side * MC_distance;
        point.push([x,y,z]);
    }
    point = transition(point);
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
    },
};


let points = {
    roue: {
        avt:{

        },
        arr: {
            g: cercle([0,0,0], reglage.roue.arr.rayon, -1, 0),
            d: cercle([0,0,0], reglage.roue.arr.rayon, 1, 0),
        },
        mc: {
            g: cercle([0,0,0], reglage.roue.arr.rayon, -1, reglage.roue.arr.MC_distance),
            d: cercle([0,0,0], reglage.roue.arr.rayon, 1, reglage.roue.arr.MC_distance),
        }
    }
}

let points_r_local = {
    roue:{
        avt:{

        },
        arr:{
            g: points.roue.arr.g.push(new Array(points.roue.arr.g[0].length).fill(1)),
            d: points.roue.arr.d.push(new Array(points.roue.arr.d[0].length).fill(1)),
        },
    }
}


var layout = {
    // margin: {t: 0, l: 0, b: 0, r: 0},
    autosize: true, // set autosize to rescale
    automargin: true,
    sliders: [{
        pad: {t: 30},
        x: 0.05,
        len: 0.95,
        currentvalue: {
            xanchor: 'right',
            prefix: 'color: ',
            font: {
                color: '#888',
                size: 0
            }
        },
        transition: {duration: 500},
        // By default, animate commands are bound to the most recently animated frame:
        steps: [{
            label: 'red',
            method: 'restyle',
            transition: {duration: 500},
            args: ['marker.color', 'red']
        }, {
            label: 'green',
            method: 'restyle',
            transition: {duration: 500},
            args: ['marker.color', 'green']
        }, {
            label: 'blue',
            method: 'restyle',
            transition: {duration: 500},
            args: ['marker.color', 'blue'],
        }]
    }]
};


var config = {
    responsive: true,
};

var data_roue_arr_g = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'red',
    },
    x: points.roue.mc.g[0],
    y: points.roue.mc.g[1],
    z: points.roue.mc.g[2],
};

var data_roue_arr_d = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'blue',
    },
    x: points.roue.mc.d[0],
    y: points.roue.mc.d[1],
    z: points.roue.mc.d[2],
};

var data = [data_roue_arr_g,data_roue_arr_d];

var ctx = document.getElementById("myPloty3dChart");

Plotly.react('myPloty3DChart', data, layout, config);