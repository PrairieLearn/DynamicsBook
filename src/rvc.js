
$(document).ready(function() {

    var rvc_fd_c = new PrairieDraw("rvc-fd-c", function() {
        this.setUnits(12, 4);

        this.addOption("t", 0);
        this.addOption("showLabels", true);
        this.addOption("showIncrement", false);
        this.addOption("showExactDeriv", false);
        this.addOption("showApproxDeriv", false);
        this.addOption("dt", 2);

        var v_f = function(t) {
            return $V([t, 1 + Math.cos(t)]);
        };
        var dv_f = function(t) {
            return $V([1, - Math.sin(t)]);
        };

        var t = this.getOption("t");
        var dt = this.getOption("dt");
        if (dt === 0) {
            dt = 0.001;
        }

        var O = $V([0, 0]);
        var v = v_f(t);
        var v_next = v_f(t + dt);
        var dv_exact = dv_f(t);
        var dv_approx;
        dv_approx = v_next.subtract(v).x(1 / dt);

        this.translate($V([-5, -1]));

        var s;
        var path = [];
        for (s = 0; s < 12; s += 0.1) {
            path.push(v_f(s));
        }
        this.polyLine(path);

        var side = (this.vec2To3(v_next).cross(this.vec2To3(v)).dot(Vector.k) > 0) ? 1 : -1;

        this.arrow(O, v, "position");
        this.arrow(O, v_next, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, v, $V([0, side]), "TEX:$\\vec{a}(t)$");
            this.labelLine(O, v_next, $V([0, -1.2 * side]), "TEX:$\\vec{a}(t + \\Delta t)$");
        }
        if (this.getOption("showIncrement")) {
            this.arrow(v, v_next, "position");
            if (this.getOption("showLabels")) {
                this.labelLine(v, v_next, $V([0, -side]), "TEX:$\\Delta \\vec{a}$");
            }
        }
        if (this.getOption("showExactDeriv")) {
            this.arrow(v, v.add(dv_exact), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(v, v.add(dv_exact), $V([0, side]), "TEX:$\\dot{\\vec{a}}$");
            }
        }
        if (this.getOption("showApproxDeriv")) {
            this.arrow(v, v.add(dv_approx), "acceleration");
            if (this.getOption("showLabels")) {
            this.labelLine(v, v.add(dv_approx), $V([0, 1.2 * side]), "TEX:$\\Delta \\vec{a} / \\Delta t$");
            }
        }
        
    });

    var rvc_fc_c = new PrairieDraw("rvc-fc-c", function() {
        this.setUnits(12, 4);

        this.addOption("t", 0);
        this.addOption("showLabels", true);
        this.addOption("showComponents", true);

        var v_f = function(t) {
            return $V([t, 1 + Math.cos(t)]);
        };
        var dv_f = function(t) {
            return $V([1, - Math.sin(t)]);
        };

        var t = this.getOption("t");

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var v = v_f(t);
        var dv = dv_f(t);

        var vi = ei.x(ei.dot(v));
        var vj = ej.x(ej.dot(v));
        var dvi = ei.x(ei.dot(dv));
        var dvj = ej.x(ej.dot(dv));

        this.translate($V([-5, -1]));

        var s;
        var path = [];
        for (s = 0; s < 12; s += 0.1) {
            path.push(v_f(s));
        }
        this.polyLine(path);

        this.arrow(O, v, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, v, $V([0, 1]), "TEX:$\\vec{a}(t)$");
        }
        this.arrow(v, v.add(dv), "velocity");
        if (this.getOption("showLabels")) {
            this.labelLine(v, v.add(dv), $V([0, 1]), "TEX:$\\dot{\\vec{a}}$");
        }
        
    });

}); // end of document.ready()
