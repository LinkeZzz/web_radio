main();

function main() {

  console.log("logging works!");
  const canvas = document.querySelector("#glCanvas");
  //TODO:
  var c_W=550;
  var c_H=550;
  canvas.width  = c_W;
  canvas.height = c_H;
  //init_gl(canvas);

  const ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Sliders Action
  var range_x = document.getElementById("myRange1");
  var range_y = document.getElementById("myRange2");
  var range_z = document.getElementById("myRange3");

  var g_width=512;
  var g_height=512;

  range_x.onchange=function(){
    $.ajax({
        type:"GET",
        data:{x: range_x.value, y: range_y.value, z: range_z.value, axis:0},
        dataType:'json',
        success:function(json){
            var id = ctx.createImageData(1,1); // only do this once per page
            var d  = id.data;
            var i,j;
            //TODO:
            for(i=0;i<g_height;i++){
                for(j=0;j<g_width;j++){
                    var tmp = json[i][j];
                    d[3]   = 255;//tmp & 0xFF;
                    d[0]   = tmp;//(tmp & 0xFF00) >>> 8;
                    d[1]   = tmp;//(tmp & 0xFF0000) >>> 16;
                    d[2]   = tmp;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                    ctx.putImageData( id, i, j );
                }
            }
        },
        error: function(error, txtStatus){
          console.log(txtStatus);
          console.log('error');
        }});
  };
  range_y.onchange=function(){
      $.ajax({
        type:"GET",
        data:{x: range_x.value, y: range_y.value, z: range_z.value, axis:1},
        dataType:'json',
        success:function(json){
            var id = ctx.createImageData(1,1); // only do this once per page
            var d  = id.data;
            var i,j;
            //TODO:
            for(i=0;i<g_height;i++){
                for(j=0;j<g_width;j++){
                    var tmp = json[i][j];
                    d[3]   = 255;//tmp & 0xFF;
                    d[0]   = tmp;//(tmp & 0xFF00) >>> 8;
                    d[1]   = tmp;//(tmp & 0xFF0000) >>> 16;
                    d[2]   = tmp;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                    ctx.putImageData( id, i, j );
                }
            }
        },
        error: function(error, txtStatus){
          console.log(txtStatus);
          console.log('error');
        }});
  };
  range_z.onchange= function(){
      $.ajax({
        type:"GET",
        data:{x: range_x.value, y: range_y.value, z: range_z.value, axis:2},
        dataType:'json',
        success:function(json){
            var id = ctx.createImageData(1,1); // only do this once per page
            var d  = id.data;
            var i,j;
            //TODO:
            for(i=0;i<g_height;i++){
                for(j=0;j<g_width;j++){
                    var tmp = json[i][j];
                    d[3]   = 255;//tmp & 0xFF;
                    d[0]   = tmp;//(tmp & 0xFF00) >>> 8;
                    d[1]   = tmp;//(tmp & 0xFF0000) >>> 16;
                    d[2]   = tmp;//(tmp & 0xFF000000) >>> 24; // <<24-alpha <<16 blue <<8 green red
                    ctx.putImageData( id, i, j );
                }
            }
        },
        error: function(error, txtStatus){
          console.log(txtStatus);
          console.log('error');
        }});
  }
}

function init_gl(canvas){
    const gl = canvas.getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function predictFunction(){
    draw_circle(170,170,30);
}
function draw_circle(x, y, r){
    const canvas = document.querySelector("#glCanvas");
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle="#FF0000";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(x,y,r,0, Math.PI*2, true);
    ctx.stroke();
}

function draw_retangle(){

}
function dump(){
    console.log("DUMP CALLED");

}