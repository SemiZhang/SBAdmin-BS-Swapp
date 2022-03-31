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

let points_r_local = {
    roue:{
        avt:{
            g: transpose(points.roue.avt.g),
            d: transpose(points.roue.avt.d),

        },
        arr:{
            g: points.roue.arr.g.push(new Array(points.roue.arr.g[0].length).fill(1)),
            d: points.roue.arr.d.push(new Array(points.roue.arr.d[0].length).fill(1)),
        },
    }
}


var layout = {
    margin: {t: 0, l: 0, b: 0, r: 0},
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

        arr: {
            g: transpose(points.roue.arr.g),
            d: transpose(points.roue.arr.d),
        },
        mc: {
            g: transpose(points.roue.mc.g),
            d: transpose(points.roue.mc.d),
        }
    }
}

var config = {
    responsive: true,
};

var data_roue_avt_g = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'green',
    },
    x: points.roue.avt.g[0],
    y: points.roue.avt.g[2],
    z: points.roue.avt.g[1],
}

var data_roue_mc_g = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'red',
    },
    x: points.roue.mc.g[0],
    y: points.roue.mc.g[2],
    z: points.roue.mc.g[1],
};

var data_roue_arr_g = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'green',
    },
    x: points.roue.arr.g[0],
    y: points.roue.arr.g[2],
    z: points.roue.arr.g[1],
}

var data_roue_avt_d = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'green',
    },
    x: points.roue.avt.d[0],
    y: points.roue.avt.d[2],
    z: points.roue.avt.d[1],
}

var data_roue_mc_d = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'red',
    },
    x: points.roue.mc.d[0],
    y: points.roue.mc.d[2],
    z: points.roue.mc.d[1],
};

var data_roue_arr_d = {
    type: 'scatter3d',
    mode: 'lines',
    marker:{
        color : 'green',
    },
    x: points.roue.arr.d[0],
    y: points.roue.arr.d[2],
    z: points.roue.arr.d[1],
}

var data = [data_roue_avt_g,data_roue_avt_d,data_roue_arr_g,data_roue_arr_d,data_roue_mc_g,data_roue_mc_d];


let datas_roue_barre=Array();
for (let a=0;a<4;a+=1) {
    for (let i=0;i<(data[a].x.length-1)/2;i+=2) {
        data_roue_barre = {
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
        datas_roue_barre.push(data_roue_barre);
    }
}
datas_roue_barre.forEach(element => data.push(element));

var layout = {
    margin: {t: 0, l: 0, b: 0, r: 0},
    autosize: true, // set autosize to rescale
    automargin: true,
    showlegend: false,
    // sliders: [{
    //     pad: {t: 30},
    //     x: 0.05,
    //     len: 0.95,
    //     currentvalue: {
    //         xanchor: 'right',
    //         prefix: 'color: ',
    //         font: {
    //             color: '#888',
    //             size: 0
    //         }
    //     },
    //     transition: {duration: 500},
    //     // By default, animate commands are bound to the most recently animated frame:
    //     steps: [{
    //         label: 'red',
    //         method: 'restyle',
    //         transition: {duration: 500},
    //         args: ['marker.color', 'red']
    //     }, {
    //         label: 'green',
    //         method: 'restyle',
    //         transition: {duration: 500},
    //         args: ['marker.color', 'green']
    //     }, {
    //         label: 'blue',
    //         method: 'restyle',
    //         transition: {duration: 500},
    //         args: ['marker.color', 'blue'],
    //     }]
    // }]
};

var config = {
    responsive: true,
};

Plotly.react('myPloty3DChart', data, layout, config);