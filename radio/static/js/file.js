main();

var axis;
var slice;
var true_areas;
var predict_areas;
var view_areas=false;
var view_predict=false;
var image_data;
var canvas;
var image;

var width = 495;
var height = 495;

var current_axis=0;

predict_areas=new Array(2);
predict_areas[0]=new Array(5);
predict_areas[1]=new Array(5);

predict_areas[0][0]=0;
predict_areas[0][1]=45;
predict_areas[0][2]=212;
predict_areas[0][3]=78;
predict_areas[0][4]=7;

predict_areas[1][0]=0;
predict_areas[1][1]=300;
predict_areas[1][2]=155;
predict_areas[1][3]=117;
predict_areas[1][4]=5;

function generate_gen (){
    var root = document.getElementById('gen');

    var btn = document.createElement('input');
    btn.type = "button";
    btn.value ="predict all checked";
    btn.className= "btn  btn-info btn-lg";
    btn.setAttribute("data-toggle", "#modal");
    btn.setAttribute("data-target", "#myModal");
    // data-target="#myModal"
    btn.onclick=(function(entry){
            //TODO: add call to required id
            alert("predict all clicked")
        });

    var checkbox1 = document.createElement('input');
    checkbox1.type = "checkbox";
    //checkbox1.text.style.display= "Check All";

    root.appendChild(btn);
    root.appendChild(checkbox1);
}
function generate_scans_table(index_list){

    var tbl = document.createElement("table");
    tbl.className = "table table-striped";
    for (var r =0;r<10;r++) {

        var row = document.createElement("tr");// ("a")

        var cell = document.createElement("td");
        var cellText = document.createTextNode(1235 );
        cell.appendChild(cellText);

        var cell2 = document.createElement("td");
        var cellText2 = document.createTextNode(3568 );
        cell2.appendChild(cellText2);

        var cell3 = document.createElement("td");
        var btn = document.createElement('input');
        btn.className = "btn btn-info btn-lg btn-ct";
        btn.type = "button";
        btn.value ="predict/open";
        btn.className= "btn  btn-info btn-lg";
        /*btn.onclick=(function(entry){
            //TODO: add call to required id
            alert("click on btn#")
        });*/
        cell3.appendChild(btn);

        var cell4 = document.createElement("td");
        var checkbox1 = document.createElement('input');
        checkbox1.type = "checkbox";
        cell4.appendChild(checkbox1);

        row.appendChild(cell);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);


        cell2.onclick = function () {
            click_on_area(element)
        };
        tbl.appendChild(row);

        //document.body.insertBefore(element, list);
    }
    var list = document.getElementById("scan_list");
    list.insertBefore(tbl, list.childNodes[0]);
}

