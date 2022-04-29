/*var slider = document.getElementById("RangeInput_siege_assise_largeur");
var output = document.getElementById("RangeOutput_siege_assise_largeur");
slider.value = reglage.siege.assise.largeur;
output.innerHTML = slider.value;

// Update the current slider value (each time you drag the slider handle)
slider.addEventListener("input",ValueChanged);
function ValueChanged() {
    output.innerHTML = this.value;
    reglage.siege.assise.largeur = this.value;
    let data = init_data();
    let layout = init_layout();
    Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
}*/


//todo: use loop to bind
allSliders = Array();
for (let i1 in reglage) {
    for (let i2 in reglage[i1]){
        for (let i3 in reglage [i1][i2]){
            let slider = document.getElementById('RangeInput_'+i1+'_'+i2+'_'+i3);
            let output = document.getElementById('RangeOutput_'+i1+'_'+i2+'_'+i3);
            try{
                slider.value = reglage[i1][i2][i3];
                output.innerHTML = slider.value;
                slider.addEventListener("input",ValueChanged);
                function ValueChanged() {
                    output = document.getElementById('RangeOutput_'+i1+'_'+i2+'_'+i3);
                    output.innerHTML = this.value;
                    reglage[i1][i2][i3] = this.value;
                    let data = init_data();
                    let layout = init_layout();
                    Plotly.react('myPloty3DChart', data, layout[0], layout[1]);
                }
            } catch(error) {
                console.log(error)
            }
        }
    }
}
// allSliders.forEach(console.log();)


// slider.oninput(function() {
//     output.innerHTML = this.value;
// })

// var tag_slider = document.getElementsByName("RangeInput");
// var tag_output = document.getElementsByName("RangeOutput");
