
$(document).ready(function() {

    var rem_xs_c = new PrairieDraw("rem-xs-c", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var O = $V([0, 0]);
        var l = 1.5;
        var b = 1;
        var ei = $V([b, 0]);
        var ej = $V([0, b]);

        this.save();
        this.translate($V([-0.8, 0]));
        this.rectangle(l, l);
        this.text($V([-l/2, 0]), $V([1.3, 0]), "TEX:$\\ell$");
        this.text($V([0, -l/2]), $V([0, 1.3]), "TEX:$\\ell$");
        this.point(O);
        this.text(O, $V([1, 1]), "TEX:$C$");
        this.restore();

        this.save();
        this.translate($V([0.6, -0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, -1]), "TEX:$\\hat\\jmath$");
        this.restore();
    });

    var rem_xs_c3 = new PrairieDraw("rem-xs-c3", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var l = 2;
        var h = 0.3;
        var b = 2;

        var p000 = $V([-l/2, -l/2, -h/2]);
        var p001 = $V([-l/2, -l/2,  h/2]);
        var p010 = $V([-l/2,  l/2, -h/2]);
        var p011 = $V([-l/2,  l/2,  h/2]);
        var p100 = $V([ l/2, -l/2, -h/2]);
        var p101 = $V([ l/2, -l/2,  h/2]);
        var p110 = $V([ l/2,  l/2, -h/2]);
        var p111 = $V([ l/2,  l/2,  h/2]);

        var O = $V([0, 0, 0]);
        var a1 = $V([l/2, 0, 0]);
        var a2 = $V([0, l/2, 0]);
        var a3 = $V([0, 0, h/2]);
        var b1 = $V([1.3 * b, 0, 0]);
        var b2 = $V([0, b, 0]);
        var b3 = $V([0, 0, b/2]);

        this.save();
        this.translate($V([-0.1, 0]));

        this.line(p000, p001);
        this.line(p100, p000);
        this.line(p010, p000);

        this.line(O, a1);
        this.line(O, a2);
        this.line(O, a3);

        this.save();
        var alpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + alpha + ")");
        this.polyLine([p100, p110, p111, p101], true, true, false);
        this.polyLine([p010, p110, p111, p011], true, true, false);
        this.polyLine([p101, p111, p011, p001], true, true, false);
        this.restore();

        this.line(p100, p101);
        this.line(p110, p111);
        this.line(p010, p011);
        this.line(p100, p110);
        this.line(p101, p111);
        this.line(p110, p010);
        this.line(p111, p011);
        this.line(p101, p001);
        this.line(p011, p001);

        this.arrow(a1, b1);
        this.arrow(a2, b2);
        this.arrow(a3, b3);

        this.labelLine(a1, b1, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(a2, b2, $V([0.8, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(a3, b3, $V([0.8, -1.3]), "TEX:$\\hat{k}$");

        this.labelLine(p100, p110, $V([0.3, -1.2]), "TEX:$\\ell$");
        this.labelLine(p101, p001, $V([0, 1.2]), "TEX:$\\ell$");
        this.labelLine(p100, p101, $V([0, 1.2]), "TEX:$h$");

        this.text(O, $V([1, -0.6]), "TEX:$C$");

        this.restore();
    });

    var rem_xc_c = new PrairieDraw("rem-xc-c", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var O = $V([0, 0]);
        var l = 1.5;
        var b = 1;
        var ei = $V([b, 0]);
        var ej = $V([0, b]);
        var P = $V([-l/2, -l/2]);

        this.save();
        this.translate($V([-0.8, 0]));
        this.rectangle(l, l);
        this.text($V([-l/2, 0]), $V([1.3, 0]), "TEX:$\\ell$");
        this.text($V([0, -l/2]), $V([0, 1.3]), "TEX:$\\ell$");
        this.point(O);
        this.text(O, $V([1, 1]), "TEX:$C$");
        this.point(P);
        this.text(P, $V([1, 1]), "TEX:$P$");
        this.restore();

        this.save();
        this.translate($V([0.6, -0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, -1]), "TEX:$\\hat\\jmath$");
        this.restore();
    });

    var rem_xc_c3 = new PrairieDraw("rem-xc-c3", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var l = 2;
        var h = 0.3;

        var p000 = $V([-l/2, -l/2, -h/2]);
        var p001 = $V([-l/2, -l/2,  h/2]);
        var p010 = $V([-l/2,  l/2, -h/2]);
        var p011 = $V([-l/2,  l/2,  h/2]);
        var p100 = $V([ l/2, -l/2, -h/2]);
        var p101 = $V([ l/2, -l/2,  h/2]);
        var p110 = $V([ l/2,  l/2, -h/2]);
        var p111 = $V([ l/2,  l/2,  h/2]);

        var O = $V([0, 0, 0]);
        var P = $V([-l/2, -l/2, 0]);
        var ei = $V([l + 0.7, 0, 0]);
        var ej = $V([0, l + 0.5, 0]);
        var ek = $V([0, 0, h/2 + 0.4]);

        this.save();
        this.translate($V([0, -0.2]));

        this.save();
        this.translate3D(P);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.arrow(O, ek);

        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([0.9, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, ek, $V([0.8, -1.3]), "TEX:$\\hat{k}$");

        this.restore();

        this.line(p000, p001);
        this.line(p100, p000);
        this.line(p010, p000);

        this.save();
        var alpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + alpha + ")");
        this.polyLine([p100, p110, p111, p101], true, true, false);
        this.polyLine([p010, p110, p111, p011], true, true, false);
        this.polyLine([p101, p111, p011, p001], true, true, false);
        this.restore();

        this.line(p100, p101);
        this.line(p110, p111);
        this.line(p010, p011);
        this.line(p100, p110);
        this.line(p101, p111);
        this.line(p110, p010);
        this.line(p111, p011);
        this.line(p101, p001);
        this.line(p011, p001);

        this.labelLine(p001, p011, $V([0, 1.2]), "TEX:$\\ell$");
        this.labelLine(p101, p001, $V([0, 1.2]), "TEX:$\\ell$");
        this.labelLine(p110, p111, $V([0, 1]), "TEX:$h$");

        this.text(P, $V([-1, 1]), "TEX:$P$");

        this.restore();
    });

    var rem_xl_c = new PrairieDraw("rem-xl-c", function() {
        this.setUnits(5, 5 / this.goldenRatio);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var P1 = O;
        var P2 = P1.add(ei.x(3));
        var P3 = P2.add(ej);
        var P4 = P3.add(ei.x(-2));
        var P5 = P4.add(ej);
        var P6 = P5.add(ei.x(-1));

        this.save();
        this.translate($V([-2, -1]));
        this.polyLine([P1, P2, P3, P4, P5, P6], true, true);
        this.text(P1, $V([1, 1]), "TEX:$P$");
        this.labelLine(P1, P2, $V([0, -1]), "TEX:$6d$");
        this.labelLine(P2, P3, $V([0, -1]), "TEX:$2d$");
        this.labelLine(P3, P4, $V([0, -1]), "TEX:$4d$");
        this.labelLine(P4, P5, $V([0, -1]), "TEX:$2d$");
        this.labelLine(P5, P6, $V([0, -1]), "TEX:$2d$");
        this.labelLine(P6, P1, $V([0, -1]), "TEX:$4d$");
        this.restore();

        this.save();
        this.translate($V([1.2, 0.3]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([0.7, -1.3]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([0.7, 1.3]), "TEX:$\\hat\\jmath$");
        this.restore();
    });

    var rem_xl_cd = new PrairieDraw("rem-xl-cd", function() {
        this.setUnits(5, 5 / this.goldenRatio);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var P = [];
        for (var i = 0; i < 4; i++) {
            P[i] = [];
            for (var j = 0; j < 3; j++) {
                P[i][j] = $V([i, j]);
            }
        }

        var P1 = O;
        var P2 = P1.add(ei.x(3));
        var P3 = P2.add(ej);
        var P4 = P3.add(ei.x(-2));
        var P5 = P4.add(ej);
        var P6 = P5.add(ei.x(-1));

        this.save();
        this.translate($V([-2, -1]));
        this.polyLine([P[0][0], P[3][0], P[3][1], P[1][1], P[1][2], P[0][2]], true, true);
        this.line(P[0][1], P[1][1]);
        this.line(P[1][0], P[1][1]);
        this.line(P[2][0], P[2][1]);
        this.line(P[3][0], P[3][1]);
        this.text(P1, $V([1, 1]), "TEX:$P$");
        this.labelLine(P[0][0], P[1][0], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[1][0], P[2][0], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[2][0], P[3][0], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[3][0], P[3][1], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[3][1], P[2][1], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[2][1], P[1][1], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[1][1], P[1][2], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[1][2], P[0][2], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[0][2], P[0][1], $V([0, -1]), "TEX:$2d$");
        this.labelLine(P[0][1], P[0][0], $V([0, -1]), "TEX:$2d$");
        this.point(P[0][1].add($V([0.5, 0.5])));
        this.point(P[0][0].add($V([0.5, 0.5])));
        this.point(P[1][0].add($V([0.5, 0.5])));
        this.point(P[2][0].add($V([0.5, 0.5])));
        this.text(P[0][1].add($V([0.5, 0.5])), $V([-1, 1]), "TEX:$C_1$");
        this.text(P[0][0].add($V([0.5, 0.5])), $V([-1, 1]), "TEX:$C_2$");
        this.text(P[1][0].add($V([0.5, 0.5])), $V([-1, 1]), "TEX:$C_3$");
        this.text(P[2][0].add($V([0.5, 0.5])), $V([-1, 1]), "TEX:$C_4$");
        this.restore();

        this.save();
        this.translate($V([1.2, 0.3]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([0.7, -1.3]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([0.7, 1.3]), "TEX:$\\hat\\jmath$");
        this.restore();
    });

    var rem_ep_c = new PrairieDraw("rem-ep-c", function() {
        this.setUnits(4, 2);

        var O = $V([0, 0, 0]);
        var ei = $V([1, 0, 0]);
        var ej = $V([0, 1, 0]);
        var ek = $V([0, 0, 1]);
        var P = $V([1, 1, 0]);
        var Pi = $V([P.e(1), 0, 0]);
        var Pj = $V([0, P.e(2), 0]);

        var bi = ei.x(2);
        var bj = ej.x(2);
        var bk = ek.x(1);

        this.save();
        this.translate($V([-0.5, -0.15]));

        this.arrow(O, bi);
        this.arrow(O, bj);
        this.arrow(O, bk);
        this.labelLine(O, bi, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, bj, $V([0.9, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, bk, $V([0.9, -1.3]), "TEX:$\\hat{k}$");
        this.text(O, $V([1.3, -0.5]), "TEX:$P$");

        this.save();
        this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
        this.line(Pi, P);
        this.line(Pj, P);
        this.line(O, P);
        this.labelLine(O, P, $V([0.3, 1]), "TEX:$r$");
        this.restore();

        this.save();
        this.setProp("pointRadiusPx", 4);
        this.point(P);
        this.text(P, $V([-1, 1]), "TEX:$m$");
        this.restore();

        this.restore();
    });

    var rem_er_c = new PrairieDraw("rem-er-c", function() {
        this.setUnits(4, 2.2);

        var l = 2;
        var h = 0.6;
        var b = 2;

        var p000 = $V([-l/2, -l/2, -h/2]);
        var p001 = $V([-l/2, -l/2,  h/2]);
        var p010 = $V([-l/2,  l/2, -h/2]);
        var p011 = $V([-l/2,  l/2,  h/2]);
        var p100 = $V([ l/2, -l/2, -h/2]);
        var p101 = $V([ l/2, -l/2,  h/2]);
        var p110 = $V([ l/2,  l/2, -h/2]);
        var p111 = $V([ l/2,  l/2,  h/2]);

        var O = $V([0, 0, 0]);
        var a1 = $V([l/2, 0, 0]);
        var a2 = $V([0, l/2, 0]);
        var a3 = $V([0, 0, h/2]);
        var b1 = $V([1.3 * b, 0, 0]);
        var b2 = $V([0, b, 0]);
        var b3 = $V([0, 0, b/2]);

        this.save();
        this.translate($V([-0.1, -0.05]));

        this.line(p000, p001);
        this.line(p100, p000);
        this.line(p010, p000);

        this.line(O, a1);
        this.line(O, a2);
        this.line(O, a3);

        this.save();
        var alpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + alpha + ")");
        this.polyLine([p100, p110, p111, p101], true, true, false);
        this.polyLine([p010, p110, p111, p011], true, true, false);
        this.polyLine([p101, p111, p011, p001], true, true, false);
        this.restore();

        this.line(p100, p101);
        this.line(p110, p111);
        this.line(p010, p011);
        this.line(p100, p110);
        this.line(p101, p111);
        this.line(p110, p010);
        this.line(p111, p011);
        this.line(p101, p001);
        this.line(p011, p001);

        this.arrow(a1, b1);
        this.arrow(a2, b2);
        this.arrow(a3, b3);

        this.labelLine(O, b1, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, b2, $V([0.9, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, b3, $V([0.9, -1.3]), "TEX:$\\hat{k}$");

        this.labelLine(p100, p110, $V([0.3, -1.2]), "TEX:$\\ell_y$");
        this.labelLine(p101, p001, $V([0, 1.3]), "TEX:$\\ell_x$");
        this.labelLine(p100, p101, $V([0, 1.2]), "TEX:$\\ell_z$");

        this.text(O, $V([1, -0.4]), "TEX:$C$");

        this.restore();
    });

    var rem_ec_c = new PrairieDraw("rem-ec-c", function() {
        this.setUnits(4, 3);

        var r1 = 0.6;
        var r2 = 1.2;
        var h = 1.5;

        var O = $V([0, 0, 0]);
        var ei = $V([1, 0, 0]);
        var ej = $V([0, 1, 0]);
        var ek = $V([0, 0, 1]);

        var A = ek.x(-h/2);
        var B = ek.x(h/2);

        var ai = ei.x(r2);
        var aj = ej.x(r2);
        var ak = ek.x(h/2);

        var bi = ei.x(3.4);
        var bj = ej.x(2);
        var bk = ek.x(1.6);

        this.save();
        this.translate($V([-0.2, -0.2]));

        this.save();
        this.setProp("shapeInsideColor", "rgb(240, 240, 240)");
        this.cylinder(A, B.subtract(A), r1, {strokeBottomBack: false, strokeBottomFront: false, strokeSides: false,
                                             strokeTop: false, fillFront: false, fillTop: true});
        this.restore();
        this.line(O, ai);
        this.line(O, aj);
        this.line(O, ak);
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.8)");
        this.cylinder(A, B.subtract(A), r1, {strokeTop: false, fillFront: false, fillTop: false});
        var offset = this.cylinder(A, B.subtract(A), r2, {topInnerRadius: r1});
        this.cylinder(A, B.subtract(A), r1, {strokeBottomBack: false, strokeBottomFront: false, strokeSides: false,
                                             fillFront: false, fillTop: false});
        this.restore();

        this.arrow(ai, bi);
        this.arrow(aj, bj);
        this.arrow(ak, bk);
        this.labelLine(O, bi, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, bj, $V([0.9, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, bk, $V([0.9, -1.3]), "TEX:$\\hat{k}$");

        this.labelLine(B.subtract(offset), A.subtract(offset), $V([0, -1]), "TEX:$\\ell_z$");

        this.save();
        this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
        var T1 = B.add($V([0.5, 1, 0]).toUnitVector().x(r1));
        var T2 = B.add($V([-2, 1, 0]).toUnitVector().x(r2));
        this.line(B, T1);
        this.line(B, T2);
        this.labelLine(B, T1, $V([0.4, 0.9]), "TEX:$r_1$");
        this.labelLine(B, T2, $V([0.5, -1.1]), "TEX:$r_2$");
        this.restore();

        this.text(O, $V([1, -0.5]), "TEX:$C$");

        this.restore();
    });

    var rem_es_c = new PrairieDraw("rem-es-c", function() {
        this.setUnits(4, 3.25);

        var r1 = 0.8;
        var r2 = 1.3;
        var b = 2.6;

        var O = $V([0, 0, 0]);
        var a1 = $V([r2, 0, 0]);
        var a2 = $V([0, r2, 0]);
        var a3 = $V([0, 0, r2]);
        var b1 = $V([1.3 * b, 0, 0]);
        var b2 = $V([0, 0.8 * b, 0]);
        var b3 = $V([0, 0, 0.7 * b]);

        this.save();
        this.translate($V([-0.1, -0.25]));

        this.line(O, a1);
        this.line(O, a2);
        this.line(O, a3);

        this.sphere(O, r1, false);
        this.sphereSlice(O, r1, Vector.k, 0, true, true);
        this.sphereSlice(O, r2, Vector.k, 0, true, false);

        this.save();
        var alpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + alpha + ")");
        this.sphere(O, r2, true);
        this.sphereSlice(O, r2, Vector.k, 0, false, true);
        this.restore();

        this.arrow(a1, b1);
        this.arrow(a2, b2);
        this.arrow(a3, b3);

        this.labelLine(O, b1, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, b2, $V([0.9, -1.3]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, b3, $V([0.9, -1.3]), "TEX:$\\hat{k}$");

        this.save();
        this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
        var T1 = $V([0.5, 1, 0]).toUnitVector().x(r1);
        var T2 = $V([-1.7, 1, 0]).toUnitVector().x(r2);
        this.line(O, T1);
        this.line(O, T2);
        this.labelLine(O, T1, $V([-0.1, -0.9]), "TEX:$r_1$");
        this.labelLine(O, T2, $V([0.6, -1.1]), "TEX:$r_2$");
        this.restore();

        this.text(O, $V([1, -0.4]), "TEX:$C$");

        this.restore();
    });

}); // end of document.ready()