function post_image(path, data, method){

    method =  method || "post";
    var form = document.createElement("form");
    //var csrftoken = getCookie('csrftoken');
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("data", data);
    document.body.appendChild(form);
    form.submit();
}
function main() {

    generate_scans_table();
    //generate_gen();

    //Action for image upload
    $("#the_file_input").change(function(){
        //this.files
        post_image("/",this.file, "post");
        //TODO: send file to backend;
    });
    $(".btn-ct").attr('data-target','#myModal');

    var c_W = 550;
    var c_H = 550;
    canvas = document.querySelector("#glCanvas");
    canvas.width = c_W;
    canvas.height = c_H;

    const ctx = canvas.getContext('2d');
    ctx.scale(1.75, 1.75);

    // Sliders Action
    var range_x = document.getElementById("myRange1");
    var range_y = document.getElementById("myRange2");
    var range_z = document.getElementById("myRange3");

    // Mouse wheel action
    $('#myRange1').on('mousewheel', function(event) {
        event.preventDefault();
        value = range_x.value;
        if(event.originalEvent.deltaY <0){
            //alert("scrolled down");
            value = parseInt(value)+1;
            range_x.value=value;
            change_slider_x();
        }
        //Mousewheel Scrolled down
        else if(event.originalEvent.deltaY>0){
            //alert("scrolled up");
            value = value-1;
            range_x.value=value;
            change_slider_x();
        }
    });
    $('#myRange2').on('mousewheel', function(event) {
        event.preventDefault();
        value = range_y.value;
        //console.log(event.deltaX, event.deltaY, event.deltaFactor);
        //Mousewheel Scrolled up
        if(event.originalEvent.deltaY < 0){
            //alert("scrolled down");
            value = parseInt(value)+1;
            range_y.value=value;
            change_slider_y();
        }
        //Mousewheel Scrolled down
        else if(event.originalEvent.deltaY>0){
            //alert("scrolled up");
            value = value-1;
            range_y.value=value;
            change_slider_y();
        }
    });
    $('#myRange3').on('mousewheel', function(event) {
        event.preventDefault();
        value = range_z.value;
        //console.log(event.deltaX, event.deltaY, event.deltaFactor);
        //Mousewheel Scrolled up
        if (event.originalEvent.deltaY <0) {
            //alert("scrolled down");
            value = parseInt(value) + 1;
            range_z.value= value;
            change_slider_z();
        }
        //Mousewheel Scrolled down
        else if (event.originalEvent.deltaY>0) {
            //alert("scrolled up");
            value = value - 1;
            range_z.value= value;
            change_slider_z();
        }
    });

    // Action on slide change
    range_x.onchange = function(){change_slider_x()};
    range_y.onchange = function(){change_slider_y()};
    range_z.onchange = function(){change_slider_z()};
    //range_x.setAttribute('onchange', change_slider_x());
    //range_y.setAttribute('onchange', change_slider_y());
    //range_z.setAttribute('onchange', change_slider_z());


    // Buttons Action CT download list from .CSV
    var buttonsCT = document.getElementsByClassName('btn-ct');
    for (var i = 0; i < buttonsCT.length; i++)
        buttonsCT[i].onclick = function () {
            //alert("BUTTON CLICKED CSV download ...");
            $.ajax({
                type: "GET",
                data: {get_csv: 1},
                dataType: 'json',
                success: function (json) {
                    add_elements(json, "list1");
                },
                error: function (error, txtStatus) {
                    console.log(txtStatus);
                    console.log('error');
                }
            });

        };
}

