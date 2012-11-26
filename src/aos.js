
$(document).ready(function() {

    var aos_fd_c = new PrairieDrawAnim("aos-fd-c", function(t) {
	this.setUnits(4, 4 / this.goldenRatio);

        if (this._viewAngleX3D !== undefined) {
            this.rotate3D(this._viewAngleX3D, this._viewAngleY3D, this._viewAngleZ3D);
        }

        this.arrow($V([0, 0, 0]), $V([1, 0, 0]));
        this.arrow($V([0, 0, 0]), $V([0, 1, 0]));
        this.arrow($V([0, 0, 0]), $V([0, 0, 1]));

        this.labelLine($V([0, 0, 0]), $V([1, 0, 0]), $V([1, 1]), "TEX:$x$");
        this.labelLine($V([0, 0, 0]), $V([0, 1, 0]), $V([1, -1]), "TEX:$y$");
        this.labelLine($V([0, 0, 0]), $V([0, 0, 1]), $V([1, -1]), "TEX:$z$");
    });

    aos_fd_c.activate3DControl();

}); // end of document.ready()
