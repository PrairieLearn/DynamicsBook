
$(document).ready(function() {

    var aos_fd_c = new PrairieDraw("aos-fd-c", function() {
        this.setUnits(2.5, 2.5);

        this.addOption("showLabels", true);
        this.addOption("showLatLongLines", true);
        this.addOption("showCityGreatCircle", true);
        this.addOption("showCityPositionVectors", true);
        
        this.addOption("latitudeDeg1", 0);
        this.addOption("longitudeDeg1", 0);
        this.addOption("latitudeDeg2", 0);
        this.addOption("longitudeDeg2", 45);

        this.setProp("hiddenLinePattern", "solid");
        //this.setProp("hiddenLineColor", "rgb(220, 220, 220)");

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
        }
        if (p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
        }

        // great circle between cities
        if (this.getOption("showCityGreatCircle") && p12norm.modulus() > 1e-10) {
            this.save();
            this.setProp("hiddenLineWidthPx", greatCircleWidthPx);
            this.setProp("hiddenLineColor", greatCircleColor);
            this.sphereSlice(O, 1, p12norm, 0, true, false);
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

        var i, norm, theta;
        var n_lat = 2;
        var n_long = 8;
        if (this.getOption("showLatLongLines")) {
            for (i = 0; i < n_long; i++) {
                theta = i / n_long * 2 * Math.PI;
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
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.8)");
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
                theta = i / n_long * 2 * Math.PI;
                norm = $V([-Math.sin(theta), Math.cos(theta), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true);
            }
            for (i = -n_lat; i <= n_lat; i++) {
                this.sphereSlice(O, 1, Vector.k, Math.sin(i * Math.PI / (2 * n_lat + 2)), false, true);
            }
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
        }
        if (!p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
        }
    });

    aos_fd_c.activate3DControl();

}); // end of document.ready()
