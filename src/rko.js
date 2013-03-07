
$(document).ready(function() {

    var rko_fr_c = new PrairieDrawAnim("rko-fr-c", function(t) {

        var figureWidth = 6;

        this.setUnits(figureWidth, 4);

        this.addOption("showLabels", true);
        this.addOption("movement", "smallFlat");
        this.addOption("showCVel", false);
        this.addOption("showCAcc", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngAcc", false);
        this.addOption("velField", "none");
        this.addOption("accField", "none");
        this.addOption("showInstRot", false);
        this.addOption("showCPath", false);
        this.addOption("showPPath", false);
        this.addOption("showVelField", false);
        this.addOption("showAccField", false);

        var O = $V([0, 0]);
        var i;

        var label = this.getOption("showLabels") ? true : undefined;

        var f;
        if (this.getOption("movement") === "smallFlat") {

            this.ground($V([0, -0.6]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 0.6;
                var omega = 0.5;
                var v = radius * omega;
                var rollPeriod = 2 * Math.PI / omega;
                var wavelength = v * rollPeriod;
                var minPathWidth = wavelength + 2 * radius;
                var nPeriod = Math.ceil(minPathWidth / wavelength);
                var pathPeriod = nPeriod * rollPeriod;
                var pathWidth = nPeriod * wavelength;
                return {
                    radius: radius,
                    nr: 3,
                    theta: -omega * t,
                    rC: $V([this.intervalMod(v * t, -pathWidth / 2, pathWidth / 2), 0]),
                    pathStart: -pathPeriod / 2 + 1e-8,
                    pathPeriod: pathPeriod - 2e-8,
                    closePath: false,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "bigFlat") {

            this.ground($V([0, -1.5]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 1.5;
                var omega = 0.5;
                var v = radius * omega;
                var rollPeriod = 2 * Math.PI / omega;
                var wavelength = v * rollPeriod;
                var minPathWidth = figureWidth + 2 * radius;
                var nPeriod = Math.ceil(minPathWidth / wavelength);
                var pathPeriod = nPeriod * rollPeriod;
                var pathWidth = nPeriod * wavelength;
                return {
                    radius: radius,
                    nr: 3,
                    theta: -omega * t,
                    rC: $V([this.intervalMod(v * t, -pathWidth / 2, pathWidth / 2), 0]),
                    pathStart: -pathPeriod / 2 + 1e-8,
                    pathPeriod: pathPeriod - 2e-8,
                    closePath: false,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "rock") {

            this.ground($V([0, -1]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 1;
                var theta = -Math.sin(t);
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([-radius * theta, 0]),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        } else if (this.getOption("movement") === "in-2-circle") {

            var radius = 0.9;
            var pathRadius = 1.8;
            var centerRadius = pathRadius - radius;

            this.arcGround(O, pathRadius);

            f = function(t) {
                var theta = -t / 2;
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "in-3-circle") {

            var radius = 0.6;
            var pathRadius = 1.8;
            var centerRadius = pathRadius - radius;

            this.arcGround(O, pathRadius);

            f = function(t) {
                var theta = -t / 2;
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "in-rock") {

            var pathCenter = $V([0, 1.5]);
            var radius = 1;
            var pathRadius = 3;
            var centerRadius = pathRadius - radius;

            this.arcGround(pathCenter, pathRadius, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2);

            f = function(t) {
                var theta = -Math.sin(t);
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius).add(pathCenter),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        } else if (this.getOption("movement") === "out-1-circle") {

            var radius = 0.6;
            var pathRadius = 0.6;
            var centerRadius = pathRadius + radius;

            this.arcGround(O, pathRadius, undefined, undefined, false);

            f = function(t) {
                var theta = t / 2;
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "out-2-circle") {

            var radius = 0.45;
            var pathRadius = 0.9;
            var centerRadius = pathRadius + radius;

            this.arcGround(O, pathRadius, undefined, undefined, false);

            f = function(t) {
                var theta = t / 2;
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 12 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "out-rock") {

            var pathCenter = $V([0, -4]);
            var radius = 1;
            var pathRadius = 3;
            var centerRadius = pathRadius + radius;

            this.arcGround(pathCenter, pathRadius, Math.PI / 2 - 1.2, Math.PI / 2 + 1.2, false);

            f = function(t) {
                var theta = Math.sin(t);
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius).add(pathCenter),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        }
        f = f.bind(this);

        var val = this.numDiff(f, t);
        var radius = val.radius;
        var nr = val.nr;
        var pathStart = val.pathStart;
        var pathPeriod = val.pathPeriod;
        var closePath = val.closePath;
        var timeScale = val.timeScale;

        var theta = val.theta;
        var omega = val.diff.theta;
        var alpha = val.ddiff.theta;

        var rC = val.rC;
        var vC = val.diff.rC;
        var aC = val.ddiff.rC;

        var e1 = $V([1, 0]).rotate(theta, O);
        var e2 = $V([0, 1]).rotate(theta, O);

        var iPShow = 0;

        var Ps = [];
        var nTh, r, th;
        var deltaR = radius / nr;
        for (var ir = 1; ir <= nr; ir++) {
            r = ir / nr * radius;
            nTh = Math.round(2 * Math.PI * r / deltaR);
            for (var iTh = 0; iTh < nTh; iTh++) {
                th = Math.PI / 2 + theta + iTh / nTh * 2 * Math.PI;
                Ps.push(rC.add($V([r * Math.cos(th), r * Math.sin(th)])));
                if (ir < nr) {
                    iPShow++;
                }
            }
        }

        var rCM = this.cross2D(omega, vC).x(1 / (omega * omega));
        var rM = rC.add(rCM);

        var fCP = function(t) {
            var val = f(t);
            var theta = val.theta;
            var rC = val.rC;
            var e1 = $V([1, 0]).rotate(theta, O);
            var e2 = $V([0, 1]).rotate(theta, O);
            var rP = rC.add(e2.x(radius));
            return [rC, rP];
        };

        var nPath = 150;

        var PPath = [], CPath = [];
        for (var i = 0; i < nPath; i++) {
            var tau = i / nPath * pathPeriod + pathStart;
            var rCrP = fCP(tau);
            CPath.push(rCrP[0]);
            PPath.push(rCrP[1]);
        }

        var rCrP = this.numDiff(fCP, t);
        var rC = rCrP[0];

        if (this.getOption("showCPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
            this.polyLine(CPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showPPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
            this.polyLine(PPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showInstRot")) {
            Ps.forEach(function(P) {
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 200, 255)");
                this.line(rM, P);
                this.restore();
            }, this);

            if (this.getOption("velField") === "total") {
                Ps.forEach(function(P, i) {
                    if (this.getOption("showVelField") || i === iPShow) {
                        var CP = P.subtract(rC);
                        var PVR = this.cross2D(omega, CP);
                        var PV = vC.add(PVR);
                        this.rightAngleImproved(P, rM, P.add(PV.x(timeScale)));
                    }
                }, this);
            }

            this.point(rM);
            this.labelIntersection(rM, [rC], label && "TEX:$M$");
        }

        this.arc(rC, radius);

        this.save();
        this.setProp("pointRadiusPx", 4);
        this.point(rC);
        this.restore();
        this.labelIntersection(rC, [rC.add(e1), rC.add(e2)], label && "TEX:$C$");
        if (this.getOption("showCVel")) {
            this.arrow(rC, rC.add(vC.x(timeScale)), "velocity");
            this.labelLine(rC, rC.add(vC.x(timeScale)), $V([1, 0]), label && "TEX:$\\vec{v}_C$");
        }
        if (this.getOption("showCAcc")) {
            this.arrow(rC, rC.add(aC.x(timeScale * timeScale)), "acceleration");
            this.labelLine(rC, rC.add(aC.x(timeScale * timeScale)), $V([1, 0]), label && "TEX:$\\vec{a}_C$");
        }
        var omegaLabel = (omega >= 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
        var alphaLabel = (alpha >= 0) ? "TEX:$\\alpha$" : "TEX:$-\\alpha$";
        if (this.getOption("showAngVel")) {
            this.circleArrow(rC, radius + 0.15, theta - 3 * omega / 3.75, theta + 3 * omega / 3.75, "angVel", 0.1);
            this.labelCircleLine(rC, radius + 0.15, theta - 3 * omega / 3.75, theta + 3 * omega / 3.75, $V([0, 1]), label && omegaLabel);
        }
        if (this.getOption("showAngAcc")) {
            this.circleArrow(rC, radius + 0.15, Math.PI + theta - 3 * alpha / 3.75, Math.PI + theta + 3 * alpha / 3.75, "angAcc", 0.1);
            this.labelCircleLine(rC, radius + 0.15, Math.PI + theta - 3 * alpha / 3.75, Math.PI + theta + 3 * alpha / 3.75, $V([0, 1]), label && alphaLabel);
        }

        this.labelIntersection(Ps[iPShow], [rC], label && "TEX:$P$");

        Ps.forEach(function(P, i) {
            var rCP = P.subtract(rC);
            var vPR = this.cross2D(omega, rCP);
            var vP = vC.add(vPR);
            var aPR = this.cross2D(alpha, rCP);
            var aPC = this.cross2D(omega, vPR);
            var aP = aC.add(aPR).add(aPC);
            this.point(P);
            pLabel = (i == iPShow) ? label : undefined;
            if (this.getOption("showVelField") || i === iPShow) {
                if (this.getOption("velField") === "base") {
                    this.arrow(P, P.add(vC.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vC.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{v}_C$");
                } else if (this.getOption("velField") === "omega") {
                    this.arrow(P, P.add(vPR.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vPR.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\omega} \\times \\vec{r}_{CP}$");
                } else if (this.getOption("velField") === "total") {
                    this.arrow(P, P.add(vP.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vP.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{v}_P$");
                }
            }
            if (this.getOption("showAccField") || i === iPShow) {
                if (this.getOption("accField") === "base") {
                    this.arrow(P, P.add(aC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aC.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{a}_C$");
                } else if (this.getOption("accField") === "alpha") {
                    this.arrow(P, P.add(aPR.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aPR.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\alpha} \\times \\vec{r}_{CP}$");
                } else if (this.getOption("accField") === "cent") {
                    this.arrow(P, P.add(aPC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aPC.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{CP})$");
                } else if (this.getOption("accField") === "total") {
                    this.arrow(P, P.add(aP.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aP.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{a}_P$");
                }
            }
        }, this);
    });

}); // end of document.ready()
