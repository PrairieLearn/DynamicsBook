
$(document).ready(function() {

    var rkg_fw_c = new PrairieDrawAnim("rkg-fw-c", function(t) {
        this.setUnits(3, 3 / this.goldenRatio);

        this.addOption("showAngles", false);
        this.addOption("showAngVels", false);

        this.translate($V([-1.2, -0.7]));

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.text(O, $V([1, 1]), "TEX:$O$");
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat{\\imath}$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat{\\jmath}$");

        var omega1 = 0.4;
        var omega2 = 0.2;

        var theta1 = omega1 * t;
        var theta2 = omega2 * t;

        var rP1 = $V([0.7, 0.7]);
        var rP1Q1rel = $V([-0.35, -0.2]);
        var rQ1 = rP1.add(rP1Q1rel.rotate(theta1, $V([0, 0])));

        var rP2 = $V([2, 0.7 + 0.3 * Math.sin(t)]);
        var rP2Q2rel = $V([-0.2, 0]);
        var rQ2 = rP2.add(rP2Q2rel.rotate(theta2, $V([0, 0])));
        var rP2Q3rel = $V([0.2, 0]);
        var rQ3 = rP2.add(rP2Q3rel.rotate(theta2, $V([0, 0])));

        var ra = 0.15;
        var rc = 0.15;
        var rw = 0.32;

        var drawAxes = function(p, theta, label) {
            this.save();
            this.translate(p);
            this.save();
            this.rotate(theta);
            this.polyLine([ei.x(ra), O, ej.x(ra)]);
            this.restore();
            if (this.getOption("showAngles")) {
                this.save();
                this.setProp("shapeStrokePattern", "dashed");
                this.line(O, ei.x(2 * ra));
                this.restore();
                var modTheta = this.fixedMod(theta, 2 * Math.PI);
                this.circleArrow(O, rc, 0, modTheta, "angle", true);
                this.labelCircleLine(O, rc, 0, modTheta, $V([0, 1]), label, true);
            }
            this.restore();
        }.bind(this);

        var drawOmega = function(p, theta, omega, label) {
            this.save();
            this.translate(p);
            var a1 = theta + Math.PI / 2 - 3 * omega;
            var a2 = theta + Math.PI / 2 + 3 * omega;
            this.circleArrow(O, rw, a1, a2, "angVel", true);
            this.labelCircleLine(O, rw, a1, a2, $V([0, 1]), label, true);
            this.restore();
        }.bind(this);

        this.save();
        this.translate(rP1);
        this.rotate(theta1);
        this.rectangle(0.8, 0.8 / this.goldenRatio);
        this.text($V([0.33, -0.18]), $V([0, 0]), "TEX:$\\mathcal{B}_1$");
        this.restore();

        this.save();
        this.translate(rP2);
        this.rotate(theta2);
        this.rectangle(0.8, 0.8 / this.goldenRatio);
        this.text($V([0.33, -0.18]), $V([0, 0]), "TEX:$\\mathcal{B}_2$");
        this.restore();

        drawAxes(rP1, theta1, "TEX:$\\theta_1$");
        drawAxes(rQ1, theta1, "TEX:$\\theta_1$");
        drawAxes(rQ2, theta2, "TEX:$\\theta_2$");
        drawAxes(rQ3, theta2, "TEX:$\\theta_2$");

        if (this.getOption("showAngVels")) {
            drawOmega(rP1, theta1, omega1, "TEX:$\\omega_1$");
            drawOmega(rP2, theta2, omega2, "TEX:$\\omega_2$");
        }
    });

    var rkg_fr_c = new PrairieDraw("rkg-fr-c", function() {
        this.setUnits(3, 3 / this.goldenRatio);

        this.addOption("showType", "none");

        this.translate($V([-1.2, -0.7]));

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var rP = $V([1.5, 0.4]);
        var rQ = $V([1.7, 1.2]);
        var vP = $V([0.3, -0.2]);
        var omega = 0.8;
        var rPQ = rQ.subtract(rP);
        var vQRel = this.perp(rPQ).x(omega);
        var vQ = vP.add(vQRel);
        var alpha = 1.1;
        var aP = $V([0.6, 0.2]);
        var aQAlpha = this.perp(rPQ).x(alpha);
        var aQCent = rPQ.x(-omega * omega);
        var aQ = aP.add(aQAlpha).add(aQCent);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.text(O, $V([1, 1]), "TEX:$O$");
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat{\\imath}$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat{\\jmath}$");

        this.save();
        this.translate($V([1.6, 0.8]));
        this.rotate(0.7);
        this.rectangle(1.2, 1.2 / this.goldenRatio);
        this.restore();

        this.point(rP);
        this.point(rQ);
        this.text(rP, $V([0, 1.2]), "TEX:$P$");
        this.text(rQ, $V([-1.2, 0]), "TEX:$Q$");

        if (this.getOption("showType") === "position") {
            this.arrow(O, rP, "position");
            this.arrow(O, rQ, "position");
            this.labelLine(O, rP, $V([0, -1.1]), "TEX:$\\vec{r}_P$");
            this.labelLine(O, rQ, $V([0, 1.1]), "TEX:$\\vec{r}_Q$");

            this.arrow(rP, rQ);
            this.labelLine(rP, rQ, $V([0, -1.1]), "TEX:$\\vec{r}_{PQ}$");
        }

        if (this.getOption("showType") === "velocity") {
            this.arrowFrom(rP, vP, "velocity");
            this.arrowFrom(rQ, vQ, "velocity");
            this.labelLine(rP, rP.add(vP), $V([1, 0]), "TEX:$\\vec{v}_P$");
            this.labelLine(rQ, rQ.add(vQ), $V([1, 0]), "TEX:$\\vec{v}_Q$");

            this.arrowFrom(rQ, vQRel);
            this.labelLine(rQ, rQ.add(vQRel), $V([1, 0]), "TEX:$\\vec{\\omega} \\times \\vec{r}_{PQ}$");
        }

        if (this.getOption("showType") === "velocity"
            || this.getOption("showType") === "acceleration") {
            var omegaRad = 0.2;
            this.circleArrow(rP, omegaRad, Math.PI / 2 - omega, Math.PI / 2 + omega, "angVel", true);
            this.labelCircleLine(rP, omegaRad, Math.PI / 2 - omega, Math.PI / 2 + omega, $V([0, -1]),
                                 "TEX:$\\vec{\\omega}$", true);
        }

        if (this.getOption("showType") === "acceleration") {
            var alphaRad = 0.25;
            this.circleArrow(rP, alphaRad, Math.PI / 2 - alpha, Math.PI / 2 + alpha, "angAcc", true);
            this.labelCircleLine(rP, alphaRad, Math.PI / 2 - alpha, Math.PI / 2 + alpha, $V([0, 1]),
                                 "TEX:$\\vec{\\alpha}$", true);

            this.arrowFrom(rQ, aQAlpha);
            this.labelLine(rQ, rQ.add(aQAlpha), $V([0, -1.1]), "TEX:$\\vec{\\alpha} \\times \\vec{r}_{PQ}$");

            this.arrowFrom(rQ, aQCent);
            this.labelLine(rQ, rQ.add(aQCent), $V([0, 1.1]), "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{PQ})$");

            this.arrowFrom(rP, aP, "acceleration");
            this.arrowFrom(rQ, aQ, "acceleration");
            this.labelLine(rP, rP.add(aP), $V([1, 0]), "TEX:$\\vec{a}_P$");
            this.labelLine(rQ, rQ.add(aQ), $V([1, 0]), "TEX:$\\vec{a}_Q$");
        }
        
    });

    var rkg_xp_c = new PrairieDraw("rkg-xp-c", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var P = $V([-0.8, -0.8]);
        var Q = P.add($V([2, 0]).rotate(0.5, $V([0, 0])));
        var h = 1;
        var d = this.perp(Q.subtract(P)).toUnitVector().x(h);
        var Pd = P.add(d);
        var Qd = Q.add(d);

        this.groundHashed(P, $V([0, 1]), 6);

        this.rectangleGeneric(P, Q, h);

        this.point(P);
        this.text(P, $V([-0.3, -1.4]), "TEX:$P$");

        this.point(Q);
        this.text(Q, $V([-1, 0]), "TEX:$Q$");

        this.labelLine(Pd, Qd, $V([0, 1.2]), "TEX:$2\\rm\\ m$");
        this.labelLine(Qd, Q, $V([0, 1.2]), "TEX:$1\\rm\\ m$");
    });

}); // end of document.ready()
