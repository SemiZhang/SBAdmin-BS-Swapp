// ----- Configs ------
// Circle default parameter
let pointRadius=5;
// Scale step
let  scaleBy = 1.05;

// ----- Functionality variables -----
// This variable should contain id of navTab for photos
let names = ["fauteuil_face", "fauteuil_profil"];


// ----- Do not change ------
// Data of all points
let pointData={};
// Status of selected point in list table
let pointIndex = {};
// Status of mouse click on image (Used in mouseup event listener of all circles)
let moved=0;


// Create Konva frame for image
var stage = {};
var layer = {};
var image = {};
var KonvaImage = {};
var groupImage = {};
var groupPoint = {};

var text = {};
var text2 = {};
var text3 = {};

var tooltipLayer = {};
var tooltip = {};
var tag = {};

// Read localStorage data
if (JSON.parse(localStorage.getItem("pointData"))){
    console.log("Saved Data Found");
    console.log(JSON.parse(localStorage.getItem("pointData")));

    pointData=JSON.parse(localStorage.getItem("pointData"));

};

// Create Konva image frame
// Repeat for each tab of photo
for (let index in names) {
    let targetName = names[index];

    // Initialization of variables
    pointIndex[targetName] = 0;
    if (!pointData[targetName]){
        pointData[targetName] = {};
    }

    // Main Konva frame
    stage[targetName] = new Konva.Stage({
        container: "konva_"+targetName,
        id: targetName,
    });

    // Layer in Konva frame, must have a layer
    layer[targetName] = new Konva.Layer();
    stage[targetName].add(layer[targetName]);

    // Image object
    image[targetName] = new Image();
    image[targetName].src='test/'+[targetName]+'.jpg'; // Predefined image for testing use
    KonvaImage[targetName] = new Konva.Image({
        image: image[targetName],
        draggable: false,
        id: "konvaImage_"+targetName,
    });

    // Cache image in Konva when loading finished
    // Indispensable for filters, good for performance
    image[targetName].onload = function(){
        KonvaImage[targetName].width(this.naturalWidth);
        KonvaImage[targetName].height(this.naturalHeight);
        KonvaImage[targetName].cache();
        KonvaImage[targetName].filters([Konva.Filters.Brighten]);
    };

    // Add image and points into same group (for scaling)
    groupImage[targetName] = new Konva.Group({
        draggable: true,
    });
    groupImage[targetName].add(KonvaImage[targetName]);

    groupPoint[targetName] = new Konva.Group();
    groupImage[targetName].add(groupPoint[targetName]);

    layer[targetName].add(groupImage[targetName]);

    // Listener for jasnyJS fileinput
    document.getElementById('file_'+targetName).addEventListener("input", function(e){
        image[targetName].src = URL.createObjectURL(e.target.files[0]);
        groupImage[targetName].position({x:0, y:0});
    });

    // Listener for brightness slider
    document.getElementById('input_brightness_'+targetName).addEventListener('input', function(){
        KonvaImage[targetName].brightness(parseFloat(this.value));
    });

    // Listener for point size slider
    document.getElementById('input_pointSize_'+targetName).addEventListener('input', function(){
        groupPoint[targetName].children.forEach((e)=>{
            e.radius(this.value);
        });
    });

    // const aspectRatio = stage[targetName].width() / stage[targetName].height();
    // const imageRatio = KonvaImage[targetName].width() / KonvaImage[targetName].height();
    // if (aspectRatio <= imageRatio) {
    //     newWidth = stage[targetName].width();
    //     newHeight = stage[targetName].width() / imageRatio;
    // } else {
    //     newWidth = stage[targetName].height() * imageRatio;
    //     newHeight = stage[targetName].height();
    // }
    // KonvaImage[targetName].size({
    //     width: newWidth,
    //     height: newHeight
    // });

    // resizeKonva(targetName);

    // Tooltip for points
    tooltip[targetName] = new Konva.Label({
        opacity: 0.75,
        visible: false,
        listening: false,
    });

    tag[targetName] = new Konva.Tag({
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
    });
    tooltip[targetName].add(tag[targetName]);

    tooltip[targetName].add(
        new Konva.Text({
            text: '',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white',
        })
    );

    tooltipLayer[targetName] = new Konva.Layer();
    tooltipLayer[targetName].add(tooltip[targetName]);
    stage[targetName].add(tooltipLayer[targetName]);


    // Listener for adding point on image
    KonvaImage[targetName].on('mouseup', function(e){
        // Only active on left click and no dragging movement
        if (e.evt.button==0 && moved==0){
            // Get event List Table
            let table = document.getElementById('table_'+targetName)

            if (pointIndex[targetName] == 0) {
                window.alert("Choisir d'abord un point parmi la liste")
            }else if (pointIndex[targetName] < table.rows.length) {
                // Get cursor position
                var pos = KonvaImage[targetName].getRelativePointerPosition();
                // Get target point's ID
                let pointID = table.rows[pointIndex[targetName]].id;

                // Check if circle exist
                let existingCircle = stage[targetName].find('#'+pointID)[0];

                if (existingCircle) {
                    // Moving existing circle to new position
                    tween = new Konva.Tween({
                        node: existingCircle,
                        duration: 0.3,
                        x: pos.x,
                        y: pos.y,
                        easing: Konva.Easings.EaseInOut,
                    }).play();
                }else{
                    addCircle(targetName,pos,pointID);
                };

                // Save coordinate
                pointData[targetName][table.rows[pointIndex[targetName]].id]={x:pos.x,y:pos.y};

                // Update pointIndex
                try {
                    if (!pointData[targetName][table.rows[pointIndex[targetName]+1].id]){
                        pointIndex[targetName]++;
                    }else{
                        pointIndex[targetName] = 0;
                    }
                }catch{
                    pointIndex[targetName] = 0;
                }

                if (pointIndex[targetName] == table.rows.length){
                    pointIndex[targetName] = 0;
                }

                // Refresh List Table
                refreshTable(table);
            }
        }
    })

    // Reset dragging checker at beginning of click
    KonvaImage[targetName].on('mousedown', function (e) {
        moved = 0;
    });

    // Zoom image by wheel
    groupImage[targetName].on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = groupImage[targetName].scaleX();
        var pointer = stage[targetName].getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - groupImage[targetName].x()) / oldScale,
            y: (pointer.y - groupImage[targetName].y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY < 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        if (newScale < scaleMin) {
            newScale = scaleMin;
        }
        groupImage[targetName].scale({ x: newScale, y: newScale });


        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        groupImage[targetName].position(newPos);

        // Keep circle size while zooming
        groupPoint[targetName].children.forEach((child)=>{
            child.scale({x: 1/newScale, y: 1/newScale})
        })
    });

    // Remove contextmenu on Konva frame
    stage[targetName].on('contextmenu', function (evt) {
        console.log('stage contextmenu')
        // prevent default behavior
        evt.evt.preventDefault();
        if (evt.target === stage[targetName]) {
            // if we are on empty place of the stage we will do nothing
            return;
        }
    });


    // Event listener for point list table, Refresh table color after every click
    document.getElementById('table_'+targetName).addEventListener('mouseup',function(e){
        pointIndex[targetName]=e.path[1].rowIndex; // path[1] only work for 'mouseup' event, path[2] for 'mousedown'
        refreshTable(this);
    });


    // Load saved points
    for (let point in pointData[targetName]){
        addCircle(targetName,{x:pointData[targetName][point].x,y:pointData[targetName][point].y},point);
    }

    // refresh list table
    refreshTable(document.getElementById('table_'+targetName));


    // Test Information on frame
    text[targetName] = new Konva.Text({
        text: 'Click on the canvas to draw a circle',
        fontSize: 20,
        draggable: false,
        y:45,
        listening: false,
    });
    layer[targetName].add(text[targetName]);

    text2[targetName] = new Konva.Text({
        text: 'Pointer Position',
        fontSize: 20,
        y:0,
        listening: false,
    });
    layer[targetName].add(text2[targetName]);

    text3[targetName] = new Konva.Text({
        text: 'groupImage Position',
        fontSize: 20,
        y:20,
        listening: false,
    });
    layer[targetName].add(text3[targetName]);

    stage[targetName].on('mouseover mousemove dragmove', ()=>{
        mousePos = stage[targetName].getRelativePointerPosition();
        text2[targetName].text('Pointer Position:'+mousePos.x+','+mousePos.y)
        text3[targetName].text('groupImage Position:'+groupImage[targetName].x()+','+groupImage[targetName].y())
    })

    stage[targetName].on('mouseout', ()=>{
        text2[targetName].text('Pointer Position:-1,-1')
    })

    stage[targetName].on('mouseover mousemove dragmove', function (evt) {
        moved = 1;
    });
}

