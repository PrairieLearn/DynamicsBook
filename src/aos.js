
$(document).ready(function() {

    var aos_fd_c = new PrairieDraw("aos-fd-c", function() {
        this.setUnits(2.5, 2.5);

        this.addOption("showLabels", true);
        this.addOption("showLatLongLines", true);
        this.addOption("showCityGreatCircle", false);
        this.addOption("showCityGreatCircleNormal", false);
        this.addOption("showCityPositionVectors", false);
        this.addOption("showCityLatLong", true);

        this.addOption("sphereTransPerc", 20);
        
        this.addOption("longitudeDeg1", -20);
        this.addOption("latitudeDeg1", 50);
        this.addOption("longitudeDeg2", 55);
        this.addOption("latitudeDeg2", -20);
        
        this.setProp("hiddenLinePattern", "solid");

        var O = $V([0, 0, 0]);
        var rX = $V([1.2, 0, 0]);
        var rY = $V([0, 1.2, 0]);
        var rZ = $V([0, 0, 1.2]);

        var theta1 = this.degToRad(this.getOption("longitudeDeg1"));
        var theta2 = this.degToRad(this.getOption("longitudeDeg2"));
        var phi1 = this.degToRad(this.getOption("latitudeDeg1"));
        var phi2 = this.degToRad(this.getOption("latitudeDeg2"));

        var p1 = this.sphericalToRect($V([1, theta1, phi1]));
        var p2 = this.sphericalToRect($V([1, theta2, phi2]));
        var p12norm = p1.cross(p2);

        var cityRadiusPx = 6;
        var cityColor1 = "rgb(255, 0, 0)";
        var cityColor2 = "rgb(0, 0, 255)";
        var greatCircleWidthPx = 4;
        var greatCircleColor = "rgb(0, 255, 0)";

        /***********************************************************/
        // back lines

        // cities
        var p1Vw = this.posDwToVw(p1);
        var p2Vw = this.posDwToVw(p2);
        var p1Back = (p1Vw.e(3) < 0);
        var p2Back = (p2Vw.e(3) < 0);
        if (p1Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor1);
            this.point(p1);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p1, $V([1.2, -1.2]), "TEX:$A$");
            }
        }
        if (p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p2, $V([-1.2, -1.2]), "TEX:$B$");
            }
        }

        // great circle between cities
        if (this.getOption("showCityGreatCircle") && p12norm.modulus() > 1e-10) {
            this.save();
            this.setProp("hiddenLineWidthPx", greatCircleWidthPx);
            this.setProp("hiddenLineColor", greatCircleColor);
            this.sphereSlice(O, 1, p12norm, 0, true, false);
            this.restore();
        }

        // city lat/long
        if (this.getOption("showCityLatLong")) {
            this.save();
            this.setProp("hiddenLineWidthPx", greatCircleWidthPx);
            this.setProp("hiddenLineColor", cityColor1);
            if (theta1 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, true, false, Vector.i, 0, theta1);
            }
            if (phi1 !== 0) {
                var norm = $V([Math.sin(theta1), -Math.cos(theta1), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false, p1, -phi1, 0);
            }
            this.setProp("hiddenLineColor", cityColor2);
            if (theta2 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, true, false, Vector.i, 0, theta2);
            }
            if (phi2 !== 0) {
                var norm = $V([Math.sin(theta2), -Math.cos(theta2), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false, p2, -phi2, 0);
            }
            this.restore();
        }

        var rXS = $V([1, 0, 0]);
        var rYS = $V([0, 1, 0]);
        var rZS = $V([0, 0, 1]);
        var rXVw = this.posDwToVw(rX);
        var rYVw = this.posDwToVw(rY);
        var rZVw = this.posDwToVw(rZ);
        var rXBack = (rXVw.e(3) < 0);
        var rYBack = (rYVw.e(3) < 0);
        var rZBack = (rZVw.e(3) < 0);
        if (rXBack) {
            this.arrow(O, rX);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            }
        } else {
            this.line(O, rXS);
        }
        if (rYBack) {
            this.arrow(O, rY);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rY, $V([1, -1]), "TEX:$y$");
            }
        } else {
            this.line(O, rYS);
        }
        if (rZBack) {
            this.arrow(O, rZ);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rZ, $V([1, -1]), "TEX:$z$");
            }
        } else {
            this.line(O, rZS);
        }
        if (this.getOption("showLabels")) {
            this.labelIntersection(O, [rX, rY, rZ], "TEX:$O$");
        }

        var i, norm, theta;
        var n_lat = 2;
        var n_long = 4;
        if (this.getOption("showLatLongLines")) {
            for (i = 0; i < n_long; i++) {
                theta = i / n_long * Math.PI;
                norm = $V([-Math.sin(theta), Math.cos(theta), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false);
            }
            for (i = -n_lat; i <= n_lat; i++) {
                this.sphereSlice(O, 1, Vector.k, Math.sin(i * Math.PI / (2 * n_lat + 2)), true, false);
            }
        }

        // city position vectors
        if (this.getOption("showCityPositionVectors")) {
            this.save();
            this.setProp("arrowLineWidthPx", greatCircleWidthPx);
            this.arrow(O, p1, cityColor1);
            this.arrow(O, p2, cityColor2);
            this.restore();
        }

        /***********************************************************/
        // sphere with alpha

        this.save();
        var sphereAlpha = 1 - this.getOption("sphereTransPerc") / 100;
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + sphereAlpha + ")");
        this.sphere(O, 1, true);
        this.restore();

        /***********************************************************/
        // front lines

        if (!rXBack) {
            this.arrow(rXS, rX);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            }
        }
        if (!rYBack) {
            this.arrow(rYS, rY);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rY, $V([1, -1]), "TEX:$y$");
            }
        }
        if (!rZBack) {
            this.arrow(rZS, rZ);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rZ, $V([1, -1]), "TEX:$z$");
            }
        }

        if (this.getOption("showLatLongLines")) {
            for (i = 0; i < n_long; i++) {
                theta = i / n_long * Math.PI;
                norm = $V([-Math.sin(theta), Math.cos(theta), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true);
            }
            for (i = -n_lat; i <= n_lat; i++) {
                this.sphereSlice(O, 1, Vector.k, Math.sin(i * Math.PI / (2 * n_lat + 2)), false, true);
            }
        }

        // city lat/long
        if (this.getOption("showCityLatLong")) {
            this.save();
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.setProp("shapeOutlineColor", cityColor1);
            if (theta1 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, false, true, Vector.i, 0, theta1);
            }
            if (phi1 !== 0) {
                var norm = $V([Math.sin(theta1), -Math.cos(theta1), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true, p1, -phi1, 0);
            }
            this.setProp("shapeOutlineColor", cityColor2);
            if (theta2 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, false, true, Vector.i, 0, theta2);
            }
            if (phi2 !== 0) {
                var norm = $V([Math.sin(theta2), -Math.cos(theta2), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true, p2, -phi2, 0);
            }
            this.restore();
        }

        // great circle between cities
        if (this.getOption("showCityGreatCircle") && p12norm.modulus() > 1e-10) {
            this.save();
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.setProp("shapeOutlineColor", greatCircleColor)
            this.sphereSlice(O, 1, p12norm, 0, false, true);
            this.restore();
        }

        // cities
        if (!p1Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor1);
            this.point(p1);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p1, $V([1.2, -1.2]), "TEX:$A$");
            }
        }
        if (!p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p2, $V([-1.2, -1.2]), "TEX:$B$");
            }
        }
    });

    aos_fd_c.activate3DControl();

    var aos_fm_c = new PrairieDraw("aos-fm-c", function() {
        this.setUnits(360, 180);

        this.save();
        var i;
        this.setProp("shapeStrokeWidthPx", 1);
        for (i = 0; i < world_coastline.length; i++) {
            this.polyLine(this.pairsToVectors(world_coastline[i]));
        }
        this.restore();

        var aLat = 40.109665; // Urbana
        var aLong = -88.204247;
        var bLat = 28.61; // Delhi
        var bLong = 77.23;

        var greatCircleWidthPx = 4;
        var greatCircleColor = "rgb(0, 255, 0)";
        var cityRadiusPx = 6;
        var cityColor1 = "rgb(255, 0, 0)";
        var cityColor2 = "rgb(0, 0, 255)";

        var aV = this.sphericalToRect($V([1, this.degToRad(aLong), this.degToRad(aLat)]));
        var bV = this.sphericalToRect($V([1, this.degToRad(bLong), this.degToRad(bLat)]));

        var p = [];
        var n = 100;
        var alpha, v, vS;
        for (i = 0; i <= n; i++) {
            alpha = i / n;
            v = aV.x(1 - alpha).add(bV.x(alpha));
            vS = this.rectToSpherical(v);
            p.push($V([this.radToDeg(vS.e(2)), this.radToDeg(vS.e(3))]));
        }

        this.save();
        this.setProp("shapeOutlineColor", greatCircleColor);
        this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
        this.polyLine(p);
        this.restore();

        this.save();
        this.setProp("pointRadiusPx", cityRadiusPx);
        this.setProp("shapeOutlineColor", cityColor1);
        this.point($V([aLong, aLat]));
        this.setProp("shapeOutlineColor", cityColor2);
        this.point($V([bLong, bLat]));
        this.restore();
    });

}); // end of document.ready()
