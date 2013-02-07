
$(document).ready(function() {

    var rkm_fb_c = new PrairieDrawAnim("rkm-fb-c", function(t) {
        this.setUnits(6.6, 4.4);

        this.addOption("showLabels", true);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("showCenter", false);
        this.addOption("showCircle", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngVelDecomp", false);

        var label = this.getOption("showLabels") ? true : undefined;

        var O = $V([0, 0, 0]);
        var rX = $V([1, 0, 0]);
        var rY = $V([0, 1, 0]);
        var rZ = $V([0, 0, 1]);
        var gS = 2; // ground size

        var groundBorder = [$V([-gS, -gS, 0]), $V([-gS, gS, 0]), $V([gS, gS, 0]), $V([gS, -gS, 0])];
        var nGrid = 3;
        for (var i = -nGrid; i <= nGrid; i++) {
            this.line($V([i / nGrid * gS, -gS, 0]), $V([i / nGrid * gS, gS, 0]), "grid");
            this.line($V([-gS, i / nGrid * gS, 0]), $V([gS, i / nGrid * gS, 0]), "grid");
        }
        this.polyLine(groundBorder, true, false);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        var f = function(t) {
            return {
                P: $V([1.8 * Math.cos(t / 2), 1.8 * Math.sin(t / 2), 1 - 0.9 * Math.cos(t)])
            };
        }

        var basis = function(t) {
            var val = this.numDiff(f, t);

            var b = {};
            b.r = val.P;
            b.v = val.diff.P;
            b.a = val.ddiff.P;

            b.et = b.v.toUnitVector();
            b.en = this.orthComp(b.a, b.v).toUnitVector();
            b.eb = b.et.cross(b.en);
            return b;
        }.bind(this);

        var b = this.numDiff(basis, t);
        var r = b.r;
        var v = b.v;
        var a = b.a;
        var et = b.et;
        var en = b.en;
        var eb = b.eb;

        var at = this.orthProj(a, et);
        var an = this.orthProj(a, en);

        var rho = Math.pow(v.modulus(), 2) / an.modulus();
        var kappa = 1 / rho;
        var C = r.add(en.x(rho));

        var ebDot = b.diff.eb;
        var tau = -ebDot.dot(en) / v.modulus();
        var omega = et.x(tau * v.modulus()).add(eb.x(kappa * v.modulus()));
        var omegat = this.orthProj(omega, et);
        var omegab = this.orthProj(omega, eb);

        var path = [];
        var nPoints = 100;
        for (var i = 0; i < nPoints; i++) {
            var tTemp = i / nPoints * 4 * Math.PI;
            path.push(f(tTemp).P);
        }
        this.polyLine(path, true, false);

        this.point(r);
        this.arrow(r, r.add(et));
        this.arrow(r, r.add(en));
        this.arrow(r, r.add(eb));
        this.labelLine(r, r.add(et), $V([1, 0]), label && "TEX:$\\hat{e}_t$");
        this.labelLine(r, r.add(en), $V([1, 0]), label && "TEX:$\\hat{e}_n$");
        this.labelLine(r, r.add(eb), $V([1, 0]), label && "TEX:$\\hat{e}_b$");
        if (this.getOption("showCircle")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 0, 150)");
            this.arc3D(C, rho, eb);
            this.restore();
        }
        if (this.getOption("showCenter")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 0, 150)");
            this.line(C, r);
            this.labelLine(C, r, $V([0, 1]), label && "TEX:$\\rho$");
            this.point(C);
            this.labelIntersection(C, [r], label && "TEX:$C$");
            this.restore();
        }

        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, 1]), label && "TEX:$\\vec{v}$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([0, 1]), label && "TEX:$\\vec{a}$");
        }
        if (this.getOption("showAccDecomp")) {
            this.arrow(r, r.add(at), "acceleration");
            this.arrow(r, r.add(an), "acceleration");
            this.labelLine(r, r.add(at), $V([0, 1]), label && "TEX:$\\vec{a}_t$");
            this.labelLine(r, r.add(an), $V([0, 1]), label && "TEX:$\\vec{a}_n$");
        }
        if (this.getOption("showAngVel")) {
            this.arrow(r, r.add(omega), "angVel");
            this.labelLine(r, r.add(omega), $V([0, 1]), label && "TEX:$\\vec\\omega$");
        }
        if (this.getOption("showAngVelDecomp")) {
            this.arrow(r, r.add(omegat), "angVel");
            this.arrow(r, r.add(omegab), "angVel");
            this.labelLine(r, r.add(omegat), $V([0, 1]), label && "TEX:$\\vec\\omega_t$");
            this.labelLine(r, r.add(omegab), $V([0, 1]), label && "TEX:$\\vec\\omega_b$");
        }
    });

    rkm_fb_c.activate3DControl();

    var rkm_ft_c = new PrairieDrawAnim("rkm-ft-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showPath", false);
        this.addOption("showCenter", false);
        this.addOption("showCircle", false);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("showAngVel", false);
        this.addOption("origin", "O1");

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

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var et = v.toUnitVector();
        var en = this.orthComp(a, v).toUnitVector();

        var vt = this.orthProj(v, et);
        var vn = this.orthProj(v, en);
        var at = this.orthProj(a, et);
        var an = this.orthProj(a, en);

        var label = this.getOption("showLabels") ? true : undefined;

        var rho = Math.pow(v.modulus(), 2) / an.modulus();
        var C = r.add(en.x(rho));

        var kappa = 1 / rho;
        var omega = v.modulus() * kappa;

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
        this.labelIntersection(r, [O, r.add(et), r.add(en)], label && "TEX:$P$");
        if (this.getOption("showCircle")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 0, 150)");
            this.arc(C, rho);
            this.restore();
        }
        if (this.getOption("showCenter")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 0, 150)");
            this.line(C, r);
            this.labelLine(C, r, $V([0, 1]), label && "TEX:$\\rho$");
            this.point(C);
            this.labelIntersection(C, [r], label && "TEX:$C$");
            this.restore();
        }
        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        this.arrow(r, r.add(et));
        this.arrow(r, r.add(en));
        this.labelLine(r, r.add(et), $V([1, 1]), label && "TEX:$\\hat{e}_t$");
        this.labelLine(r, r.add(en), $V([1, 1]), label && "TEX:$\\hat{e}_n$");
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, -1]), label && "TEX:$\\vec{v}$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([1, 0]), label && "TEX:$\\vec{a}$");
        }
        if (this.getOption("showAccDecomp") && at.modulus() > 1e-3) {
            this.arrow(r, r.add(at), "acceleration");
            this.labelLine(r, r.add(at), $V([1, 1]), label && "TEX:$\\vec{a}_t$");
        }
        if (this.getOption("showAccDecomp") && an.modulus() > 1e-3) {
            this.arrow(r, r.add(an), "acceleration");
            this.labelLine(r, r.add(an), $V([1, 1]), label && "TEX:$\\vec{a}_n$");
        }
        if (this.getOption("showAngVel") && Math.abs(omega) > 1e-3) {
            var ebSign = et.to3D().cross(en.to3D()).dot(Vector.k);
            var avOffset = (this.getOption("showPath") || this.getOption("showCircle")) ? Math.PI / 2 : 3 * Math.PI / 4;
            var a0 = this.angleOf(et) - ebSign * omega - ebSign * avOffset;
            var a1 = this.angleOf(et) + ebSign * omega - ebSign * avOffset;
            var omegaLabel = (ebSign > 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
            this.circleArrow(r, 0.6, a0, a1, "angVel");
            this.labelCircleLine(r, 0.6, a0, a1, $V([0, 1]), label && omegaLabel);
        }
    });

    rkm_ft_c.registerOptionCallback("movement", function (value) {
        rkm_ft_c.resetTime(false);
        rkm_ft_c.resetOptionValue("showPath");
        rkm_ft_c.resetOptionValue("showVelocity");
        rkm_ft_c.resetOptionValue("showAcceleration");
        rkm_ft_c.resetOptionValue("showAccDecomp");
        rkm_ft_c.resetOptionValue("showCenter");
        rkm_ft_c.resetOptionValue("showCircle");
    });

    rkm_ft_c.registerOptionCallback("origin", function (value) {
        rkm_ft_c.setOption("showPosition", true);
    });

}); // end of document.ready()
