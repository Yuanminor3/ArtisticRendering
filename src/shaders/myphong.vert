#version 300 es

precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 normalModelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec3 normal;
in vec4 color;
in vec2 texCoord;

out vec3 vertPositionWorld;
out vec3 vertNormalWorld;
out vec4 vertColor;
out vec2 uv;

void main() 
{
    //gl_Position = vec4(0, 0, 0, 1);
    vertPositionWorld = (modelMatrix * vec4(position, 1)).xyz;
    vertNormalWorld = normalize((normalModelMatrix * vec4(normal, 0))).xyz;
    vertColor = color;
    uv = texCoord;
    
    // Required: compute the vertex position in clip coordinates
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}