function addCircle(targetName,pos,pointID){
    // Creat circle
    var circle = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 0,
        radius: pointRadius,
        opacity: 0.5,
        draggable: true,
        scale: {x:1/groupImage[targetName].scaleX(),y:1/groupImage[targetName].scaleY()},
        id: pointID,
    });
    // Add circle
    groupPoint[targetName].add(circle);
    // Add drag movement to circle
    circle.on('dragmove', (e) => {
        const absPos = circle.getAbsolutePosition();
        const relPos = groupImage[targetName].getRelativePointerPosition();
        const image = groupImage[targetName].children[0];

        // Limit point in image border
        let newAbsPos = { ...absPos };
        let newRelPos = { ...relPos };
        if (relPos.x < 0) {
            newAbsPos.x = groupImage[targetName].x();
            newRelPos.x = 0;
        }
        if (relPos.y < 0) {
            newAbsPos.y = groupImage[targetName].y();
            newRelPos.y = 0;
        }
        if (relPos.x > image.width()) {
            newAbsPos.x = image.width()*groupImage[targetName].scaleX() + groupImage[targetName].x();
            newRelPos.x = image.width();
        }
        if (relPos.y > image.height()) {
            newAbsPos.y = image.height()*groupImage[targetName].scaleY() + groupImage[targetName].y();
            newRelPos.y = image.height();
        }
        circle.setAbsolutePosition(newAbsPos);

        // Save new position to Data
        pointData[targetName][circle.id()] = newRelPos;

        // Test function : Show coordinate on image frame
        text[targetName].text('absPos:\t'+newAbsPos.x+','+newAbsPos.y+'\nrelPos:\t'+relPos.x+','+relPos.y)

        refreshTable(document.getElementById('table_'+circle.getStage().id()));

    });

    // Show a stroke and label on hover
    circle.on('mouseover mousemove dragmove', () => {
        // Show border
        circle.strokeWidth(2);

        // Update tooltip
        const absPos = circle.getAbsolutePosition();
        // var mousePos = node.getStage().getPointerPosition();

        tooltip[targetName]
            .getText()
            .text(document.getElementById(circle.id()).children[0].innerHTML);

        // Prevent tooltip from getting out of frame
        if (absPos.y < tooltip[targetName].height()) {
            tag[targetName].pointerDirection('up')
            tooltip[targetName].position({
                x: absPos.x,
                y: absPos.y + pointRadius,
            });
        }else{
            tag[targetName].pointerDirection('down')
            tooltip[targetName].position({
                x: absPos.x,
                y: absPos.y - pointRadius,
            });
        }

        if (absPos.x < tooltip[targetName].width()/2) {
            tag[targetName].pointerDirection('left')
            tooltip[targetName].position({
                x: absPos.x + pointRadius,
                y: absPos.y,
            });
        }else if (absPos.x > stage[targetName].width() - tooltip[targetName].width()/2) {
            tag[targetName].pointerDirection('right')
            tooltip[targetName].position({
                x: absPos.x - pointRadius,
                y: absPos.y,
            });
        }

        tooltip[targetName].show();
    });

    // Hide stoke and tooltip
    circle.on('mouseout', function () {
        // Hide border
        circle.strokeWidth(0);
        // Hide tooltip
        tooltip[targetName].hide();
    });
    stage[targetName].on('mouseout', ()=>{tooltip[targetName].hide();});

    // Delete circle with right click
    circle.on('contextmenu', (e) => {
        let activeTab = $('#navTab_mesure >> .nav-link.active')[0];

        e.evt.preventDefault();
        circle.destroy();
        tooltip[activeTab.id.replace(/-tab/,"")].hide();

        delete pointData[targetName][circle.id()];
        document.getElementById(circle.id()).children[1].innerHTML='';
        refreshTable(document.getElementById('table_'+activeTab.id.replace(/-tab/,"")));
    });
}

