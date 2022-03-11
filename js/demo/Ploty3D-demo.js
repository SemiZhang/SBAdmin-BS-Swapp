// Ploty Chart Example

var ctx = document.getElementById("myPloty3dChart");

const pointCount = 3142;

let x = [];
let y = [];
let z = [];
let steps = [];

for(let i = 0; i < pointCount; i++)
{
    r = i * (pointCount - i);
    x.push(r * Math.cos(i / 150));
    y.push(r * Math.sin(i / 150));
    z.push(i);
}

var data = [{
    type: 'scatter3d',
    // mode: 'lines',
    marker:{
        color : 'red',
    },
    x: x,
    y: y,
    z: z,
}];


var layout = {
    margin: {t: 0, l: 0, b: 0, r: 0},
    autosize: true, // set autosize to rescale
    automargin: true,
    // scene: {
    //     camera: {
    //         eye: {
    //             x: 1.88, y: -2.12, z: 0.96
    //         }
    //     }
    // },
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
    // showSendToCloud: true,
    // displayModeBar: false,
    responsive: true,
}

var frames = [
    {
        name: 'red',
        data: [{
            'marker.color': 'red'
        }]
    },
    {
        name: 'green',
        data: [{
            'marker.color': 'green'
        }]
    },
    {
        name: 'blue',
        data: [{
            'marker.color': 'blue'
        }]
    }
]

Plotly.react('myPloty3DChart', {data, layout, frames, config});
