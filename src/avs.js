
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

    f1car.findAngles = function(w, a, h, d) {
        console.log(w, a, h, d);
        var cosMaxAngle = (w * w + h * h - a * a) / (2 * w * h);
        var maxD = a + h * cosMaxAngle / 2 - w / 2;
        console.log(maxD, d);
        if (Math.abs(d) >= maxD) {
            return [NaN, NaN];
        }

        // Solve:
        // (w - a cos(a1) - a cos(a2))^2 + (a sin(a1) - a sin(a2))^2 - h^2 = 0
        // a cos(a1) - a cos(a2) - 2 d = 0
        // with Newton's method
        var a1 = Math.PI/2;
        var a2 = Math.PI/2;
        var i, f1, f2, J11, J12, J21, J22, det, da1, da2;
        for (i = 0; i < 10; i++) {
            f1 = Math.pow(w - a * Math.cos(a1) - a * Math.cos(a2), 2) + Math.pow(a * Math.sin(a1) - a * Math.sin(a2), 2) - h*h;
            f2 = a * Math.cos(a1) - a * Math.cos(a2) - 2 * d;
            J11 = -2 * a * (-w * Math.sin(a1) + a * Math.sin(a1 + a2));
            J12 = -2 * a * (-w * Math.sin(a2) + a * Math.sin(a1 + a2));
            J21 = -a * Math.sin(a1);
            J22 = a * Math.sin(a2);
            det = J11 * J22 - J12 * J21;
            da1 = (J22 * f1 - J12 * f2) / det;
            da2 = (-J21 * f1 + J11 * f2) / det;
            a1 = a1 - da1;
            a2 = a2 - da2;
            console.log(f1, f2);
        }
        console.log("a1", a1,"a2", a2);
        console.log("length", Math.sqrt(Math.pow(w - a * Math.cos(a1) - a * Math.cos(a2), 2) + Math.pow(a * Math.sin(a1) - a * Math.sin(a2), 2)), "h", h);
        return [a1, a2];
    };

    f1car.draw = function(pd, trackRodShorten, rackOffset) {
        var t = $V([trackRodShorten, this.trackRodOffset])
        var theta = Math.PI/2 - pd.angleOf(t);
        var a = t.modulus();
        var angles = this.findAngles(this.width, a, this.width - 2 * trackRodShorten, rackOffset);
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

        f1car.draw(this, 0.2, 0.39);

        if (this.getOption("radii")) {
        }
    });

}); // end of document.ready()
