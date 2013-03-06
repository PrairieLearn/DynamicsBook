
$(document).ready(function() {

    var rko_fr_c = new PrairieDrawAnim("rko-fr-c", function(t) {

        var figureWidth = 6;

        this.setUnits(figureWidth, 4);

        this.addOption("showLabels", true);
        this.addOption("movement", "smallGround");
        this.addOption("showCVel", false);
        this.addOption("showCAcc", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngAcc", false);
        this.addOption("velField", "none");
        this.addOption("accField", "none");
        this.addOption("showInstRot", false);
        this.addOption("showCPath", false);
        this.addOption("showQPath", false);
        this.addOption("showVelField", false);
        this.addOption("showAccField", false);

        var O = $V([0, 0]);
        var i;

        var label = this.getOption("showLabels") ? true : undefined;

        var f;
        if (this.getOption("movement") === "smallGround") {

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
        } else if (this.getOption("movement") === "bigGround") {

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
                var theta = -2 * Math.sin(t / 2);
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
        } else if (this.getOption("movement") === "2-circle") {

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
        } else if (this.getOption("movement") === "3-circle") {

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
        } else if (this.getOption("movement") === "circle rock") {

            var pathCenter = $V([0, 1.5]);
            var radius = 1;
            var pathRadius = 3;
            var centerRadius = pathRadius - radius;

            this.arcGround(pathCenter, pathRadius, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2);

            f = function(t) {
                var theta = -2 * Math.sin(t / 2);
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius).add(pathCenter),
                    pathStart: 0,
                    pathPeriod: 4 * Math.PI,
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

        var iQShow = 0;

        var Qs = [];
        var nTh, r, th;
        var deltaR = radius / nr;
        for (var ir = 1; ir <= nr; ir++) {
            r = ir / nr * radius;
            nTh = Math.round(2 * Math.PI * r / deltaR);
            for (var iTh = 0; iTh < nTh; iTh++) {
                th = Math.PI / 2 + theta + iTh / nTh * 2 * Math.PI;
                Qs.push(rC.add($V([r * Math.cos(th), r * Math.sin(th)])));
                if (ir < nr) {
                    iQShow++;
                }
            }
        }

        var rCM = this.cross2D(omega, vC).x(1 / (omega * omega));
        var rM = rC.add(rCM);

        var fCQ = function(t) {
            var val = f(t);
            var theta = val.theta;
            var rC = val.rC;
            var e1 = $V([1, 0]).rotate(theta, O);
            var e2 = $V([0, 1]).rotate(theta, O);
            var rQ = rC.add(e2.x(radius));
            return [rC, rQ];
        };

        var nPath = 150;

        var QPath = [], CPath = [];
        for (var i = 0; i < nPath; i++) {
            var tau = i / nPath * pathPeriod + pathStart;
            var rCrQ = fCQ(tau);
            CPath.push(rCrQ[0]);
            QPath.push(rCrQ[1]);
        }

        var rCrQ = this.numDiff(fCQ, t);
        var rC = rCrQ[0];

        if (this.getOption("showCPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
            this.polyLine(CPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showQPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
            this.polyLine(QPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showInstRot")) {
            Qs.forEach(function(Q) {
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 200, 255)");
                this.line(rM, Q);
                this.restore();
            }, this);

            if (this.getOption("velField") === "total") {
                Qs.forEach(function(Q, i) {
                    if (this.getOption("showVelField") || i === iQShow) {
                        var PQ = Q.subtract(rC);
                        var QVR = this.cross2D(omega, PQ);
                        var QV = vC.add(QVR);
                        this.rightAngleImproved(Q, rM, Q.add(QV.x(timeScale)));
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
            this.circleArrow(rC, 0.75, -Math.PI / 2 + theta - 3 * omega / 3.75, -Math.PI / 2 + theta + 3 * omega / 3.75, "angVel");
            this.labelCircleLine(rC, 0.75, -Math.PI / 2 + theta - 3 * omega / 3.75, -Math.PI / 2 + theta + 3 * omega / 3.75, $V([0, 1]), label && omegaLabel);
        }
        if (this.getOption("showAngAcc")) {
            this.circleArrow(rC, 0.75, Math.PI / 2 + theta - 3 * alpha / 3.75, Math.PI / 2 + theta + 3 * alpha / 3.75, "angAcc");
            this.labelCircleLine(rC, 0.75, Math.PI / 2 + theta - 3 * alpha / 3.75, Math.PI / 2 + theta + 3 * alpha / 3.75, $V([0, 1]), label && alphaLabel);
        }

        this.labelIntersection(Qs[iQShow], [rC], label && "TEX:$Q$");

        Qs.forEach(function(Q, i) {
            var rCQ = Q.subtract(rC);
            var vQR = this.cross2D(omega, rCQ);
            var vQ = vC.add(vQR);
            var aQR = this.cross2D(alpha, rCQ);
            var aQC = this.cross2D(omega, vQR);
            var aQ = aC.add(aQR).add(aQC);
            this.point(Q);
            qLabel = (i == iQShow) ? label : undefined;
            if (this.getOption("showVelField") || i === iQShow) {
                if (this.getOption("velField") === "base") {
                    this.arrow(Q, Q.add(vC.x(timeScale)), "velocity");
                    this.labelLine(Q, Q.add(vC.x(timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{v}_C$");
                } else if (this.getOption("velField") === "omega") {
                    this.arrow(Q, Q.add(vQR.x(timeScale)), "velocity");
                    this.labelLine(Q, Q.add(vQR.x(timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{\\omega} \\times \\vec{r}_{CQ}$");
                } else if (this.getOption("velField") === "total") {
                    this.arrow(Q, Q.add(vQ.x(timeScale)), "velocity");
                    this.labelLine(Q, Q.add(vQ.x(timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{v}_Q$");
                }
            }
            if (this.getOption("showAccField") || i === iQShow) {
                if (this.getOption("accField") === "base") {
                    this.arrow(Q, Q.add(aC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(Q, Q.add(aC.x(timeScale * timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{a}_C$");
                } else if (this.getOption("accField") === "alpha") {
                    this.arrow(Q, Q.add(aQR.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(Q, Q.add(aQR.x(timeScale * timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{\\alpha} \\times \\vec{r}_{CQ}$");
                } else if (this.getOption("accField") === "cent") {
                    this.arrow(Q, Q.add(aQC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(Q, Q.add(aQC.x(timeScale * timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{CQ})$");
                } else if (this.getOption("accField") === "total") {
                    this.arrow(Q, Q.add(aQ.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(Q, Q.add(aQ.x(timeScale * timeScale)), $V([1, 0]), qLabel && "TEX:$\\vec{a}_Q$");
                }
            }
        }, this);
    });

}); // end of document.ready()
