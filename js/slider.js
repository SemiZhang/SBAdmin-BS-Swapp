var slider = document.getElementById("RangeInput_Largeur");
var output = document.getElementById("RangeOutput_Largeur");
output.innerHTML = slider.value; // Display the default slider value
//todo: use loop to bind sliders

// Update the current slider value (each time you drag the slider handle)
slider.addEventListener("input",ValueChanged);
function ValueChanged() {
    output.innerHTML = this.value;
    reglage.siege.assise.largeur = this.value;
    init_global();
}

// slider.oninput(function() {
//     output.innerHTML = this.value;
// })

// var tag_slider = document.getElementsByName("RangeInput");
// var tag_output = document.getElementsByName("RangeOutput");
