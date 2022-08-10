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

// Repeat for each tab of photo
for (let index in names) {
    let targetName = names[index];

    // Initialization of variables
    pointIndex[targetName] = 0;

    // Main Konva frame
    stage[targetName] = new Konva.Stage({
        container: "konva_"+targetName,
    });

    // Layer in Konva frame, must have a layer
    layer[targetName] = new Konva.Layer();
    stage[targetName].add(layer[targetName]);

    // Image object
    image[targetName] = new Image();
    image[targetName].src='/test/'+[targetName]+'.jpg'; // Predefined image for testing use
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
                        pointData[circle.id()] = newRelPos;

                        // Test function : Show coordinate on image frame
                        text[targetName].text('absPos:\t'+newAbsPos.x+','+newAbsPos.y+'\nrelPos:\t'+relPos.x+','+relPos.y)

                        refreshTable(table);

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
                        e.evt.preventDefault();
                        circle.destroy();
                        delete pointData[circle.id()];
                        document.getElementById(circle.id()).children[1].innerHTML='';
                        let activeTab = $('#navTab_mesure >> .nav-link.active')[0];
                        refreshTable(document.getElementById('table_'+activeTab.id.replace(/-tab/,"")));
                    });
                };

                // Save coordinate
                pointData[table.rows[pointIndex[targetName]].id]={x:pos.x,y:pos.y};

                // Update pointIndex
                try {
                    if (!pointData[table.rows[pointIndex[targetName]+1].id]){
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


    // Test Information on frame
    text[targetName] = new Konva.Text({
        text: 'Click on the canvas to draw a circle',
        fontSize: 20,
        draggable: false,
        y:45,
    });
    layer[targetName].add(text[targetName]);

    text2[targetName] = new Konva.Text({
        text: 'Pointer Position',
        fontSize: 20,
        y:0,
    })
    layer[targetName].add(text2[targetName]);

    text3[targetName] = new Konva.Text({
        text: 'groupImage Position',
        fontSize: 20,
        y:20,
    })
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
    for (let i in pointData) {
        document.getElementById(i).setAttribute('class','table-success'); // Style included in Bootstrap template
        // Show saved data
        document.getElementById(i).children[1].innerHTML='x:'+parseInt(pointData[i].x)+'&emsp;y:'+parseInt(pointData[i].y);
        // Show saved status
        // document.getElementById(i).children[2].innerHTML='Enregistré';
    }

    let targetName = targetTable.id.replace(/table_/,"");
    // 'Active' point
    if (pointIndex[targetName]>0 && pointIndex[targetName] < targetTable.rows.length){
        targetTable.rows[pointIndex[targetName]].setAttribute('class','table-info');
    }
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