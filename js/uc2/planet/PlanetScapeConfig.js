define(["kick", 'uc2/util/Random'],
    function (kick, Random) {
        "use strict";

        /**
         * Configuration class for a planet scape
         */
        return function () {
            var thisObj = this,
                randomFloat = Random.randomFloat,
                randomInt = Random.randomInt;

            this.sun = {
                lightDirection: [1, 1, 1],
                ambientColor: [0.1, 0.1, 0.1],
                showLightDirection: debug
            };

            this.planet = {
                rotationSpeed: 0.05,
                color: [1.0, 1.0, 1.0, 1.0],
                maxHeight: 2.000,
                showTexture: false,
                iterations: 10
            };

            this.atmosphere = {
                color: [0.0, 0.0, 1.0, 1.0],
                size: 0.3
            };

            this.moons = {
                numberOfMoons: 3,
                colorFrom: [1.0, 1.0, 1.0, 1.0],
                colorTo: [1.0, 1.0, 1.0, 1.0],
                heightFrom: 2.000,
                heightTo: 2.000,
                sizeFrom:  0.01,
                sizeTo: 0.1,
                iterationsFrom: 2,
                iterationsTo: 10
            };

            this.createRandom = function () {
                // planet
                thisObj.planet.rotationSpeed = [randomFloat(0, 1, 2), randomFloat(0, 1, 2), randomFloat(0, 1, 0.5), randomFloat(0.0, 0.5, 0.5)];
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.maxHeight = randomFloat(0, 5);
                thisObj.planet.iterations = randomInt(5, 10);

                // atmosphere
                // makes blue more likely
                thisObj.atmosphere.color = [randomFloat(0, 1, 2), randomFloat(0, 1, 2), randomFloat(0, 1, 0.5), randomFloat(0.0, 0.5, 0.5)];
                thisObj.atmosphere.size = randomFloat(0.005, 0.3);

                // moon
                thisObj.moons.numberOfMoons = randomInt(0, 100, 2);
                thisObj.moons.colorFrom = [randomFloat(0, 0.1), randomFloat(0, 0.1), randomFloat(0, 0.1), 1];
                thisObj.moons.colorTo = [thisObj.moon.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1), 1];
                thisObj.moons.heightFrom =  randomFloat(1.1, 1.5);
                thisObj.moons.heightTo =  randomFloat(1.5, 2.5);
                thisObj.moons.sizeFrom =  randomFloat(0.01, 0.05);
                thisObj.moons.sizeTo =  randomFloat(0.05, 0.1);
                thisObj.moons.iterationsFrom = randomInt(0, 5);
                thisObj.moons.iterationsTo = randomInt(5, 10);
            };
        };
    });
