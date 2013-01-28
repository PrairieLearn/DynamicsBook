
$(document).ready(function() {

    var rkt_ft_c = new PrairieDrawAnim("rkt-ft-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showPath", false);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
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

    });

    rkt_ft_c.registerOptionCallback("movement", function (value) {
        rkt_ft_c.resetTime(false);
        rkt_ft_c.resetOptionValue("showPath");
        rkt_ft_c.resetOptionValue("showVelocity");
        rkt_ft_c.resetOptionValue("showAcceleration");
        rkt_ft_c.resetOptionValue("showAccDecomp");
    });

    rkt_ft_c.registerOptionCallback("origin", function (value) {
        rkt_ft_c.setOption("showPosition", true);
    });

}); // end of document.ready()
