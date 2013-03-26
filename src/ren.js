
$(document).ready(function() {

    var ren_ff_c = new PrairieDrawAnim("ren-ff-c", function(t) {

        var xMax = 3;
        var yMax = 2;

        this.setUnits(2 * xMax, 2 * yMax);

        this.addOption("r", $V([0, 0]));
        this.addOption("v", $V([1, 0]));

        this.addOption("showLabels", true);
        this.addOption("showPath", true);

        var label = this.getOption("showLabels") ? true : undefined;

        var r = this.getOption("r");
        var v = this.getOption("v");
        var f = $V([0, 0]);
        if (this.mouseDown()) {
            var fr = this.mousePositionDw().subtract(r);
            // f = fr.x(1 / Math.pow(fr.modulus(), 2));
            // f = fr;
            f = fr.toUnitVector();
        }

        var dt = this.deltaTime();
        if (dt > 0 && dt < 0.1) {
            r = r.add(v.x(dt / 2));
            v = v.add(f.x(dt / 2));
        }
        var rNew = this.vectorIntervalMod(r, $V([-xMax * 1.1, -yMax * 1.1]), $V([xMax * 1.1, yMax * 1.1]));
        if (rNew.subtract(r).modulus() > 1e-8) {
            this.clearHistory("r");
        }
        r = rNew;

        var maxHistoryTime = 3;
        if (this.getOption("showPath")) {
            var rHistory = this.history("r", 0.05, maxHistoryTime, t, r);
        } else {
            this.clearHistory("r");
        }

        this.setOption("r", r, false);
        this.setOption("v", v, false);

        if (this.getOption("showPath")) {
            this.fadeHistoryLine(rHistory, t, maxHistoryTime, [0, 0, 0], [255, 255, 255]);
        }
        this.save();
        this.setProp("pointRadiusPx", 4);
        this.point(r);
        this.restore();
        this.arrow(r, r.add(v), "velocity");
        if (v.modulus() > 1e-2) {
            this.labelLine(r, r.add(v), $V([1, 0]), label && "TEX:$\\vec{v}$");
        }
        this.arrow(r, r.add(f), "force");
        if (f.modulus() > 1e-2) {
            this.labelLine(r, r.add(f), $V([1, 0]), label && "TEX:$\\vec{F}$");
        }
    });

    ren_ff_c.activateMouseTracking();

}); // end of document.ready()
