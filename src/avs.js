
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

    f1car.draw = function(pd, trackRodShorten, rackOffset) {
        var t = $V([trackRodShorten, this.trackRodOffset])
        var theta = Math.PI/2 - pd.angleOf(t);
        var a = t.modulus();
        var angles = this.findAngles(pd, this.width, a, this.width - 2 * trackRodShorten, rackOffset);
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
        pd.arrow($V([0, mid.e(2)]), mid, 'position');
        pd.point(mid);

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
    };

    var avs_fr_c = new PrairieDrawAnim("avs-fr-c", function(t) {
        this.addOption("radii", false);
        
	this.setUnits(11, 11);

        f1car.draw(this, 0.2, 0.35 * Math.sin(t));

        if (this.getOption("radii")) {
        }
    });

}); // end of document.ready()
