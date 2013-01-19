
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
        this.setUnits(12, 8);

        this.addOption("t", 0);
        this.addOption("showLabels", true);
        this.addOption("showComponent1", false);
        this.addOption("showComponent2", false);
        this.addOption("showVelocity", false);
        this.addOption("basis", "ij");

        var v_f = function(t) {
            return $V([5 * Math.sin(Math.PI * t / 10), 1.5 * Math.cos(Math.PI * 3 * t / 10)]);
        };
        var dv_f = function(t) {
            return $V([5 * Math.PI / 10 * Math.cos(Math.PI * t / 10), - 4.5 / 10 * Math.PI * Math.sin(Math.PI * 3 * t / 10)]);
        };

        var t = this.getOption("t");

        var O = $V([0, 0]);
        if (this.getOption("basis") === "ij") {
            var e1 = $V([1, 0]);
            var e2 = $V([0, 1]);
        } else {
            var e1 = $V([1, 0]).rotate(Math.PI / 6, O);
            var e2 = $V([0, 1]).rotate(Math.PI / 6, O);
        }

        var v = v_f(t);
        var dv = dv_f(t);

        // add fuzzing to avoid exact zeros
        var v1c = e1.dot(v) + 1e-6
        var v2c = e2.dot(v) + 1e-6
        var v1 = e1.x(v1c);
        var v2 = e2.x(v2c);
        var dv1c = e1.dot(dv) + 1e-6;
        var dv2c = e2.dot(dv) + 1e-6;
        var dv1 = e1.x(dv1c);
        var dv2 = e2.x(dv2c);

        var t_max = 10;

        var i, s;
        var path = [], path_v1 = [], path_v2 = [], path_dv1 = [], path_dv2 = [];
        var n = Math.round(t_max / 0.1);
        for (i = 0; i <= n; i++) {
            s = i / n * t_max;
            var v_s = v_f(s);
            var dv_s = dv_f(s);
            path.push(v_s);
            path_v1.push($V([s, e1.dot(v_s)]));
            path_v2.push($V([s, e2.dot(v_s)]));
            path_dv1.push($V([s, e1.dot(dv_s)]));
            path_dv2.push($V([s, e2.dot(dv_s)]));
        }

        var labelA = "TEX:$\\vec{a}$";
        var labelDotA = "TEX:$\\dot{\\vec{a}}$";
        var labelE1, labelE2, labelA1c, labelA2c, labelDotA1c, labelDotA2c, labelA1, labelA2, labelDotA1, labelDotA2;
        if (this.getOption("basis") === "ij") {
            labelE1 = "TEX:$\\hat\\imath$";
            labelE2 = "TEX:$\\hat\\jmath$";
            labelA1c = "TEX:$a_i$";
            labelA2c = "TEX:$a_j$";
            labelDotA1c = "TEX:$\\dot{a}_i$";
            labelDotA2c = "TEX:$\\dot{a}_j$";
            labelA1 = "TEX:$a_i\\hat\\imath$";
            labelA2 = "TEX:$a_j\\hat\\jmath$";
            labelDotA1 = "TEX:$\\dot{a}_i\\hat\\imath$";
            labelDotA2 = "TEX:$\\dot{a}_j\\hat\\jmath$";
        } else {
            labelE1 = "TEX:$\\hat{u}$";
            labelE2 = "TEX:$\\hat{v}$";
            labelA1c = "TEX:$a_u$";
            labelA2c = "TEX:$a_v$";
            labelDotA1c = "TEX:$\\dot{a}_u$";
            labelDotA2c = "TEX:$\\dot{a}_v$";
            labelA1 = "TEX:$a_u\\hat{u}$";
            labelA2 = "TEX:$a_v\\hat{v}$";
            labelDotA1 = "TEX:$\\dot{a}_u\\hat{u}$";
            labelDotA2 = "TEX:$\\dot{a}_v\\hat{v}$";
        }
        if (!this.getOption("showLabels")) {
            labelA = undefined;
            labelDotA = undefined;
            labelA1 = undefined;
            labelA2 = undefined;
            labelDotA1 = undefined;
            labelDotA2 = undefined;
        }

        var axSizeDw = $V([5, 3]);
        var axPOriginData = $V([0, -4]);
        var axPSizeData = $V([t_max * 1.1, 10]);
        var axVOriginData = $V([0, -2]);
        var axVSizeData = $V([t_max * 1.1, 5]);

        this.save();
        this.translate($V([-5.3, -3.5]));
        if (this.getOption("showComponent1")) {
            this.plot(path_v1, O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", true, false, undefined, undefined, {"horizAxisPos": 0});
            this.plot([$V([t, v1c])], O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", false, true, labelA1c, $V([1, 1]));
            if (this.getOption("showVelocity")) {
                this.plot(path_dv1, O, axSizeDw, axVOriginData, axVSizeData, undefined, undefined, "velocity", false, false);
                this.plot([$V([t, dv1c])], O, axSizeDw, axVOriginData, axVSizeData, undefined, undefined, "velocity", false, true, labelDotA1c, $V([-1, -1]));
            }
        } else {
            this.plot([], O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", true, false, undefined, undefined, {"horizAxisPos": 0});
        }
        this.restore();

        this.save();
        this.translate($V([0.5, -3.5]));
        if (this.getOption("showComponent2")) {
            this.plot(path_v2, O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", true, false, undefined, undefined, {"horizAxisPos": 0});
            this.plot([$V([t, v2c])], O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", false, true, labelA2c, $V([-1, -1]));
            if (this.getOption("showVelocity")) {
                this.plot(path_dv2, O, axSizeDw, axVOriginData, axVSizeData, undefined, undefined, "velocity", false, false);
                this.plot([$V([t, dv2c])], O, axSizeDw, axVOriginData, axVSizeData, undefined, undefined, "velocity", false, true, labelDotA2c, $V([1, 1]));
            }
        } else {
            this.plot([], O, axSizeDw, axPOriginData, axPSizeData, "TEX:$t$", undefined, "position", true, false, undefined, undefined, {"horizAxisPos": 0});
        }
        this.restore();

        var v_offset = 0.1;

        this.save();
        this.translate($V([-1.5, 1.5]));
        this.polyLine(path);
        this.arrow(O, v, "position");
        this.labelLine(O, v, $V([-1, 0]), labelA);
        if (this.getOption("showComponent1")) {
            this.arrow(v2, v, "position");
            this.labelLine(v2, v, $V([0, 1]), labelA1);
        }
        if (this.getOption("showComponent2")) {
            this.arrow(v1, v, "position");
            this.labelLine(v1, v, $V([0, 1]), labelA2);
        }
        if (this.getOption("showVelocity")) {
            this.arrow(v, v.add(dv), "velocity");
            this.labelLine(v, v.add(dv), $V([1, 0]), labelDotA);
            if (this.getOption("showComponent1")) {
                this.arrow(v, v.add(dv1), "velocity");
                this.labelLine(v, v.add(dv1), $V([0, 1]), labelDotA1);
            }
            if (this.getOption("showComponent2")) {
                this.arrow(v, v.add(dv2), "velocity");
                this.labelLine(v, v.add(dv2), $V([0, 1]), labelDotA2);
            }
        }
        this.restore();

        this.save();
        this.translate($V([-4.5, 1.5]));
        this.arrow(O, e1);
        this.arrow(O, e2);
        this.labelLine(O, e1, $V([1, -1]), labelE1);
        this.labelLine(O, e2, $V([1, 1]), labelE2);
        this.restore();
    });

}); // end of document.ready()