// Refresh konva image frame size while changing navTab
$('a[data-toggle="pill"]').on('shown.bs.tab',(e)=>{
    if (e.target.role == 'tab') {
        resizeKonva(e.target.id.replace(/-tab/,""))
    }
})

// Resize konva image frame while window resize
window.onresize = function() {
    let activeTab = $('#navTab_mesure >> .nav-link.active')[0];
    if (activeTab.role == 'tab'){
        resizeKonva(activeTab.id.replace(/-tab/,""));
    }
}

// List of point should be refreshed after every change
// Apply color to 'unsaved', 'active', 'saved' rows
// Update point coordinate data
function refreshTable(targetTable) {
    // Reinitialize the list table
    Array.from(targetTable.rows).forEach((e) => e.setAttribute('class',''));
    // 'Saved' point
    let targetName = targetTable.id.replace(/table_/,"")
    for (let i in pointData[targetName]) {
        document.getElementById(i).setAttribute('class','table-success'); // Style included in Bootstrap template
        // Show saved data
        document.getElementById(i).children[1].innerHTML='x:'+parseInt(pointData[targetName][i].x)+'&emsp;y:'+parseInt(pointData[targetName][i].y);
        // Show saved status
        // document.getElementById(i).children[2].innerHTML='Enregistré';
    }

    // 'Active' point
    if (pointIndex[targetName]>0 && pointIndex[targetName] < targetTable.rows.length){
        targetTable.rows[pointIndex[targetName]].setAttribute('class','table-info');
    }

    if (Object.keys(pointData.fauteuil_face).length == document.getElementById('table_fauteuil_face').children[1].children.length && Object.keys(pointData.fauteuil_profil).length == document.getElementById('table_fauteuil_profil').children[1].children.length) {
        document.getElementById('button_calcul').className = 'btn btn-warning nav-link'
        document.getElementById('button_calcul').disabled=false;
    }else{
        document.getElementById('button_calcul').disabled=true;
        document.getElementById('button_calcul').className = 'btn btn-secondary nav-link'
        document.getElementById('button_save').disabled = true;
        document.getElementById('button_save').className = 'btn btn-secondary nav-link'
    }

    // Save data
    savePoint();
}

