// Mesh patient trying 1
let x_mesh_org = x_mesh;
for (let ele in x_mesh_org) {
    let ele_org = x_mesh_org[ele];
    len = ele_org.length
    for (let i = 1; i < len; i++) {
        x_mesh[ele].splice(3*i,0,ele_org[i+1]);
        x_mesh[ele].splice(3*i,0,ele_org[0]);
    }
}
let y_mesh_org = y_mesh;
for (let ele in y_mesh_org) {
    let ele_org = y_mesh_org[ele];
    len = ele_org.length
    for (let i = 1; i < len; i++) {
        y_mesh[ele].splice(3*i,0,ele_org[i+1]);
        y_mesh[ele].splice(3*i,0,ele_org[0]);
    }
}
let z_mesh_org = z_mesh;
for (let ele in z_mesh_org) {
    let ele_org = z_mesh_org[ele];
    len = ele_org.length
    for (let i = 1; i < len; i++) {
        z_mesh[ele].splice(3*i,0,ele_org[i+1]);
        z_mesh[ele].splice(3*i,0,ele_org[0]);
    }
}

let len1 = x_mesh.length;
for (let i1 = 0; i1 < len1-1; i1++) {
    let len2 = x_mesh[i1].length;
    for (let i2 = 0; i2 < len2-1; i2++) {
        data_temp={
            type:"mesh3d",
            opacity: 0.6,
            x: [x_mesh[i1][i2], x_mesh[i1][i2+1], x_mesh[i1+1][i2], x_mesh[i1+1][i2+1]],
            y: [y_mesh[i1][i2], y_mesh[i1][i2+1], y_mesh[i1+1][i2], y_mesh[i1+1][i2+1]],
            z: [z_mesh[i1][i2], z_mesh[i1][i2+1], z_mesh[i1+1][i2], z_mesh[i1+1][i2+1]],
        }
        data.push(data_temp);
    }
}

// for (let ele in y_mesh) {
//     let ele_org = y_mesh[ele];
//     for (let i = 1; i < ele_org.length-2; i++) {
//         y_mesh[ele].splice(3*i,0,ele_org[i+1]);
//         y_mesh[ele].splice(3*i,0,ele_org[0]);
//     }
// }
// for (let ele in z_mesh) {
//     let ele_org = z_mesh[ele];
//     for (let i = 1; i < ele_org.length-2; i++) {
//         z_mesh[ele].splice(3*i,0,ele_org[i+1]);
//         z_mesh[ele].splice(3*i,0,ele_org[0]);
//     }
// }


let x_flat = x_mesh.flat();
let x_flat_org = x_mesh.flat();
let y_flat = y_mesh.flat();
let y_flat_org = y_mesh.flat();
let z_flat = z_mesh.flat();
let z_flat_org = z_mesh.flat();
for (let i = 1; i < x_mesh.flat().length-2; i++) {
    x_flat.splice(3*i,0,x_flat_org[i+1]);
    x_flat.splice(3*i,0,x_flat_org[0]);
    y_flat.splice(3*i,0,y_flat_org[i+1]);
    y_flat.splice(3*i,0,y_flat_org[0]);
    z_flat.splice(3*i,0,z_flat_org[i+1]);
    z_flat.splice(3*i,0,z_flat_org[0]);
}
// console.log(x_flat);

