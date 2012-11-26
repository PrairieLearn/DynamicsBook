
$(document).ready(function() {

    var rvs_fd_c = new PrairieDrawAnim("rvs-fd-c", function(t) {
	this.setUnits(12, 12);

        this.addOption("r", 4);
        this.addOption("thetaDeg", 45);
        this.addOption("phiDeg", 45);

        this.addOption("showCoords", true);
        this.addOption("showBasis", false);

        this.addOption("showCoordLineR", false);
        this.addOption("showCoordLineTheta", false);
        this.addOption("showCoordLinePhi", false);

        if (this._viewAngleX3D !== undefined) {
            this.rotate3D(this._viewAngleX3D, this._viewAngleY3D, this._viewAngleZ3D);
        }

        var O = $V([0, 0, 0]);
        var rX = $V([5, 0, 0]);
        var rY = $V([0, 5, 0]);
        var rZ = $V([0, 0, 5]);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        this.labelLine(O, rX, $V([1, 1]), "TEX:$x$");
        this.labelLine(O, rY, $V([1, -1]), "TEX:$y$");
        this.labelLine(O, rZ, $V([1, -1]), "TEX:$z$");

        var r = this.getOption("r");
        var theta = this.degToRad(this.getOption("thetaDeg"));
        var phi = this.degToRad(this.getOption("phiDeg"));

        var p = this.sphericalToRect($V([r, theta, phi]));
        var pXY = this.sphericalToRect($V([r, theta, 0]));
        var nXY = pXY.cross(Vector.k);

        if (this.getOption("showCoordLineR")) {
            var pExt = this.sphericalToRect($V([7, theta, phi]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(O, pExt);
            this.restore();
        }

        if (this.getOption("showCoordLineTheta")) {
            var pTheta = $V([0, 0, r * Math.sin(phi)]);
            var rTheta = r * Math.cos(phi);
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(pTheta, rTheta, Vector.k);
            this.restore();
        }

        if (this.getOption("showCoordLinePhi")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(O, r, nXY, Vector.k, -Math.PI, 0);
            this.restore();
        }

        this.arrow(O, p, "position");

        if (this.getOption("showCoords")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(O, pXY);
            if (!(this.getOption("showCoordLineTheta") && phi === 0)) {
                this.circleArrow3D(O, r, Vector.k, Vector.i, 0, theta);
            }
            if (!this.getOption("showCoordLinePhi")) {
                this.circleArrow3D(O, r, nXY, pXY, 0, phi);
            }
            this.labelLine(O, p, $V([0, 1]), "TEX:$r$");
            this.restore();
        }

        if (this.getOption("showBasis")) {
            var eR = this.sphericalToRect($V([1, theta, phi]));
            var eTheta = $V([-Math.sin(theta), Math.cos(theta), 0]);
            var ePhi = $V([-Math.cos(theta) * Math.sin(phi),
                           -Math.sin(theta) * Math.sin(phi),
                           Math.cos(phi)]);
            this.arrow(p, p.add(eR));
            this.arrow(p, p.add(eTheta));
            this.arrow(p, p.add(ePhi));
            this.labelLine(p, p.add(eR), $V([1, 0]), "TEX:$\\hat{e}_r$");
            this.labelLine(p, p.add(eTheta), $V([1, 0]), "TEX:$\\hat{e}_\\theta$");
            this.labelLine(p, p.add(ePhi), $V([1, 0]), "TEX:$\\hat{e}_\\phi$");
        }
    });

    rvs_fd_c.activate3DControl();

}); // end of document.ready()