function resizeKonva(targetName) {
    var getStyle = function(dom, attr){
        return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
    }
    let div = document.getElementById('konva_'+targetName);
    var clientWidth = div.clientWidth;
    var paddingLeft = Number(getStyle(div,"paddingLeft").replace(/\s+|px/gi,""));
    var paddingRight = Number(getStyle(div,"paddingRight").replace(/\s+|px/gi,""));
    var width = clientWidth - paddingLeft - paddingRight;
    var height = width * 3 / 4;

    stage[targetName].width(width);
    stage[targetName].height(height);

    let naturalWidth = image[targetName].naturalWidth;
    let naturalHeight = image[targetName].naturalHeight;

    if (naturalWidth > naturalHeight){
        groupImage[targetName].scale({x: stage[targetName].width()/naturalWidth, y: stage[targetName].width()/naturalWidth});
        stage[targetName].height(stage[targetName].width() / naturalWidth * naturalHeight);
    }else{
        stage[targetName].height(stage[targetName].width() / naturalWidth * naturalHeight);
        groupImage[targetName].scale({x: stage[targetName].height()/naturalHeight, y: stage[targetName].height()/naturalHeight});
    }
    scaleMin = 0.9 * stage[targetName].width()/naturalWidth;

    // Keep circle size
    // Changing image will resize and rescale the Konva stage (as above)
    groupPoint[targetName].children.forEach((child)=>{
        child.scale({x: 1/(stage[targetName].width()/naturalWidth), y: 1/(stage[targetName].width()/naturalWidth)});
    });
}

function savePoint(){
    // Save data in localStorage
    localStorage.setItem("pointData",JSON.stringify(pointData));
}


// Calculation
let calibHauteur = document.getElementById('calib1').valueAsNumber;
let calibSol = document.getElementById('calibSol').valueAsNumber;

document.getElementById('calib1').addEventListener('input', (e) => {
    if (e.target.value == ''){
        e.target.value = 0;
    };
    e.target.value = e.target.valueAsNumber;
    calibHauteur = e.target.valueAsNumber;
})

document.getElementById('calibSol').addEventListener('input', (e) => {
    if (e.target.value == ''){
        e.target.value = 0;
    };
    e.target.value = e.target.valueAsNumber;
    calibSol = e.target.valueAsNumber;
})

