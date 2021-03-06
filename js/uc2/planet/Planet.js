define(["kick", "./procedural/DiamondSquare", "./procedural/Worley","./procedural/Simplex","./procedural/Cell", "./procedural/BakeColorAndSpecularity", 'text!shaders/planet_composition_vs.glsl', 'text!shaders/planet_composition_fs.glsl',
    'text!shaders/unlit_alpha_vs.glsl', 'text!shaders/unlit_alpha_fs.glsl'],
//define(["kick", 'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, DiamondSquare, Worley, Simplex,Cell, BakeColorAndSpecularity, planet_vs, planet_fs, unlit_planet_vs, unlit_planet_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {

            // heighmapTexture width / height must be power of 2 and square
            var time,
                material,
                thisObj = this,
                planetMeshRenderer,
                config = {},
                heighmapTexture,
                texture,
                rotation = [0,0,0,1],
                rotationSpeed = 1000.01,
                simplex,
                worley,
                diamondSquare,
                cell,
                bakeColorAndSpecularity,

                updateMaterial = function(){
                    if (material){
                        material.setUniform("heightMap", heighmapTexture);
                        material.setUniform("mainTexture", texture);
                        material.setUniform("bumpmapTextureStep",new Float32Array([1/heighmapTexture.dimension[0]]) );
                        material.setUniform("atmosphereColor", config.atmosphereColor || [0.0, 0.0, 0.9, 1.0]);
                        material.setUniform("maxHeight", new Float32Array([config.maxHeight || 2.00]) );
                        material.setUniform("waterLevel", new Float32Array([config.waterLevel || 0.50]) );
                        planetMeshRenderer.material = material;
                    } else {
                        console.log("no mat");
                    }
                    rotationSpeed = config.rotationSpeed/1000 || 0.0001;
                },
                onHeightMapFinish = function(heighmapTexture_){
                    heighmapTexture = heighmapTexture_;
                    bakeColorAndSpecularity.bake(texture, config, heighmapTexture, function(t){
                        texture = t;
                        updateMaterial();
                    });
                };


            this.makePlanetTexture = function () {
                if (config.strategy === "simplex"){
                    simplex.bake(heighmapTexture, config.simplexWorley || {}, onHeightMapFinish);
                } else if (config.strategy === "cell"){
                    cell.bake(heighmapTexture, config.cell || {}, onHeightMapFinish);
                } else if (config.strategy === "worley"){
                    worley.bake(heighmapTexture, config.simplexWorley || {}, onHeightMapFinish);
                } else { // strategy === "DiamondSquare"
                    diamondSquare.bake(heighmapTexture, config.diamondSquare || {iterations:4}, onHeightMapFinish);
                }
            };



            Object.defineProperties(this, {
                config: {
                    set: function (newValue) {
                        config = newValue;
                        rotationSpeed = (config.rotationSpeed || 0) / 1000;
                        if (bakeColorAndSpecularity){
                            thisObj.makePlanetTexture();
                        }
                    }
                }
            });

            this.activated = function(){
                var engine = kick.core.Engine.instance;
                time = engine.time;
                var scene = engine.activeScene;
                var planetGameObject = thisObj.gameObject;

                var maxTextureSize = engine.gl.getParameter(engine.gl.MAX_TEXTURE_SIZE);
                maxTextureSize = Math.min(4096,maxTextureSize);

                simplex = new Simplex(maxTextureSize);
                worley = new Worley(maxTextureSize);
                diamondSquare = new DiamondSquare(maxTextureSize);
                cell = new Cell(maxTextureSize);
                bakeColorAndSpecularity = new BakeColorAndSpecularity(maxTextureSize);

                planetGameObject.addComponent(simplex);
                planetGameObject.addComponent(worley);
                planetGameObject.addComponent(diamondSquare);
                planetGameObject.addComponent(cell);
                planetGameObject.addComponent(bakeColorAndSpecularity);

                planetMeshRenderer = new kick.scene.MeshRenderer();
                var planet_radius = 1;
                var shader = new kick.material.Shader({
                    vertexShaderSrc: planet_vs,
                    fragmentShaderSrc: planet_fs
                });

                material = new kick.material.Material( {
                    shader: shader,
                    uniformData: {
                    }
                });
                thisObj.makePlanetTexture();
                var mesh = new kick.mesh.Mesh(
                    {
                        dataURI: "kickjs://mesh/uvsphere/?slices=100&stacks=200&radius=" + planet_radius,
                        name: "Default object"
                    });
                var meshData = mesh.meshData;
                meshData.recalculateTangents();
                mesh.meshData = meshData;
                planetMeshRenderer.mesh = mesh;

                planetMeshRenderer.material = material;
                planetGameObject.addComponent(planetMeshRenderer);

            };

            this.update = function() {
                if (thisObj.gameObject && thisObj.gameObject.transform){
                    thisObj.gameObject.transform.localRotation = kick.math.Quat.rotateY(rotation,rotation,rotationSpeed*time.deltaTime);
                }
            };
        }
    });