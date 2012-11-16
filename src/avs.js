
$(document).ready(function() {

    var f1car = {
        width: 2, // m
        length: 4, // m
        wheelWidth: 0.4, // m
        wheelLength: 1, // m
        wheelOffset: 0.3, // m
        trackRodOffset: 0.6, // m
        connectWidth: 0.2, // m
        connectExtension: 0.1, // m
    };

    f1car.drawFrontWheel = function(pd, trackRodShorten) {
        var theta = Math.atan2(trackRodShorten, this.trackRodOffset);
        var d = this.connectWidth/2 / Math.tan((Math.PI/2 + theta)/2);
        var p = $V([trackRodShorten, -this.trackRodOffset]);
        var pe = p.toUnitVector().x(p.modulus() + this.connectExtension);
        var v = p.rotate(Math.PI/2, $V([0,0])).toUnitVector();
        var points = [
            $V([-this.wheelOffset, this.connectWidth/2]),
            $V([d, this.connectWidth/2]),
            pe.add(v.x(this.connectWidth/2)),
            pe.add(v.x(-this.connectWidth/2)),
            $V([-d, -this.connectWidth/2]),
            $V([-this.wheelOffset, -this.connectWidth/2])
            ];
        pd.polyLine(points, true);
        pd.point($V([0, 0]));
        pd.point(p);
        pd.save();
        pd.translate($V([-this.wheelOffset - this.wheelWidth/2, 0]));
        pd.rectangle(this.wheelWidth, this.wheelLength);
        pd.restore();
    };

    f1car.findAngles = function(pd, w, a, h, d) {
        var cosMaxAngle = (w * w + h * h - a * a) / (2 * w * h);
        var maxD = a + h * cosMaxAngle / 2 - w / 2;
        if (Math.abs(d) >= maxD) {
            return [NaN, NaN];
        }

        // bisection method
        var alpha0 = 0;
        var alpha1 = Math.PI;
        var i, alpha, beta, dTest;
        for (i = 0; i < 10; i++) {
            // 10 iterations starting from pi, so tolerance of pi/1024
            alpha = (alpha0 + alpha1) / 2;
            beta = pd.solveFourBar(w, h, a, a, alpha, false);
            dTest = (a * Math.cos(alpha) + a * Math.cos(beta)) / 2;
            if (dTest - d > 0) {
                alpha0 = alpha;
            } else {
                alpha1 = alpha;
            }
        }
        alpha = (alpha0 + alpha1) / 2;
        beta = pd.solveFourBar(w, h, a, a, alpha, false);
        return [alpha, Math.PI - beta];
    };

    f1car.findRadii = function(pd, w, l, a, d, trackRodShorten, alpha1, alpha2) {
        var r1, r2;
        var trackRodAngle = Math.asin(trackRodShorten / a);
        if (d === 0) {
            r1 = -Infinity;
            r2 = Infinity;
        } else {
            var theta1 = alpha1 + trackRodAngle - Math.PI / 2;
            var theta2 = -alpha2 - trackRodAngle + Math.PI / 2;
            if (d > 0) {
                theta1 = Math.min(theta1, 0);
                theta2 = Math.min(theta2, 0);
            } else {
                theta1 = Math.max(theta1, 0);
                theta2 = Math.max(theta2, 0);
            }
            r1 = -w / 2 + l / Math.tan(theta1);
            r2 = w / 2 + l / Math.tan(theta2);
        }
        return [r1, r2]
    };

    f1car.draw = function(pd, trackRodShorten, rackOffset, showRadii, showArmLines, showLabels) {
        var t = $V([trackRodShorten, this.trackRodOffset])
        var theta = Math.PI/2 - pd.angleOf(t);
        var a = t.modulus();
        var h = this.width - 2 * trackRodShorten;
        var angles = this.findAngles(pd, this.width, a, h, rackOffset);
        var alpha1 = angles[0];
        var alpha2 = angles[1];
        var frontLeft = $V([-this.width/2, this.length/2]);
        var frontRight = $V([this.width/2, this.length/2]);
        var p1 = frontLeft.add($V([a, 0]).rotate(-alpha1, $V([0, 0])));
        var p2 = frontRight.add($V([-a, 0]).rotate(alpha2, $V([0, 0])));

        // front wheels
        pd.rectangle(this.width, this.length);
        pd.save();
        pd.translate(frontLeft);
        pd.rotate(Math.PI/2 - alpha1 - theta);
        this.drawFrontWheel(pd, trackRodShorten);
        pd.restore();
        pd.save();
        pd.translate(frontRight);
        pd.scale($V([-1, 1]));
        pd.rotate(Math.PI/2 - alpha2 - theta);
        this.drawFrontWheel(pd, trackRodShorten);
        pd.restore();
        pd.line(p1, p2);
        var mid = p1.add(p2).x(0.5);
        pd.point(mid);
        var arrowY = frontLeft.e(2) - this.trackRodOffset - 0.1;
        pd.arrow($V([0, arrowY]), $V([mid.e(1), arrowY]), 'position');
        if (showLabels) {
            pd.text($V([mid.e(1) / 2, arrowY]), $V([0, 1]), "TEX:$d$");
            pd.text(frontLeft, $V([0, -2]), "TEX:$A$");
            pd.text(frontRight, $V([0, -2]), "TEX:$B$");
            pd.text(p2, $V([1, 1.5]), "TEX:$C$");
            pd.text(p1, $V([-1, 1.5]), "TEX:$D$");
        }

        // rear wheels
        pd.save();
        pd.translate($V([0, -this.length/2]));
        var d = -this.width/2 - this.wheelOffset - this.wheelWidth/2;
        pd.rectangle(2 * d, this.connectWidth);
        pd.point($V([-this.width/2, 0]));
        pd.point($V([this.width/2, 0]));
        pd.save();
        pd.translate($V([-d, 0]));
        pd.rectangle(this.wheelWidth, this.wheelLength);
        pd.restore();
        pd.save();
        pd.translate($V([d, 0]));
        pd.rectangle(this.wheelWidth, this.wheelLength);
        pd.restore();
        pd.restore();

        // radii
        var rVec = this.findRadii(pd, this.width, this.length, a, rackOffset, trackRodShorten, alpha1, alpha2);
        var r1 = rVec[0];
        var r2 = rVec[1];
        if (showRadii) {
            pd.save();
            pd.setProp("shapeStrokePattern", "dashed");
            pd.setProp("shapeOutlineColor", "blue");
            if (isFinite(r1)) {
                pd.line(frontLeft, $V([r1, -this.length / 2]));
            } else {
                pd.line(frontLeft, $V([-this.width * 5, this.length / 2]));
            }
            pd.setProp("shapeOutlineColor", "red");
            if (isFinite(r2)) {
                pd.line(frontRight, $V([r2, -this.length / 2]));
            } else {
                pd.line(frontRight, $V([-this.width * 5, this.length / 2]));
            }
            pd.setProp("shapeOutlineColor", "black");
            pd.line($V([0, -this.length / 2]), $V([-this.width * 5, -this.length / 2]));
            pd.restore();

            if (showLabels) {
                if (isFinite(r1)) {
                    var r1MeasY = -this.length / 2 + this.wheelLength / 2;
                    pd.measurement($V([0, r1MeasY]), $V([r1, r1MeasY]), "TEX:$r_1$");
                }
                if (isFinite(r2)) {
                    var r2MeasY = -this.length / 2 + this.wheelLength / 2 + 0.4;
                    pd.measurement($V([0, r2MeasY]), $V([r2, r2MeasY]), "TEX:$r_2$");
                }
            }
        }
        if (showArmLines) {
            pd.save();
            pd.setProp("shapeStrokePattern", "dashed");
            pd.line(frontLeft, frontLeft.add($V([this.length * Math.tan(Math.PI/2 - alpha1), -this.length])));
            pd.line(frontRight, frontRight.add($V([-this.length * Math.tan(Math.PI/2 - alpha2), -this.length])));
            pd.restore();
        }
        return rVec;
    };

    var avs_fr_c = new PrairieDrawAnim("avs-fr-c", function(t) {
        this.addOption("trackRodShortenCM", 0);
        this.addOption("showLabels", true);
        
	this.setUnits(11, 10);

        var trackRodShorten = this.getOption("trackRodShortenCM") / 100;

        var dMax = 0.38;
        var d = dMax * 0.5 * (1 - Math.cos(t));
        this.save();
        this.translate($V([3, 2]));
        var rVec = f1car.draw(this, trackRodShorten, d, true, true, this.getOption("showLabels"));
        this.restore();
        var r1 = rVec[0];
        var r2 = rVec[1];

        var ir1History = this.history("ir1", 0.05, 2 * Math.PI + 0.05, t, $V([d, -1 / r1]));
        var ir2History = this.history("ir2", 0.05, 2 * Math.PI + 0.05, t, $V([d, -1 / r2]));
            
        var ir1Trace = this.historyToTrace(ir1History);
        var ir2Trace = this.historyToTrace(ir2History);

        var origin = $V([-3.7, -4.1]);
        var size = $V([8.5, 3]);
        var pointLabel = undefined;
        var pointAnchor = undefined;
        if (this.getOption("showLabels")) {
            pointLabel = "TEX:$\\displaystyle \\frac{1}{r_1}$";
            pointAnchor = $V([-1, 1]);
        }
        this.plot(ir1Trace, origin, size, $V([0, 0]), $V([dMax * 1.2, 0.3]),
                  "TEX:$d\\ /\\ \\rm m$", "TEX:$\\displaystyle \\frac{1}{r}\\ /\\ \\rm m^{-1}$",
                  "blue", true, true, pointLabel, pointAnchor);
        if (this.getOption("showLabels")) {
            pointLabel = "TEX:$\\displaystyle \\frac{1}{r_2}$";
            pointAnchor = $V([1, -1]);
        }
        this.plot(ir2Trace, origin, size, $V([0, 0]), $V([dMax * 1.2, 0.3]),
                  "TEX:$d\\ /\\ \\rm m$", "TEX:$\\displaystyle \\frac{1}{r}\\ /\\ \\rm m^{-1}$",
                  "red", false, true, pointLabel, pointAnchor);
    });

    avs_fr_c.registerOptionCallback("trackRodShortenCM", function(value) {this.clearAllHistory();});

}); // end of document.ready()
