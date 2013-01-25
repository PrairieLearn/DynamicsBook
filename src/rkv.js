
$(document).ready(function() {

    var rkv_fp_c = new PrairieDrawAnim("rkv-fp-c", function(t) {
        this.setUnits(8, 4);

        var O = $V([0, 0]);
        var P = $V([3, 2.5]).add($V([2 * Math.sin(t - 0.7), 0.5 * Math.cos(t - 0.7)]));
        var Q = $V([5, 0.6]).add($V([1.4 * Math.cos(0.7 * t), 0.5 * Math.cos(0.7 * 2 * t)]));

        var e1 = $V([1, 0]);
        var e2 = $V([0, 1]);

        this.translate($V([-3.5, -1.5]));

        this.arrow(O, O.add(e1));
        this.arrow(O, O.add(e2));
        this.labelLine(O, O.add(e1), $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, O.add(e2), $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.text(O, $V([0.5, 1]), "TEX:$O$");

        this.arrow(O, P, "position");
        this.point(P);
        this.text(P, $V([-1, -1]), "TEX:$P$");

        this.arrow(O, Q, "position");
        this.point(Q);
        this.text(Q, $V([-1, 1]), "TEX:$Q$");

        this.arrow(P, Q, "position");
        this.labelLine(O, P, $V([0, 1]), "TEX:$\\vec{r}_{P}$");
        this.labelLine(O, Q, $V([0, -1]), "TEX:$\\vec{r}_{Q}$");
        this.labelLine(P, Q, $V([0, 1]), "TEX:$\\vec{r}_{PQ}$");
    });

    var rkv_fo_c = new PrairieDrawAnim("rkv-fo-c", function(t) {
        this.setUnits(8, 8);

        this.addOption("movementType", "point");

        var O1, O2, P;

        if (this.getOption("movementType") === "point") {
            O1 = $V([-3, 2]);
            O2 = $V([2, -3]);
            P = $V([2.8 * Math.cos(t + Math.PI / 2), 1.8 * Math.sin(2 * t + Math.PI)]);
        } else {
            // "coordinates"
            O1 = $V([-1 - 2 * Math.cos(t), 2 + 0.5 * Math.sin(t)]);
            O2 = $V([2 + 2 * (Math.cos(t - Math.PI / 4) - Math.cos(Math.PI / 4)), -2 + Math.sin(2 * t - Math.PI / 2)]);
            P = $V([0, 0]);
        }

        var x = P.e(1) - O1.e(1);
        var y = P.e(2) - O1.e(2);
        var pc = this.rectToPolar(P.subtract(O2));
        var r = pc.e(1);
        var theta = pc.e(2);

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.arrow(O1, O1.add(ei));
        this.arrow(O1, O1.add(ej));
        this.labelLine(O1, O1.add(ei), $V([1, -1]), "TEX:$x$");
        this.labelLine(O1, O1.add(ej), $V([1, 1]), "TEX:$y$");
        this.text(O1, $V([0.5, 1]), "TEX:$O_1$");

        this.arrow(O2, O2.add(ei));
        this.arrow(O2, O2.add(ej));
        this.text(O2, $V([0.5, 1]), "TEX:$O_2$");

        this.save();
        this.setProp("shapeOutlineColor", "green");
        var Px = O1.add($V([x, 0]));
        this.line(O1, Px);
        this.line(Px, P);
        this._ctx.font = "14px sans-serif";
        this.labelLine(O1, Px, $V([0, 1]), "x = " + x.toFixed(1), $V([0, -1]));
        this.labelLine(Px, P, $V([0, 1]), "y = " + y.toFixed(1), $V([-1.8, 0]));
        this.restore();

        this.save();
        this.setProp("shapeOutlineColor", "blue");
        this.line(O2, P);
        this.arc(O2, 0.6, 0, theta);
        this._ctx.font = "14px sans-serif";
        this.labelLine(O2, P, $V([0, 1]), "r = " + r.toFixed(1));
        this.labelCircleLine(O2, 0.6, 0, theta, $V([0, 1]), "θ = " + theta.toFixed(1));
        this.restore();

        this.save();
        this.setProp("shapeOutlineColor", "red");
        this.setProp("pointRadiusPx", 4);
        this.point(P);
        this.text(P, $V([1.2, 1.2]), "TEX:$P$");
        this.restore();
    });

}); // end of document.ready()
