#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this fragment shader to implement a toon shading model
// As a starting point, you should copy and paste the shader code from
// phong.frag into this file. You can find it in the GopherGfx library.
// You can then modify it to use the diffuse and specular ramps. 

precision mediump float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

const int MAX_LIGHTS = 8;

uniform vec3 eyePosition;

uniform int numLights;
uniform int lightTypes[MAX_LIGHTS];
uniform vec3 lightPositions[MAX_LIGHTS];
uniform vec3 ambientIntensities[MAX_LIGHTS];
uniform vec3 diffuseIntensities[MAX_LIGHTS];
uniform vec3 specularIntensities[MAX_LIGHTS];

uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

uniform int useTexture;
uniform sampler2D textureImage;

uniform sampler2D diffuseRamp;
uniform sampler2D specularRamp;

in vec3 vertPosition;
in vec3 vertNormal;
in vec4 vertColor;
in vec2 uv;

out vec4 fragColor;

void main() 
{
    // TO BE ADDED
    //fragColor = vec4(0, 0, 0, 1);

    vec3 totalIllumination = vec3(0,0,0);
    for (int i=0; i<numLights; i++) {

        vec3 ambientComponent = kAmbient * ambientIntensities[i];
        
        vec3 l;
        if (lightTypes[i] == POINT_LIGHT) {
            l = normalize(lightPositions[i] - vertPosition.xyz);
        } else {
            l = normalize(lightPositions[i]);
        }


         // Calculate the intensity of the diffuse component
        float nDotL = dot(vertNormal, l);
        // Remap from [-1,1] to [0,1] for texture lookup
        float remappedDiffuse = nDotL * 0.5 + 0.5;
        vec4 diffuseColor = texture(diffuseRamp, vec2(remappedDiffuse, 0.5));

        vec3 diffuseComponent = kDiffuse * diffuseIntensities[i] * diffuseColor.rgb;


        vec3 e = normalize(eyePosition - vertPosition.xyz);
        vec3 r = normalize(reflect(-l, vertNormal));

        // Calculate the normalized intensity for specular lighting
        float specIntensity = pow(max(dot(e, r), 0.0), shininess);
        vec3 specularColor = texture(specularRamp, vec2(specIntensity, 0.5)).rgb;

        vec3 specularComponent = kSpecular * specularIntensities[i] * specularColor;

        totalIllumination += ambientComponent + diffuseComponent + specularComponent;
    }

    // If using a texture, modulate it with the total illumination
    vec3 color = vertColor.rgb;
    if (useTexture == 1) {
        color *= texture(textureImage, uv).rgb;
    }

    // Combine the total illumination with the vertex color
    fragColor = vec4(totalIllumination * color, vertColor.a);

}