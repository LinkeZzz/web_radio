main();

//
// start here
//
function main() {

  $.ajax('',{
    data:{
      id:'image'
    }
  }).then(
      function success(){alert("Image data successfuly send");},
      function fail(data, status){alert("Request failed. Returned status of"+status);}
  )
  const canvas = document.querySelector("#glCanvas");
  console.log(typeof canvas);
  var image3d = document.querySelector("#imgCT");
  console.log(typeof image3d);
  for (var key in image3d){
    console.log(key);
  }
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
  // set canvas by float 32 arr


  // Set clear color to black, fully opaque
    // Clear the color buffer with specified clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
function draw_image(){

  var vertexShaderSource=`
  attribute vec4_a_position;
  attribute vec4 a_texcoord;
  
  uniform mat4 u_matrix;
  varying vec2 v_texcoord;
  
  void main(){
    gl_Position = u_matrix*a_position;
    }
  `;
  var fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_textcoord;
  
  uniform sampler2D ;
  varying vec2 v_texcoord;
  
  void main(){
    gl_Position = u_matrix*a_position;
    }
  `;

}