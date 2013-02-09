
$(document).ready(function() {

    var rkm_ft_c = new PrairieDrawAnim("rkm-ft-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showPath", true);
        this.addOption("showBasisAtOrigin", false);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showVelDecomp", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("origin", "O1");
        this.addOption("basis", "rect");

        var f;
        if (this.getOption("movement") === "arc") {
            f = function(t) {
                t = -t;
                t += 5;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2 - 0.5 * Math.cos(0.5 * t) - 0.5 * Math.cos(t), Math.PI / 2 + 2.5 * Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "circle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, 0.5 * t]))
                };
            };
        } else if (this.getOption("movement") === "varCircle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, -0.5 * t + 0.2 * Math.sin(t)]))
                };
            };
        } else if (this.getOption("movement") === "ellipse") {
            f = function(t) {
                t += 3;
                return {
                    "period": 2 * Math.PI / 0.7,
                    "P": $V([Math.cos(0.7 * t), 3 * Math.sin(0.7 * t)])
                };
            };
        } else if (this.getOption("movement") === "trefoil") {
            f = function(t) {
                t += 4;
                return {
                    "period": 2 * Math.PI / 0.4,
                    "P": $V([Math.cos(0.4 * t) - 2 * Math.cos(2 * 0.4 * t), Math.sin(0.4 * t) + 2 * Math.sin(2 * 0.4 * t)])
                };
            };
        } else if (this.getOption("movement") === "eight") {
            f = function(t) {
                t += 2.5 * Math.PI;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3 * Math.cos(0.5 * t), Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "comet") {
            f = function(t) {
                t += 1;
                var T = 2 * Math.PI / 0.7; // period
                var a = 2; // semi-major axis
                var e = 0.5; // eccentricity
                var b = a * Math.sqrt(1 - e*e); // semi-minor axis
                var M = 2 * Math.PI * t / T; // mean anomaly
                var E = M; // eccentric anomaly
                // solve M = E - e * sin(E) for E with Newton's method
                for (var i = 0; i < 5; i++) {
                    E = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
                }
                return {
                "period": T,
                "P": $V([a * (Math.cos(E) - e), b * Math.sin(E)])
            };};
        } else if (this.getOption("movement") === "pendulum") {
            f = function(t) {
                t -= 1.5;
                return {
                    "period": 2 * Math.PI / 0.6,
                    "P": this.polarToRect($V([2.5, -Math.PI / 2 + Math.cos(0.6 * t)]))
                };
            };
        }
        f = f.bind(this);

        var O1 = $V([0, 0]);
        var O2 = $V([-3, -2]);

        var O;
        if (this.getOption("origin") === "O1") {
            O = O1;
        } else {
            O = O2;
        }

        var val = this.numDiff(f, t);
        var period = val.period;
        var r = val.P;
        var v = val.diff.P;
        var a = val.ddiff.P;

        var et = v.toUnitVector();
        var en = this.orthComp(a, v).toUnitVector();

        var es = [], eLabels, rLabels, vLabels, aLabels;
        if (this.getOption("basis") === "rect") {
            es = [$V([1, 0]), $V([0, 1])];
            eLabels = ["TEX:$\\hat\\imath$", "TEX:$\\hat\\jmath$"];
            rLabels = ["TEX:$\\vec{r}_x$", "TEX:$\\vec{r}_y$"];
            vLabels = ["TEX:$\\vec{v}_x$", "TEX:$\\vec{v}_y$"];
            aLabels = ["TEX:$\\vec{a}_x$", "TEX:$\\vec{a}_y$"];
        } else if (this.getOption("basis") === "polar") {
            es[0] = r.subtract(O).toUnitVector();
            es[1] = es[0].rotate(Math.PI / 2, $V([0, 0]));
            eLabels = ["TEX:$\\hat{e}_r$", "TEX:$\\hat{e}_\\theta$"];
            rLabels = ["TEX:$\\vec{r}_r$", "TEX:$\\vec{r}_\\theta$"];
            vLabels = ["TEX:$\\vec{v}_r$", "TEX:$\\vec{v}_\\theta$"];
            aLabels = ["TEX:$\\vec{a}_r$", "TEX:$\\vec{a}_\\theta$"];
        } else if (this.getOption("basis") === "tangNorm") {
            es = [et, en];
            eLabels = ["TEX:$\\hat{e}_t$", "TEX:$\\hat{e}_n$"];
            rLabels = ["TEX:$\\vec{r}_t$", "TEX:$\\vec{r}_n$"];
            vLabels = ["TEX:$\\vec{v}_t$", "TEX:$\\vec{v}_n$"];
            aLabels = ["TEX:$\\vec{a}_t$", "TEX:$\\vec{a}_n$"];
        }

        var rc = [], vc = [], ac = [];
        for (var i = 0; i < 2; i++) {
            rc[i] = this.orthProj(r, es[i]);
            vc[i] = this.orthProj(v, es[i]);
            ac[i] = this.orthProj(a, es[i]);
        }

        var label = this.getOption("showLabels") ? true : undefined;

        if (this.getOption("showPath")) {
            var n = 200;
            var path = [], s;
            for (var i = 0; i < n; i++) {
                s = i / n * period;
                path.push(f(s).P);
            }
            this.polyLine(path, true, false);
        }
        this.point(O1);
        this.text(O1, $V([1, 1]), label && "TEX:$O_1$");
        this.point(O2);
        this.text(O2, $V([1, 1]), label && "TEX:$O_2$");
        this.point(r);
        var others = [O, r.add(es[0]), r.add(es[1])];
        if (this.getOption("showPosition")) {
            others.push(O);
        }
        if (this.getOption("showPath")) {
            others.push(r.add(et));
            others.push(r.add(et.x(-1)));
        }
        this.labelIntersection(r, others, label && "TEX:$P$");
        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        for (var i = 0; i < 2; i++) {
            this.arrow(r, r.add(es[i]));
            this.labelLine(r, r.add(es[i]), $V([1, -1]), label && eLabels[i]);
        }
        if (this.getOption("showBasisAtOrigin")) {
            this.arrow(O, O.add(es[0]));
            this.arrow(O, O.add(es[1]));
            this.labelLine(O, O.add(es[0]), $V([1, -1]), label && eLabels[0]);
            this.labelLine(O, O.add(es[1]), $V([1, 1]), label && eLabels[1]);
        }
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, -1]), label && "TEX:$\\vec{v}$");
        }
        for (var i = 0; i < 2; i++) {
            if (this.getOption("showVelDecomp") && vc[i].modulus() > 1e-3) {
                this.arrow(r, r.add(vc[i]), "velocity");
                this.labelLine(r, r.add(vc[i]), $V([1, 1]), label && vLabels[i]);
            }
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([1, 0]), label && "TEX:$\\vec{a}$");
        }
        for (var i = 0; i < 2; i++) {
            if (this.getOption("showAccDecomp") && ac[i].modulus() > 1e-3) {
                this.arrow(r, r.add(ac[i]), "acceleration");
                this.labelLine(r, r.add(ac[i]), $V([1, 1]), label && aLabels[i]);
            }
        }
    });

    var rkm_fb_c = new PrairieDrawAnim("rkm-fb-c", function(t) {
        this.setUnits(6.6, 4.4);

        this.addOption("showLabels", true);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showVelDecomp", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("origin", "O1");
        this.addOption("basis", "rect");
        this.addOption("showBasisAtOrigin", false);
        this.addOption("showPath", true);
        this.addOption("movement", "saddle");

        var label = this.getOption("showLabels") ? true : undefined;

        var O = $V([0, 0, 0]);
        var rX = $V([2/3, 0, 0]);
        var rY = $V([0, 2/3, 0]);
        var rZ = $V([0, 0, 2/3]);
        var gS = 2; // ground size

        var O1 = $V([0, 0, 0]);
        var O2 = $V([4/3, -4/3, 0]);
        var O;
        if (this.getOption("origin") === "O1") {
            O = O1;
        } else {
            O = O2;
        }

        var f;
        if (this.getOption("movement") === "saddle") {
            f = function(t) {
                return {
                    P: $V([1.8 * Math.cos(t / 2), 1.8 * Math.sin(t / 2), 1 - 0.9 * Math.cos(t)])
                };
            }
        } else if (this.getOption("movement") === "viviani") {
            f = function(t) {
                return {
                    P: $V([0.9 * Math.sin(t), 1.8 * Math.sin(t / 2), 1 + 0.9 * Math.cos(t)])
                };
            }
        } else if (this.getOption("movement") === "eight") {
            f = function(t) {
                var tau = t / 2 + 0.9 * Math.sin(t / 2);
                return {
                    P: this.cylindricalToRect($V([1.8 * Math.cos(tau), -Math.sin(tau) + Math.PI / 2, 1 - 0.9 * Math.sin(tau)]))
                };
            }
        } else if (this.getOption("movement") === "clover") {
            f = function(t) {
                return {
                    P: this.cylindricalToRect($V([1.8 * Math.cos(t), t / 2 + Math.PI / 4, 1 - 0.9 * Math.sin(t)]))
                };
            }
        } else if (this.getOption("movement") === "inflection") {
            f = function(t) {
                return {
                    P: $V([Math.sin(3 * t / 2), Math.sin(t), 1 - Math.sin(t / 2)])
                };
            }
        } else if (this.getOption("movement") === "deltoid") {
            f = function(t) {
                var r = 0.6;
                return {
                    P: $V([
                        -r * (2 * Math.sin(t / 2) - Math.sin(t)),
                        r * (2 * Math.cos(t / 2) + Math.cos(t)),
                        1 + 0.9 * 4/5 * (Math.cos(t / 2) + Math.sin(t / 2) * Math.sin(3 * t / 2) / 3)
                    ])
                };
            }
        } else if (this.getOption("movement") === "cusp") {
            f = function(t) {
                var r = 0.7;
                return {
                    P: $V([
                        r * (1.5 * Math.sin(t) - Math.sin(1.5 * t)),
                        r * (1.5 * Math.cos(t) + Math.cos(1.5 * t)),
                        1 + 0.9 * 4/5 * (Math.cos(t / 2) + Math.sin(t / 2) * Math.sin(2.5 * t) / 5)
                    ])
                };
            }
        }
        f = f.bind(this);

        var val = this.numDiff(f, t);
        var P = val.P;
        var r = val.P.subtract(O);
        var v = val.diff.P;
        var a = val.ddiff.P;

        var es = [], eLabels, rLabels, vLabels, aLabels;
        if (this.getOption("basis") === "rect") {
            es = [$V([1, 0, 0]), $V([0, 1, 0]), $V([0, 0, 1])];
            eLabels = ["TEX:$\\hat\\imath$", "TEX:$\\hat\\jmath$", "TEX:$\\hat{k}$"];
            rLabels = ["TEX:$\\vec{r}_x$", "TEX:$\\vec{r}_y$", "TEX:$\\vec{r}_z$"];
            vLabels = ["TEX:$\\vec{v}_x$", "TEX:$\\vec{v}_y$", "TEX:$\\vec{v}_z$"];
            aLabels = ["TEX:$\\vec{a}_x$", "TEX:$\\vec{a}_y$", "TEX:$\\vec{a}_z$"];
        } else if (this.getOption("basis") === "cylindrical") {
            var rC = this.rectToCylindrical(r);
            var theta = rC.e(2);
            es[0] = this.cylindricalToRect($V([1, theta, 0]));
            es[1] = $V([-Math.sin(theta), Math.cos(theta), 0]);
            es[2] = $V([0, 0, 1]);
            eLabels = ["TEX:$\\hat{e}_r$", "TEX:$\\hat{e}_\\theta$", "TEX:$\\hat{e}_z$"];
            rLabels = ["TEX:$\\vec{r}_r$", "TEX:$\\vec{r}_\\theta$", "TEX:$\\vec{r}_z$"];
            vLabels = ["TEX:$\\vec{v}_r$", "TEX:$\\vec{v}_\\theta$", "TEX:$\\vec{v}_z$"];
            aLabels = ["TEX:$\\vec{a}_r$", "TEX:$\\vec{a}_\\theta$", "TEX:$\\vec{a}_z$"];
        } else if (this.getOption("basis") === "spherical") {
            var rS = this.rectToSpherical(r);
            es = this.sphericalBasis(rS);
            eLabels = ["TEX:$\\hat{e}_r$", "TEX:$\\hat{e}_\\theta$", "TEX:$\\hat{e}_\\phi$"];
            rLabels = ["TEX:$\\vec{r}_r$", "TEX:$\\vec{r}_\\theta$", "TEX:$\\vec{r}_\\phi$"];
            vLabels = ["TEX:$\\vec{v}_r$", "TEX:$\\vec{v}_\\theta$", "TEX:$\\vec{v}_\\phi$"];
            aLabels = ["TEX:$\\vec{a}_r$", "TEX:$\\vec{a}_\\theta$", "TEX:$\\vec{a}_\\phi$"];
        } else if (this.getOption("basis") === "tangNorm") {
            es[0] = v.toUnitVector();
            es[1] = this.orthComp(a, v).toUnitVector();
            es[2] = es[0].cross(es[1]);
            eLabels = ["TEX:$\\hat{e}_t$", "TEX:$\\hat{e}_n$", "TEX:$\\hat{e}_b$"];
            rLabels = ["TEX:$\\vec{r}_t$", "TEX:$\\vec{r}_n$", "TEX:$\\vec{r}_b$"];
            vLabels = ["TEX:$\\vec{v}_t$", "TEX:$\\vec{v}_n$", "TEX:$\\vec{v}_b$"];
            aLabels = ["TEX:$\\vec{a}_t$", "TEX:$\\vec{a}_n$", "TEX:$\\vec{a}_b$"];
        }

        var rc = [], vc = [], ac = [];
        for (var i = 0; i < 3; i++) {
            rc[i] = this.orthProj(r, es[i]);
            vc[i] = this.orthProj(v, es[i]);
            ac[i] = this.orthProj(a, es[i]);
        }

        if (this.getOption("showBasisAtOrigin")) {
            for (var i = 0; i < 3; i++) {
                if (es[i].e(3) < 0) {
                    this.arrow(O, O.add(es[i]));
                    this.labelLine(O, O.add(es[i]), $V([1, 0]), label && eLabels[i]);
                }
            }
        }

        var groundBorder = [$V([-gS, -gS, 0]), $V([-gS, gS, 0]), $V([gS, gS, 0]), $V([gS, -gS, 0])];
        var groundAlpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + groundAlpha + ")");
        this.polyLine(groundBorder, true, true);
        this.restore();
        var nGrid = 3;
        for (var i = -nGrid; i <= nGrid; i++) {
            this.line($V([i / nGrid * gS, -gS, 0]), $V([i / nGrid * gS, gS, 0]), "grid");
            this.line($V([-gS, i / nGrid * gS, 0]), $V([gS, i / nGrid * gS, 0]), "grid");
        }
        this.polyLine(groundBorder, true, false);
        this.arrow(O1, rX);
        this.arrow(O1, rY);
        this.arrow(O1, rZ);
        this.labelLine(O1, rX, $V([1, -1]), label && "TEX:$x$");
        this.labelLine(O1, rY, $V([1, 1]), label && "TEX:$y$");
        this.labelLine(O1, rZ, $V([1, 1]), label && "TEX:$z$");

        this.point(O1);
        this.labelIntersection(O1, [O1.add(rX), O1.add(rY), O1.add(rZ)], label && "TEX:$O_1$");
        this.point(O2);
        this.text(O2, $V([1, 1]), label && "TEX:$O_2$");

        if (this.getOption("showPath")) {
            var path = [];
            var nPoints = 200;
            for (var i = 0; i < nPoints; i++) {
                var tTemp = i / nPoints * 4 * Math.PI;
                path.push(f(tTemp).P);
            }
            this.polyLine(path, true, false);
        }

        if (this.getOption("showBasisAtOrigin")) {
            for (var i = 0; i < 3; i++) {
                if (es[i].e(3) >= 0) {
                    this.arrow(O, O.add(es[i]));
                    this.labelLine(O, O.add(es[i]), $V([1, 0]), label && eLabels[i]);
                }
            }
        }
        this.point(P);
        for (var i = 0; i < 3; i++) {
            this.arrow(P, P.add(es[i]));
            this.labelLine(P, P.add(es[i]), $V([1, 0]), label && eLabels[i]);
        }
        if (this.getOption("showPosition")) {
            this.arrow(O, P, "position");
            this.labelLine(O, P, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        if (this.getOption("showVelocity")) {
            this.arrow(P, P.add(v), "velocity");
            this.labelLine(P, P.add(v), $V([0, -1]), label && "TEX:$\\vec{v}$");
        }
        for (var i = 0; i < 3; i++) {
            if (this.getOption("showVelDecomp") && vc[i].modulus() > 1e-3) {
                this.arrow(P, P.add(vc[i]), "velocity");
                this.labelLine(P, P.add(vc[i]), $V([1, 1]), label && vLabels[i]);
            }
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(P, P.add(a), "acceleration");
            this.labelLine(P, P.add(a), $V([1, 0]), label && "TEX:$\\vec{a}$");
        }
        for (var i = 0; i < 3; i++) {
            if (this.getOption("showAccDecomp") && ac[i].modulus() > 1e-3) {
                this.arrow(P, P.add(ac[i]), "acceleration");
                this.labelLine(P, P.add(ac[i]), $V([1, 1]), label && aLabels[i]);
            }
        }
    });

    rkm_fb_c.activate3DControl();

}); // end of document.ready()