function distance(data,d,dReal){
    let distances = [Math.abs(data[1].x-data[0].x),Math.abs(data[1].y-data[0].y)];
    let result_photo = Math.sqrt((Math.pow(distances[0],2) + Math.pow(distances[1],2)));
    return result_photo * dReal / d;
}

function angle(data){
    let u = [data[1].x-data[0].x,data[1].y-data[0].y];
    u[2]=1;
    let v = [data[3].x-data[2].x,data[3].y-data[2].y];
    v[2]=1;
    return math.atan2(math.norm(math.cross(u,v)),math.dot(u,v))*180/Math.PI;
}

let resultCalcul = {};

function calculReglage(){
    if (Object.keys(pointData.fauteuil_face).length == document.getElementById('table_fauteuil_face').children[1].children.length && Object.keys(pointData.fauteuil_profil).length == document.getElementById('table_fauteuil_profil').children[1].children.length){
        let d_photo;

        // Profil
        let echelle1Profil = calibHauteur;
        let echelle2Profil = calibHauteur;

        let O1=pointData["fauteuil_profil"].tfp_c1b;
        let x1=pointData["fauteuil_profil"].tfp_c1h;
        let O2=pointData["fauteuil_profil"].tfp_c2b;
        let x2=pointData["fauteuil_profil"].tfp_c2h;
        let CRAvt=pointData["fauteuil_profil"].tfp_ravtc;
        let RAvt=pointData["fauteuil_profil"].tfp_ravte;
        let Fourche=pointData["fauteuil_profil"].tfp_fh;
        let Potence=pointData["fauteuil_profil"].tfp_pp;
        let SAvt=pointData["fauteuil_profil"].tfp_savt;
        let RArr=pointData["fauteuil_profil"].tfp_rarre;
        let MC=pointData["fauteuil_profil"].tfp_mce;
        let CRArr=pointData["fauteuil_profil"].tfp_rarrc;
        let SArr=pointData["fauteuil_profil"].tfp_sarr;
        let Dossier=pointData["fauteuil_profil"].tfp_dh;

        // 1st plan
        d_photo=distance([O1,x1],1,1);
        resultCalcul.diametreRoueArr=2*distance([CRArr,RArr],d_photo,echelle1Profil);
        resultCalcul.diametreMainCourante=2*distance([CRArr,MC],d_photo,echelle1Profil);
        resultCalcul.diametreRoueAvt=2*distance([CRAvt,RAvt],d_photo,echelle1Profil);

        // photo direction
        let sens=Math.sign((CRAvt.x-CRArr.x));
        resultCalcul.deportRoueAvt = Math.abs((CRAvt.x-CRArr.x))*echelle1Profil / d_photo;
        resultCalcul.deportRoueArr = sens * (SArr.x-CRArr.x) * echelle1Profil / d_photo;

        // 2nd plan
        d_photo=distance([O2,x2],1,1);
        let SAvt2={x:SAvt.x,y:O2.y};
        let SArr2={x:SArr.x,y:O2.y};
        resultCalcul.hauteurSiegeAvt=distance([SAvt,SAvt2],d_photo,echelle2Profil)+calibSol;
        resultCalcul.hauteurSiegeArr=distance([SArr,SArr2],d_photo,echelle2Profil)+calibSol;
        resultCalcul.angleSiege=90-angle([O2,x2,SArr,SAvt],d_photo,echelle2Profil);

        resultCalcul.profondeurSiege=distance([SArr,SAvt],d_photo,echelle2Profil);

        resultCalcul.hauteurDossier=distance([SArr,Dossier],d_photo,echelle2Profil);
        resultCalcul.angleDossier=angle([SArr,SAvt,SArr,Dossier],d_photo,echelle2Profil);
        resultCalcul.angleDossierPrVerticale=angle([O2,x2,SArr,Dossier],d_photo,echelle2Profil);

        resultCalcul.longueurPotence=distance([SAvt,Potence],d_photo,echelle2Profil);
        resultCalcul.anglePotence=angle([SAvt,SArr,SAvt,Potence],d_photo,echelle2Profil);
        resultCalcul.anglePotencePrVerticale=angle([O2,x2,SAvt,Potence],d_photo,echelle2Profil);


        let dChasse_Fourche_profil=(CRAvt.x-Fourche.x)*echelle2Profil/d_photo;

        // Face
        let echelle1Face = calibHauteur;
        let echelle2Face = calibHauteur;

        O1=pointData["fauteuil_face"].tff_c1b;
        x1=pointData["fauteuil_face"].tff_c1h;
        O2=pointData["fauteuil_face"].tff_c2b;
        x2=pointData["fauteuil_face"].tff_c2h;
        let CRAvtG=pointData["fauteuil_face"].tff_gravtc;
        let FourcheG=pointData["fauteuil_face"].tff_gf;
        let CRArrG=pointData["fauteuil_face"].tff_grarrc;
        let MCextG=pointData["fauteuil_face"].tff_gmce;
        let RArrGmilieu=pointData["fauteuil_face"].tff_grarrm;
        let RArrGhaut=pointData["fauteuil_face"].tff_grarrh;
        let SG=pointData["fauteuil_face"].tff_gs;
        let DG=pointData["fauteuil_face"].tff_gd;
        let DD=pointData["fauteuil_face"].tff_dd;
        let SD=pointData["fauteuil_face"].tff_ds;
        let CRArrD=pointData["fauteuil_face"].tff_drarrc;
        let CRAvtD=pointData["fauteuil_face"].tff_dravtc;

        // 1st plan
        d_photo=distance([O1,x1],1,1);

        let dChasse_Fourche_face=(FourcheG.x-CRAvtG.x)*echelle1Face/d_photo;
        resultCalcul.distanceChasseFourche=Math.pow(Math.pow(dChasse_Fourche_profil,2)+Math.pow(dChasse_Fourche_face,2),-2);
        resultCalcul.voieAvt=distance([CRAvtG,CRAvtD],d_photo,echelle1Face);
        resultCalcul.largeurSiege=distance([SG,SD],d_photo,echelle1Face);
        resultCalcul.distanceRoueMC=distance([RArrGmilieu,MCextG],d_photo,echelle1Face);

        // 2nd plan
        d_photo=distance([O2,x2],1,1);
        resultCalcul.angleCarrossage=angle([O2,x2,CRArrG,RArrGhaut]);
        resultCalcul.voieArr=distance([CRArrG,CRArrD],d_photo,echelle2Face);

        resultCalcul.largeurDossier=distance([DG,DD],d_photo,echelle2Face);

        result = {
            siege: {
                assise:{
                    largeur: resultCalcul.largeurSiege,
                    profondeur: resultCalcul.profondeurSiege,
                    hauteur: resultCalcul.hauteurSiegeAvt,
                    angle: resultCalcul.angleSiege,
                    distanceFourche: resultCalcul.distanceChasseFourche,
                },
                dossier:{
                    largeur: resultCalcul.largeurDossier,
                    hauteur: resultCalcul.hauteurDossier,
                    angle: resultCalcul.angleDossier,
                },
                potence:{
                    longueur: resultCalcul.longueurPotence,
                    angle: resultCalcul.anglePotence,
                },
            },
            roue: {
                avt: {
                    deport: resultCalcul.deportRoueAvt,
                    voie: resultCalcul.voieAvt/2,
                    rayon: resultCalcul.diametreRoueAvt/2,
                },
                arr: {
                    deport: resultCalcul.deportRoueArr,
                    voie: resultCalcul.voieArr/2,
                    rayon: resultCalcul.diametreRoueArr/2,
                    carrosage: resultCalcul.angleCarrossage,
                    MC_distance: resultCalcul.distanceRoueMC,
                    MC_rayon: resultCalcul.diametreMainCourante/2,
                },
            },
        }

        document.getElementById('button_calcul').className = "btn btn-success nav-link"
        document.getElementById('button_save').disabled = false;
        document.getElementById('button_save').className = 'btn btn-warning nav-link'

        console.log(result)
    }else {
        window.alert('Pointage incomplet')
    }
}

function saveResult() {
    let saving = {};
    let date;
    date = new Date().toLocaleString();
    if (localStorage.getItem('saveFauteuil')){
        saving = JSON.parse(localStorage.getItem('saveFauteuil'));
    }
    saving[date]=result;
    saving[date].time = new Date().toISOString();
    saving[date].pointData = pointData;
    console.log(saving)
    localStorage.setItem('saveFauteuil',JSON.stringify(saving))
    document.getElementById('button_save').className = "btn btn-success nav-link"
}