// Action on slider change
function change_slider_x() {
    //alert("change X");
    var range_x = document.getElementById("myRange1");
    var range_y = document.getElementById("myRange2");
    var range_z = document.getElementById("myRange3");

    canvas = document.querySelector("#glCanvas");
    const ctx = canvas.getContext('2d');

    var g_width = 495;
    var g_height = 495;

    axis = 0;
    slice = range_x.value;
    current_axis=0;
    $.ajax({
        type: "GET",
        data: {x: range_x.value, y: range_y.value, z: range_z.value, axis: 0, draw: 1},
        dataType: 'json',
        success: function (json) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var id = ctx.createImageData(1, 1); // only do this once per page
            var d = id.data;
            var i, j;

            var h_json = Object.keys(json).length;
            var w_json = Object.keys(json[0]).length;

            for (i = 0; i < h_json; i++) {
                for (j = 0; j < w_json; j++) {
                    if (typeof json !='undefined') {
                        var tmp = json[i][j];
                        //if (parseInt(tmp)>=253){tmp=0;}
                        d[3] = 255;//tmp & 0xFF;
                        d[0] = tmp ;//(tmp & 0xFF00) >>> 8;
                        d[1] = tmp ;//(tmp & 0xFF0000) >>> 16;
                        d[2] = tmp ;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                        ctx.putImageData(id, j, i);
                    }
                }
            }
            if (view_areas) {
                ct_annotation_func()
            }
            if (view_predict) {
                ct_predict_func()
            }

            var imageData = ctx.getImageData(0, 0, g_width, g_height);
            var new_canvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            new_canvas.getContext("2d").putImageData(imageData, 0, 0)
            ctx.drawImage(new_canvas, 0, 0)
        },
        error: function (error, txtStatus) {
            console.log(txtStatus);
            console.log('error');
        }
    });
}
function change_slider_y() {
    //alert("change Y");
    var range_x = document.getElementById("myRange1");
    var range_y = document.getElementById("myRange2");
    var range_z = document.getElementById("myRange3");

    canvas = document.querySelector("#glCanvas");
    const ctx = canvas.getContext('2d');

    current_axis=1;
    var g_width = 495;
    var g_height = 495;

    axis = 1;
    slice = range_y.value;
    $.ajax({
        type: "GET",
        data: {x: range_x.value, y: range_y.value, z: range_z.value, axis: 1, draw: 1},
        dataType: 'json',
        success: function (json) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var id = ctx.createImageData(1, 1); // only do this once per page
            var d = id.data;

            var h_json = Object.keys(json).length;
            var w_json = Object.keys(json[0]).length;

            var i, j;
            for (i = 0; i < h_json; i++) {
                for (j = 0; j < w_json; j++) {
                    if (typeof json!='undefined') {
                        var tmp = json[j][i];
                        //if (parseInt(tmp)>=255){tmp=0;}
                        d[3] = 255;//tmp & 0xFF;
                        d[0] = tmp ;//(tmp & 0xFF00) >>> 8;
                        d[1] = tmp ;//(tmp & 0xFF0000) >>> 16;
                        d[2] = tmp ;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                        ctx.putImageData(id,j,i);
                    }
                }
            }
            if (view_areas) {
                ct_annotation_func()
            }
            if (view_predict) {
                ct_predict_func()
            }

            var imageData = ctx.getImageData(0, 0, g_width, g_height);
            var new_canvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            new_canvas.getContext("2d").putImageData(imageData, 0, 0)
            ctx.drawImage(new_canvas, 0, 0)

        }
        ,
        error: function (error, txtStatus) {
            console.log(txtStatus);
            console.log('error');
        }
    });
}
function change_slider_z() {
    //alert("change Z");
    var range_x = document.getElementById("myRange1");
    var range_y = document.getElementById("myRange2");
    var range_z = document.getElementById("myRange3");

    canvas = document.querySelector("#glCanvas");
    const ctx = canvas.getContext('2d');

    current_axis=2;
    var g_width = 495;
    var g_height = 495;

    axis = 2;
    slice = range_z.value;
    $.ajax({
        type: "GET",
        data: {x: range_x.value, y: range_y.value, z: range_z.value, axis: 2, draw: 1},
        dataType: 'json',
        success: function (json) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var id = ctx.createImageData(1, 1); // only do this once per page
            var d = id.data;

            var h_json = Object.keys(json).length;
            var w_json = Object.keys(json[0]).length;

            var i, j;
            for (i = 0; i < h_json; i++) {
                for (j = 0; j < w_json; j++) {
                    if (typeof json!='undefined') {
                        var tmp = json[i][j];
                        //if (parseInt(tmp)>=255){tmp=0;}
                        d[3] = 255;//tmp & 0xFF;
                        d[0] = tmp ;//(tmp & 0xFF00) >>> 8;
                        d[1] = tmp ;//(tmp & 0xFF0000) >>> 16;
                        d[2] = tmp ;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                        ctx.putImageData(id, j, i);
                    }
                }
            }
            if (view_areas) {
                ct_annotation_func();
            }
            if (view_predict) {
                ct_predict_func();
            }

            var imageData = ctx.getImageData(0, 0, g_width, g_height);
            var new_canvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            new_canvas.getContext("2d").putImageData(imageData, 0, 0)
            ctx.drawImage(new_canvas, 0, 0);
        },
        error: function (error, txtStatus) {
            console.log(txtStatus);
            console.log('error');
        }
    });
}

//Write Predicted list to .CSV
function dump_info(){
    //TODO: get info from list element under predicted
    console.log("DUMP CALLED");
    var exdata ={"seriesuid":"1234.1235.1235.1345","coordX":3454, "coordY":456, "coordZ":67,"diameter_mm":5767}
    $.ajax({
          type:"POST",
          data: exdata,
          dataType:'json',
        success:function(){
            alert("data is written in .CSV")
        },
        error: function(error, txtStatus){
          console.log(txtStatus);
          console.log('error');
        }});
}

