
$(document).ready(function() {

    rvv_fc_c = new PrairieDrawAnim("rvv-fc-c", function(t) {
	this.setUnits(6, 4);

        this.addOption("otherLength", false);
        this.addOption("otherDir", false);

        var O1 = $V([1.47 * Math.sin(1.6 * t - 0.7), 0.97 * Math.cos(0.9 * t + 1)]);
        var O2 = $V([1.8 * Math.sin(t + 1), 0.94 * Math.cos(0.6 * t + 2)]);
        var V1 = $V([1.5, 0.7]);
        var V2 = $V([1.5, 0.7]);

        var sameVecs = true;

        if (this.getOption("otherDir")) {
            sameVecs = false;
            V1 = V1.rotate(-Math.PI/6, $V([0, 0]));
            V2 = V2.rotate(Math.PI/6, $V([0, 0]));
        }
        if (this.getOption("otherLength")) {
            sameVecs = false;
            V1 = V1.x(1.4);
            V2 = V2.x(0.8);
        }
        this.translate($V([-0.9, -0.3]));
        this.arrow(O1, O1.add(V1), "position");
        this.labelLine(O1, O1.add(V1), $V([0, 1]), "TEX:$\\vec{a}$");
        this.arrow(O2, O2.add(V2), "angMom");
        this.labelLine(O2, O2.add(V2), $V([0, -1]), "TEX:$\\vec{b}$");
        
        var msg;
        if (sameVecs) {
            msg = "TEX:\\sf $\\vec{a}$ is the same as $\\vec{b}$";
        } else {
            msg = "TEX:\\sf $\\vec{a}$ is different to $\\vec{b}$";
        }
        var T = this.posNm2Dw($V([0.5, 0]));
        this.text(T, $V([0, -1]), msg);
    });

    rvv_fp_c = new PrairieDraw("rvv-fp-c", function() {
	this.setUnits(12, 4);

        var O = $V([0, 0]);
        var a = $V([2.5, 0]);
        var b = $V([2, 2]);
        var aColor = "red";
        var bColor = "blue";

        this.translate($V([-5, -1]));

        this.arrow(O, a, aColor);
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");

        this.arrow(O, b, bColor);
        this.labelLine(O, b, $V([0, 1]), "TEX:$\\vec{b}$");

        this.arrow(b, b.add(a), aColor);
        this.labelLine(b, b.add(a), $V([0, 1]), "TEX:$\\vec{a}$");

        this.arrow(a, a.add(b), bColor);
        this.labelLine(a, a.add(b), $V([0, -1]), "TEX:$\\vec{b}$");

        this.arrow(O, a.add(b), "darkgreen");
        this.labelLine(O, a.add(b), $V([0, -1]), "TEX:$\\vec{a} + \\vec{b}$");

        this.translate($V([4.5, 0]));
        this.arrow(O, a.x(2), "darkred");
        this.labelLine(O, a.x(2), $V([0, -1]), "TEX:$2\\vec{a}$");

        this.translate($V([4.5, 2]));
        this.arrow(O, b.x(-0.7), "darkblue");
        this.labelLine(O, b.x(-0.7), $V([0, 1]), "TEX:$-0.7\\vec{b}$");

    });

    rvv_fb_c = new PrairieDraw("rvv-fb-c", function() {
	this.setUnits(6, 4);

        var O = $V([0, 0]);
        var a = $V([3, 2]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-2.3, -1.3]));

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");

        this.translate($V([1.3, 0.5]));

        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");

        this.arrow(O, ei.x(a.e(1)));
        this.labelLine(O, ei.x(a.e(1)), $V([0, -1]), "TEX:$3\\hat\\imath$");

        this.arrow(ei.x(a.e(1)), a);
        this.labelLine(ei.x(a.e(1)), a, $V([0, -1]), "TEX:$2\\hat\\jmath$");

    });

    rvv_fl_c = new PrairieDraw("rvv-fl-c", function() {
	this.setUnits(6, 4);

        var O = $V([0, 0]);
        var a = $V([4, 3]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-2, -1.5]));

        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, 1.4]), "TEX:$a = \\sqrt{4^2 + 3^2} = 5$");

        this.arrow(O, ei.x(a.e(1)));
        this.labelLine(O, ei.x(a.e(1)), $V([0, -1]), "TEX:$3\\hat\\imath$");

        this.arrow(ei.x(a.e(1)), a);
        this.labelLine(ei.x(a.e(1)), a, $V([0, -1]), "TEX:$2\\hat\\jmath$");

    });

    rvv_ft_c = new PrairieDraw("rvv-ft-c", function() {
	this.setUnits(1.4, 1.4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-0.5, -0.5]));

        this.arrow(O, ei.x(1.1));
        this.arrow(O, ej.x(1.1));

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        var d = 0.03;

        this.line($V([0, -d]), $V([0, 0]));
        this.text($V([0, -d]), $V([0, 1]), "TEX:$0$");

        this.line($V([1, -d]), $V([1, 0]));
        this.text($V([1, -d]), $V([0, 1]), "TEX:$2000$");

        this.line($V([-d, 0]), $V([0, 0]));
        this.text($V([-d, 0]), $V([1, 0]), "TEX:$0$");

        this.line($V([-d, 1]), $V([0, 1]));
        //this.text($V([-d, 1]), $V([1, 0]), "TEX:$2000$");

        this.labelLine(O, ei, $V([0, -2]), "TEX:$a$");
        this.labelLine(O, ej, $V([0, 2]), "TEX:$b$");

        this.restore();

        this.save();
        this.setProp("pointRadiusPx", 0.5);
        this.scale($V([0.0005, 0.0005]));
        var i, p;
        for (i = 0; i < py_triples.length; i++) {
            p = py_triples[i];
            this.point(p);
            this.point($V([p.e(2), p.e(1)]));
        }
        this.restore();

    });

    rvv_fu_c = new PrairieDraw("rvv-fu-c", function() {
	this.setUnits(8, 4);

        var O = $V([0, 0]);

        var a = $V([0.6, -1]);
        var b = $V([1.5, 1.5]);
        var c = $V([-0.5, 0.4]);

        var aHat = a.toUnitVector();
        var bHat = b.toUnitVector();
        var cHat = c.toUnitVector();

        this.save();
        this.translate($V([-3, 0]));
        this.arrow(O, a, "red");
        this.arrow(O, b, "blue");
        this.arrow(O, c, "darkgreen");
        this.labelLine(O, a, $V([1, -1]), "TEX:$\\vec{a}$");
        this.labelLine(O, b, $V([1, -1]), "TEX:$\\vec{b}$");
        this.labelLine(O, c, $V([1, 1]), "TEX:$\\vec{c}$");
        this.restore();

        this.save();
        this.translate($V([-0.2, -0.7]));
        var d = 0.4;
        this.line(O, $V([0, a.modulus()]), "red");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$a$");
        this.translate($V([d, 0]));
        this.line(O, $V([0, b.modulus()]), "blue");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$b$");
        this.translate($V([d, 0]));
        this.line(O, $V([0, c.modulus()]), "darkgreen");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$c$");
        this.restore();

        this.save();
        this.translate($V([2.5, 0]));
        this.arrow(O, aHat, "red");
        this.arrow(O, bHat, "blue");
        this.arrow(O, cHat, "darkgreen");
        this.labelLine(O, aHat, $V([1, -1]), "TEX:$\\hat{a}$");
        this.labelLine(O, bHat, $V([1, -1]), "TEX:$\\hat{b}$");
        this.labelLine(O, cHat, $V([1, -1]), "TEX:$\\hat{c}$");
        this.restore();

        this.text($V([0.3, -2]), $V([0, -1]), "TEX:vectors\\qquad$=$\\qquad lengths\\qquad$\\times$\\qquad directions");

    });

    rvv_ed_c = new PrairieDraw("rvv-ed-c", function() {
        this.setUnits(5, 3);
        this.translate($V([-2, -1]));
        this.addOption("angles", false);
        this.addOption("components", false);
                
        if (this.getOption("angles")) {
            this.line($V([-2, 0]), $V([5, 0]));
            this.line($V([0, -2]), $V([0, 3]));
        }
                
        var O = $V([0, 0]);
        var A = $V([4, 1]);
        var B = $V([2, 2]);
                
        var Ab = $V([A.e(1), 0]);
        var Bb = $V([B.e(1), 0]);
                
        var aType = "position";
        var bType = "angMom";
                
        this.arrow(O, A, aType);
        this.labelLine(O, A, $V([0.5, 1]), "TEX:$\\vec{a}$");
        this.arrow(O, B, "angMom");
        this.labelLine(O, B, $V([0, 1]), "TEX:$\\vec{b}$");
                
        var theta_a = this.angleOf(A);
        var theta_b = this.angleOf(B);
                
        this.circleArrow(O, 2, theta_a, theta_b);
        this.labelCircleLine(O, 2, theta_a, theta_b, $V([0, 1]), "TEX:$\\theta$");
        if (this.getOption("angles")) {
            this.circleArrow(O, 1.5, 0, theta_a, aType);
            this.labelCircleLine(O, 1.5, 0, theta_a, $V([0, 1]), "TEX:$\\theta_a$");
            this.circleArrow(O, 1, 0, theta_b, bType);
            this.labelCircleLine(O, 1, 0, theta_b, $V([0.5, 1]), "TEX:$\\theta_b$");
        }
                
        if (this.getOption("components")) {
            this.line(O, Ab, aType);
            this.labelLine(O, Ab, $V([0.5, -1]), "TEX:$a_1$");
                
            this.line(Ab, A, aType);
            this.labelLine(Ab, A, $V([0, -1]), "TEX:$a_2$");
                
            this.line(O, $V([B.e(1), 0]), bType);
            this.labelLine(O, Bb, $V([0, -1]), "TEX:$b_1$");
                
            this.line(Bb, B, bType);
            this.labelLine(Bb, B, $V([0, -1]), "TEX:$b_2$");
        }
    });

    rvv_fx_c = new PrairieDraw("rvv-fx-c", function() {
        this.setUnits(8, 4);

        var O = $V([0, 0]);
        var a = $V([4, 0]);
        var b = $V([2, 2]);
        var aColor = "red";
        var bColor = "blue";

        this.translate($V([-3, -1]));

        this.arrow(O, a, aColor);
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");

        this.arrow(O, b, bColor);
        this.labelLine(O, b, $V([0, 1]), "TEX:$\\vec{b}$");

        this.arrow(b, b.add(a), aColor);
        this.labelLine(b, b.add(a), $V([0, 1]), "TEX:$\\vec{a}$");

        this.arrow(a, a.add(b), bColor);
        this.labelLine(a, a.add(b), $V([0, -1]), "TEX:$\\vec{b}$");

        this.text(O, $V([-3, -1]), "TEX:$\\theta$");

        this.line(b, $V([b.e(1), 0]), "darkgreen");
        this.labelLine(b, $V([b.e(1), 0]), $V([0.3, -1.1]), "TEX:$b \\sin\\theta$");
        this.rightAngle($V([b.e(1), 0]), $V([0, 1]));

        this.text($V([3.3, 1]), $V([0, 0]), "TEX:$A = a b \\sin\\theta$");
    });

    rvv_fm_c = new PrairieDraw("rvv-fm-c", function() {
        this.setUnits(8, 4);

        var O = $V([0, 0]);
        var a = $V([1.7, 2.8]);
        var b = $V([5, 3]);
        var ap = b.toUnitVector().x(a.dot(b) / b.modulus());
        var ac = a.subtract(ap);
        var aColor = "red";
        var bColor = "blue";

        this.translate($V([-2, -1.5]));

        this.arrow(O, a, aColor);
        this.labelLine(O, a, $V([0, 1]), "TEX:$\\vec{a}$");

        this.arrow(O, b, bColor);
        this.labelLine(O, b, $V([0.7, -1.4]), "TEX:$\\vec{b}$");

        this.text(O, $V([-3.5, -2.5]), "TEX:$\\theta$");

        this.arrow(O, ap, "darkred");
        this.labelLine(O, ap, $V([0, -1.2]), "TEX:$\\operatorname{Proj}(\\vec{a},\\vec{b})$");

        this.arrow(O, ac, "darkgreen");
        this.arrow(ap, a, "darkgreen");
        this.labelLine(O, ac, $V([1, -1]), "TEX:$\\operatorname{Comp}(\\vec{a},\\vec{b})$");

        this.rightAngle(O, b);
        this.rightAngle(ap, ac);
    });

}); // end of document.ready()