// Work with image
// Draw areas from lists
function init_gl(canvas){
    const gl = canvas.getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function draw_circle(ctx, x, y, z, r, slice,axis){
    //ctx.strokeStyle="#000000";//"#FF0000";
    //ctx.strokeStyle="#FF0000";
    ctx.lineWidth=1;
    var index;
    for (index=0;index< true_areas.length;++index) {

        x = true_areas[index][1];
        y = true_areas[index][2];
        z = true_areas[index][3];
        r = true_areas[index][4];
        ctx.beginPath();
        var new_rad = calc_new_rad(x, y, z, r, slice, axis);
        //TODO: check coordinates
        if (axis == 0) {
            ctx.arc(y, z, new_rad, 0, Math.PI * 2, true);
        }
        else if (axis == 1) {
            ctx.arc(x, z, new_rad, 0, Math.PI * 2, true);
        }
        else {
            ctx.arc(x, y, new_rad, 0, Math.PI * 2, true);
        }
        ctx.strokeStyle = "rgba(0, 255, 0, 1)";
        //ctx.fill();
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath()
    }
    ctx.closePath();
    if (view_predict) {
        for (index = 0; index < predict_areas.length; ++index) {

            x = predict_areas[index][1];
            y = predict_areas[index][2];
            z = predict_areas[index][3];
            r = predict_areas[index][4];
            ctx.beginPath();

            var new_rad = calc_new_rad(x, y, z, r, slice, axis);
            if (axis == 0) {
                ctx.arc(y, z, new_rad, 0, Math.PI * 2, true);
            }
            else if (axis == 1) {
                ctx.arc(x, z, new_rad, 0, Math.PI * 2, true);
            }
            else {
                ctx.arc(x, y, new_rad, 0, Math.PI * 2, true);
            }
            ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            ctx.lineWidth=0.5;
            //ctx.fill();
            ctx.stroke()
            ctx.closePath()
        }

    }

}
function ct_annotation_func() {
    const canvas = document.querySelector("#glCanvas");
    ctx = canvas.getContext('2d');
    draw_circle(ctx,0,0,0,0,slice,axis,0)
}
function ct_predict_func() {
    const canvas = document.querySelector("#glCanvas");
    ctx = canvas.getContext('2d');
    draw_circle(ctx,0,0,0,0,slice,axis,1)
}
function get_radius(rad, center, coord){// calculations along one axis
    var dist_from_center = Math.abs(center-coord);
    var result =Math.pow(rad,2)-Math.pow(dist_from_center,2);
    if (result<0){
        return 0;
    }
    else
        return Math.sqrt(result);
}
function calc_new_rad( x, y, z, r, slice, axis){// axis{0-x,1-y,2-z}
    var new_rad=0;
    //X
    if (axis==0){new_rad = get_radius(r, x, slice);}
    //Y
    else if (axis==1){new_rad = get_radius(r, y, slice);}
    //Z
    else{new_rad = get_radius(r, z, slice);}
    return new_rad;
}

// Predict areas, update list2
function predict_func(){
    var json ={};
    //var ex1 = {seriesuid : "123.11.11", coordX : 48, coordY : 215, coordZ : 78, diameter_mm : 7};
    var ex2 = {seriesuid : "123.12.12", coordX : 301, coordY : 155, coordZ : 117, diameter_mm : 5};
    json[0]= ex2;
    //json[1]= ex2;

    add_elements(json, "list2");
}
//
function click_on_area(element){

    var x= element.attributes.x.nodeValue;
    var y= element.attributes.y.nodeValue;
    var z= element.attributes.z.nodeValue;
    //var d= element.attributes.d.nodeValue;
    var g_width = 495;
    var g_height = 495;

    canvas = document.querySelector("#glCanvas");
    const ctx = canvas.getContext('2d');

    document.getElementById("myRange1").value=x;
    document.getElementById("myRange2").value=y;
    document.getElementById("myRange3").value=z;
    $('#myRange1').text(x);
    $('#myRange2').text(y);
    $('#myRange3').text(z);
    document.getElementById("myRange1").innerText = x;
    document.getElementById("myRange2").innerText = y;
    document.getElementById("myRange3").innerText = z;

    $()
    $.ajax({
        type: "GET",
        data: {x: x, y: y, z: z, axis: 0, draw: 1},
        dataType: 'json',
        success: function (json) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var id = ctx.createImageData(1, 1); // only do this once per page
            var d = id.data;
            var h_json = Object.keys(json).length;
            var w_json = Object.keys(json[0]).length;
            var i, j;
            for (i = 0; i < h_json; i++) {
                for (j = 0; j < w_json; j++) {
                    var tmp = json[i][j];
                    d[3] = 255;//tmp & 0xFF;
                    d[0] = tmp ;//(tmp & 0xFF00) >>> 8;
                    d[1] = tmp ;//(tmp & 0xFF0000) >>> 16;
                    d[2] = tmp ;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                    ctx.putImageData(id, j, i);
                }
            }
            if (view_areas) {
                ct_annotation_func();
            }
            if (view_predict) {
                ct_predict_func();
            }
            var imageData = ctx.getImageData(0, 0, g_width, g_height);
            var new_canvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            new_canvas.getContext("2d").putImageData(imageData, 0, 0)
            ctx.drawImage(new_canvas, 0, 0)
        },
        error: function (error, txtStatus) {
            console.log(txtStatus);
            console.log('error');
        }
    });
}
function add_elements(json, list_number) {

    clear_list(list_number);
    if (list_number.localeCompare("list1")==0){
        true_areas = new Array(json.length);
    }
    var i=0;
    for (var key in json) {
        //this current dict
        var element = document.createElement("a");
        element.setAttribute("href", "#");
        element.setAttribute("class", "list-group-item");
        element.setAttribute('onclick', 'click_on_area()');
        //var text = "Userid: " + json[key].seriesuid + "\tx:" + json[key].coordX + "\ty:" + json[key].coordY +
        //    "\tz:" + json[key].coordZ + "\td:" + json[key].diameter_mm;

        var text = "x:" + json[key].coordX + "\ty:" + json[key].coordY +
            "\tz:" + json[key].coordZ + "\td:" + json[key].diameter_mm;
        element.innerHTML = text;
        element.setAttribute('x', json[key].coordX );
        element.setAttribute('y', json[key].coordY );
        element.setAttribute('z', json[key].coordZ );
        element.setAttribute('d', json[key].diameter_mm );
        element.onclick=function() {click_on_area(element)};

        //element.onclick = click_on_area(text);
        if (list_number.localeCompare("list1")==0){
            true_areas[i] = new Array(5);
            true_areas[i][0]=json[key].seriesuid;
            true_areas[i][1]=json[key].coordX;
            true_areas[i][2]=json[key].coordY;
            true_areas[i][3]=json[key].coordZ;
            true_areas[i][4]=json[key].diameter_mm;
            i++;
        }
        //var parent =
        var list = document.getElementById(list_number);
        //document.body.insertBefore(element, list);
        list.insertBefore(element, list.childNodes[0]);
    }
}
function clear_list(list_name){
    var node = document.getElementById(list_name);
    while (node.firstChild){
        node.removeChild(node.firstChild);
    }
}
function change_ct_view() {
    //loadImage();
    if (view_areas) {
        view_areas = false;
    }
    else {
        view_areas = true;
    }
    if (current_axis===0){change_slider_x();}
    if (current_axis===1){change_slider_y();}
    if (current_axis===2){change_slider_z();}
}
function change_predic_view(){
    if (view_predict){
        view_predict=false;
    }
    else {
        view_predict=true;
    }
    if (current_axis===0){change_slider_x();}
    if (current_axis===1){change_slider_y();}
    if (current_axis===2){change_slider_z();}
}
function loadImage() {

    $.ajax({
        type: "GET",
        data: {before:1},
        dataType: 'json',
        success: function (json) {
        },
        error: function (error, txtStatus) {
        }
    });
    $.ajaxSetup({
        beforeSend: function (jqXHR, settings) {
            if (settings.dataType === 'binary') {
                settings.xhr().responseType = 'arraybuffer';
                settings.processData = false;
            }
        }
    });
    $.ajax({
        data: {binary:1},
        dataType: "binary",
        success: function (data) {
            var byteArray = new Uint8Array(data);
            console.log(data); //ArrayBuffer
            console.log(new Blob([data])) // Blob
        },
        error: function (error, txtStatus) {
            alert("binary doesn't work")
        }
    });

    $.ajax({
        type: "GET",
        data: {before: 0},
        dataType: 'json',
        success: function (json) {
        },
        error: function (error, txtStatus) {
        }
    });
}