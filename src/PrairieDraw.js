
/*****************************************************************************/

/** Creates a PrairieDraw object.

    @constructor
    @this {PrairieDraw}
    @param {HTMLCanvasElement or string} canvas The canvas element to draw on or the ID of the canvas elemnt.
    @param {Function} drawfcn An optional function that draws on the canvas.
*/
function PrairieDraw(canvas, drawFcn) {
    if (canvas) {
        if (canvas instanceof HTMLCanvasElement) {
            /** @private */ this._canvas = canvas;
        } else if (canvas instanceof String || typeof canvas == "string") {
            /** @private */ this._canvas = document.getElementById(canvas);
        } else {
            throw new Error("PrairieDraw: unknown object type for constructor")
        }
        this._canvas.prairieDraw = this;

        /** @private */ this._ctx = this._canvas.getContext('2d');
        if (this._ctx.setLineDash === undefined) {
            this._ctx.setLineDash = function() {};
        }
        /** @private */ this._width = this._canvas.width;
        /** @private */ this._height = this._canvas.height;

        /** @private */ this._trans = Matrix.I(3);
        /** @private */ this._transStack = [];

        /** @private */ this._props = {};
        this._initProps();
        /** @private */ this._propStack = [];

        /** @private */ this._options = {};

        /** @private */ this._history = {};

        /** @private */ this._images = {};

        if (drawFcn) {
            this.draw = drawFcn.bind(this);
        }
        this.draw();
    }
}

/** Creates a new PrairieDraw from a canvas ID.

    @param {string} id The ID of the canvas element to draw on.
    @return {PrairieDraw} The new PrairieDraw object.
*/
PrairieDraw.fromCanvasId = function(id) {
    var canvas = document.getElementById(id);
    if (!canvas) {
        throw new Error("PrairieDraw: unable to find canvas ID: " + id);
    }
    return new PrairieDraw(canvas);
}

/** Prototype function to draw on the canvas, should be implemented by children.
*/
PrairieDraw.prototype.draw = function() {
}

/** Redraw the drawing.
*/
PrairieDraw.prototype.redraw = function() {
    this.draw();
}

/** @private Initialize properties.
*/
PrairieDraw.prototype._initProps = function() {

    this._props.arrowLineWidthPx = 2;
    this._props.arrowLinePattern = 'solid';
    this._props.arrowheadLengthRatio = 7; // arrowheadLength / arrowLineWidth
    this._props.arrowheadWidthRatio = 0.3; // arrowheadWidth / arrowheadLength
    this._props.arrowheadOffsetRatio = 0.3; // arrowheadOffset / arrowheadLength
    this._props.circleArrowWrapOffsetRatio = 1.5;

    this._props.textOffsetPx = 4;

    this._props.pointRadiusPx = 2;

    this._props.shapeStrokeWidthPx = 2;
    this._props.shapeStrokePattern = 'solid';
    this._props.shapeOutlineColor = "rgb(0, 0, 0)";
    this._props.shapeInsideColor = "rgb(255, 255, 255)";

    this._props.centerOfMassStrokeWidthPx = 2;
    this._props.centerOfMassColor = "rgb(180, 49, 4)";
    this._props.centerOfMassRadiusPx = 5;

    this._props.measurementStrokeWidthPx = 1;
    this._props.measurementStrokePattern = 'solid';
    this._props.measurementEndLengthPx = 10;
    this._props.measurementOffsetPx = 3;
    this._props.measurementColor = "rgb(0, 0, 0)";

    this._props.groundDepthPx = 10;
    this._props.groundWidthPx = 10;
    this._props.groundSpacingPx = 10;
    this._props.groundOutlineColor = "rgb(0, 0, 0)";
    this._props.groundInsideColor = "rgb(220, 220, 220)";

    this._props.gridColor = "rgb(200, 200, 200)";
    this._props.positionColor = "rgb(0, 0, 255)";
    this._props.velocityColor = "rgb(0, 200, 0)";
    this._props.accelerationColor = "rgb(255, 0, 255)";
    this._props.angMomColor = "rgb(255, 0, 0)";
    this._props.forceColor = "rgb(210, 105, 30)";
    this._props.momentColor = "rgb(255, 102, 80)";
}

/*****************************************************************************/

/** The golden ratio.
*/
PrairieDraw.prototype.goldenRatio = (1 + Math.sqrt(5)) / 2;

/** Get the canvas width.

    @return {number} The canvas width in Px.
*/
PrairieDraw.prototype.widthPx = function() {
    return this._width;
}

/** Get the canvas height.

    @return {number} The canvas height in Px.
*/
PrairieDraw.prototype.heightPx = function() {
    return this._height;
}

/*****************************************************************************/

/** Convert degrees to radians.

    @param {number} degrees The angle in degrees.
    @return {number} The angle in radians.
*/
PrairieDraw.prototype.degToRad = function(degrees) {
    return degrees * Math.PI / 180;
};

/** Convert radians to degrees.

    @param {number} radians The angle in radians.
    @return {number} The angle in degrees.
*/
PrairieDraw.prototype.radToDeg = function(radians) {
    return radians * 180 / Math.PI;
};

/** Fixed modulus function (handles negatives correctly).

    @param {number} value The number to convert.
    @param {number} modulus The modulus.
    @return {number} value mod modulus.
*/
PrairieDraw.prototype.fixedMod = function(value, modulus) {
    return ((value % modulus) + modulus) % modulus;
};

/*****************************************************************************/

/** Return an identity transformation matrix.

    @return {Matrix} An identity transformation.
*/
PrairieDraw.prototype.identityTransform = function() {
    return Matrix.I(3);
};

/** Scale a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {Vector} factor Scale factors.
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.scaleTransform = function(transform, factor) {
    return transform.x($M([[factor.e(1), 0, 0], [0, factor.e(2), 0], [0, 0, 1]]));
}

/** Translate a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {Vector} offset Translation offset (drawing coords).
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.translateTransform = function(transform, offset) {
    return transform.x($M([[1, 0, offset.e(1)], [0, 1, offset.e(2)], [0, 0, 1]]));
}

/** Rotate a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {number} angle Angle to rotate by (radians).
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.rotateTransform = function(transform, angle) {
    return transform.x(Matrix.RotationZ(angle));
}

/** Transform a transformation matrix (scale, translate, rotate) to
    match old points to new. Drawing at the old locations will result
    in points at the new locations.

    @param {Matrix} transform The original transformation.
    @param {Vector} old1 The old location of point 1.
    @param {Vector} old2 The old location of point 2.
    @param {Vector} new1 The new location of point 1.
    @param {Vector} new2 The new location of point 2.
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.transformByPointsTransform = function(transform, old1, old2, new1, new2) {
    var oldMid = old1.add(old2).x(0.5);
    var newMid = new1.add(new2).x(0.5);
    var oldDelta = old2.subtract(old1);
    var newDelta = new2.subtract(new1);

    var offset = newMid.subtract(oldMid);
    var factor = newDelta.modulus() / oldDelta.modulus();
    var angle = this.angleFrom(oldDelta, newDelta);

    var newTransform = transform;
    newTransform = this.translateTransform(newTransform, newMid);
    newTransform = this.rotateTransform(newTransform, angle);
    newTransform = this.scaleTransform(newTransform, $V([factor, factor]));
    newTransform = this.translateTransform(newTransform, oldMid.x(-1));
    return newTransform;
}

/*****************************************************************************/

/** Transform a vector by a transformation matrix.

    @param {Matrix} transform The transformation matrix.
    @param {Vector} vec The vector.
    @return {Vector} The transformed vector.
*/
PrairieDraw.prototype.transformVec = function(transform, vec) {
    var v3 = transform.x($V([vec.e(1), vec.e(2), 0]))
    return $V([v3.e(1), v3.e(2)]);
}

/** Transform a position by a transformation matrix.

    @param {Matrix} transform The transformation matrix.
    @param {Vector} pos The position.
    @return {Vector} The transformed position.
*/
PrairieDraw.prototype.transformPos = function(transform, pos) {
    var p3 = transform.x($V([pos.e(1), pos.e(2), 1]))
    return $V([p3.e(1), p3.e(2)]);
}

/*****************************************************************************/

/** Scale the coordinate system.

    @param {Vector} factor Scale factors.
*/
PrairieDraw.prototype.scale = function(factor) {
    this._trans = this.scaleTransform(this._trans, factor);
}

/** Translate the coordinate system.

    @param {Vector} offset Translation offset (drawing coords).
*/
PrairieDraw.prototype.translate = function(offset) {
    this._trans = this.translateTransform(this._trans, offset);
}

/** Rotate the coordinate system.

    @param {number} angle Angle to rotate by (radians).
*/
PrairieDraw.prototype.rotate = function(angle) {
    this._trans = this.rotateTransform(this._trans, angle);
}

/** Transform the coordinate system (scale, translate, rotate) to
    match old points to new. Drawing at the old locations will result
    in points at the new locations.

    @param {Vector} old1 The old location of point 1.
    @param {Vector} old2 The old location of point 2.
    @param {Vector} new1 The new location of point 1.
    @param {Vector} new2 The new location of point 2.
*/
PrairieDraw.prototype.transformByPoints = function(old1, old2, new1, new2) {
    this._trans = this.transformByPointsTransform(this._trans, old1, old2, new1, new2);
}

/*****************************************************************************/

/** Transform a vector from drawing to pixel coords.

    @param {Vector} vDw Vector in drawing coords.
    @return {Vector} Vector in pixel coords.
*/
PrairieDraw.prototype.vec2Px = function(vDw) {
    return this.transformVec(this._trans, vDw);
}

/** Transform a position from drawing to pixel coords.

    @param {Vector} pDw Position in drawing coords.
    @return {Vector} Position in pixel coords.
*/
PrairieDraw.prototype.pos2Px = function(pDw) {
    return this.transformPos(this._trans, pDw);
}

/** Transform a vector from pixel to drawing coords.

    @param {Vector} vPx Vector in pixel coords.
    @return {Vector} Vector in drawing coords.
*/
PrairieDraw.prototype.vec2Dw = function(vPx) {
    return this.transformVec(this._trans.inverse(), vPx);
}

/** Transform a position from pixel to drawing coords.

    @param {Vector} pPx Position in pixel coords.
    @return {Vector} Position in drawing coords.
*/
PrairieDraw.prototype.pos2Dw = function(pPx) {
    return this.transformPos(this._trans.inverse(), pPx);
}

/** @private Returns true if the current transformation is a reflection.

    @return {bool} Whether the current transformation is a reflection.
*/
PrairieDraw.prototype._transIsReflection = function() {
    var det = this._trans.e(1, 1) * this._trans.e(2, 2) - this._trans.e(1, 2) * this._trans.e(2, 1);
    if (det < 0) {
        return true;
    } else {
        return false;
    }
}

/** Transform a position from normalized viewport [0,1] to drawing coords.

    @param {Vector} pNm Position in normalized viewport coordinates.
    @return {Vector} Position in drawing coordinates.
*/
PrairieDraw.prototype.posNm2Dw = function(pNm) {
    var pPx = this.posNm2Px(pNm);
    return this.pos2Dw(pPx);
}

/** Transform a position from normalized viewport [0,1] to pixel coords.

    @param {Vector} pNm Position in normalized viewport coords.
    @return {Vector} Position in pixel coords.
*/
PrairieDraw.prototype.posNm2Px = function(pNm) {
    return $V([pNm.e(1) * this._width, (1 - pNm.e(2)) * this._height]);
}

/*****************************************************************************/

/** Set a property.

    @param {string} name The name of the property.
    @param {number} value The value to set the property to.
*/
PrairieDraw.prototype.setProp = function(name, value) {
    if (!(name in this._props)) {
        throw new Error("PrairieDraw: unknown property name: " + name);
    }
    this._props[name] = value;
}

/** Get a property.

    @param {string} name The name of the property.
    @return {number} The current value of the property.
*/
PrairieDraw.prototype.getProp = function(name) {
    if (!(name in this._props)) {
        throw new Error("PrairieDraw: unknown property name: " + name);
    }
    return this._props[name];
}

/** @private Get a color property for a given type.

    @param {string} type Optional type to find the color for.
*/
PrairieDraw.prototype._getColorProp = function(type) {
    if (type) {
        var col = type + "Color";
        if (col in this._props) {
            return this._props[col];
        } else {
            throw new Error("PrairieDraw: unknown type: " + type);
        }
    } else {
        return this._props.shapeOutlineColor;
    }
}

/*****************************************************************************/

/** Add an external option for this drawing.

    @param {string} name The option name.
    @param {object} value The default initial value.
*/
PrairieDraw.prototype.addOption = function(name, value, triggerRedraw) {
    if (!(name in this._options)) {
        this._options[name] = {
            value: value,
            resetValue: value,
            callbacks: {},
            triggerRedraw: ((triggerRedraw === undefined) ? true : triggerRedraw)
        };
    } else if (!("value" in this._options[name])) {
        this._options[name].value = value;
    }
}

/** Set an option to a given value.

    @param {string} name The option name.
    @param {object} value The new value for the option.
    @param {bool} redraw (Optional) Whether to trigger a redraw().
    @param {Object} trigger (Optional) The object that triggered the change.
    @param {bool} setReset (Optional) Also set this value to be the new reset value.
*/
PrairieDraw.prototype.setOption = function(name, value, redraw, trigger, setReset) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    option.value = value;
    if (setReset !== undefined && setReset === true) {
        option.resetValue = value;
    }
    for (var p in option.callbacks) {
        option.callbacks[p](option.value, trigger);
    }
    if ((redraw === undefined) || (redraw === true)) {
        this.redraw();
    }
}

/** Get the value of an option.

    @param {string} name The option name.
    @return {object} The current value for the option.
*/
PrairieDraw.prototype.getOption = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if (!("value" in this._options[name])) {
        throw new Error("PrairieDraw: option has no value: " + name);
    }
    return this._options[name].value;
}

/** Set an option to the logical negation of its current value.

    @param {string} name The option name.
*/
PrairieDraw.prototype.toggleOption = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if (!("value" in this._options[name])) {
        throw new Error("PrairieDraw: option has no value: " + name);
    }
    var option = this._options[name];
    option.value = !option.value;
    for (var p in option.callbacks) {
        option.callbacks[p](option.value);
    }
    this.redraw();
}

/** Register a callback on option changes.

    @param {string} name The option to register on.
    @param {Function} callback The callback(value) function.
    @param {string} callbackID (Optional) The ID of the callback. If omitted, a new unique ID will be generated.
*/
PrairieDraw.prototype.registerOptionCallback = function(name, callback, callbackID) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    var useID;
    if (callbackID === undefined) {
        var nextIDNumber = 0, curIDNumber;
        for (var p in option.callbacks) {
            curIDNumber = parseInt(p);
            if (isFinite(curIDNumber)) {
                nextIDNumber = Math.max(nextIDNumber, curIDNumber + 1);
            }
        }
        useID = nextIDNumber.toString();
    } else {
        useID = callbackID;
    }
    option.callbacks[useID] = callback.bind(this);
    option.callbacks[useID](option.value);
}

/** Clear the value for the given option.

    @param {string} name The option to clear.
*/
PrairieDraw.prototype.clearOptionValue = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if ("value" in this._options[name]) {
        delete this._options[name].value;
    }
};

/** Reset the value for the given option.

    @param {string} name The option to reset.
*/
PrairieDraw.prototype.resetOptionValue = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    if (!("resetValue" in option)) {
        throw new Error("PrairieDraw: option has no resetValue: " + name);
    }
    option.value = option.resetValue;
    for (var p in option.callbacks) {
        option.callbacks[p](option.value);
    }
};

/*****************************************************************************/

/** Save the graphics state (properties, options, and transformations).

    @see restore().
*/
PrairieDraw.prototype.save = function() {
    this._ctx.save();
    var oldProps = {};
    for (p in this._props) {
        oldProps[p] = this._props[p];
    }
    this._propStack.push(oldProps);
    this._transStack.push(this._trans.dup());
}

/** Restore the graphics state (properties, options, and transformations).

    @see save().
*/
PrairieDraw.prototype.restore = function() {
    this._ctx.restore();
    if (this._propStack.length == 0) {
        throw new Error("PrairieDraw: tried to restore() without corresponding save()");
    }
    if (this._propStack.length != this._transStack.length) {
        throw new Error("PrairieDraw: incompatible save stack lengths");
    }
    this._props = this._propStack.pop();
    this._trans = this._transStack.pop();
}

/*****************************************************************************/

/** Reset the canvas image and drawing context.
*/
PrairieDraw.prototype.resetDrawing = function() {
    while (this._propStack.length > 0) {
        this.restore();
    }
    this._ctx.clearRect(0, 0, this._width, this._height);
}

/** Reset everything to the intial state.
*/
PrairieDraw.prototype.reset = function() {
    for (optionName in this._options) {
        this.resetOptionValue(optionName)
    }
    this.redraw();
}

/** Stop all action and computation.
*/
PrairieDraw.prototype.stop = function() {
}

/*****************************************************************************/

/** Set the visable coordinate sizes.

    @param {number} xSize The horizontal size of the drawing area in coordinate units.
    @param {number} ySize The vertical size of the drawing area in coordinate units.
    @param {number} canvasWidth (Optional) The width of the canvas in px.
    @param {bool} preserveCanvasSize (Optional) If true, do not resize the canvas to match the coordinate ratio.
*/
PrairieDraw.prototype.setUnits = function(xSize, ySize, canvasWidth, preserveCanvasSize) {
    this.resetDrawing();
    this.save();
    if (canvasWidth !== undefined) {
        var canvasHeight = Math.floor(ySize / xSize * canvasWidth);
        if ((this._width != canvasWidth) || (this._height != canvasHeight)) {
            this._canvas.width = canvasWidth;
            this._canvas.height = canvasHeight;
            this._width = canvasWidth;
            this._height = canvasHeight;
        }
        preserveCanvasSize = true;
    }
    var xScale = this._width / xSize;
    var yScale = this._height / ySize
    if (xScale < yScale) {
        /** @private */ this._scale = xScale;
        if ((!preserveCanvasSize) && (xScale != yScale)) {
            var newHeight = xScale * ySize;
            this._canvas.height = newHeight;
            this._height = newHeight;
        }
        this.translate($V([this._width / 2, this._height / 2]));
        this.scale($V([1, -1]));
        this.scale($V([xScale, xScale]));
    } else {
        /** @private */ this._scale = yScale;
        if ((!preserveCanvasSize) && (xScale != yScale)) {
            var newWidth = yScale * xSize;
            this._canvas.width = newWidth;
            this._width = newWidth;
        }
        this.translate($V([this._width / 2, this._height / 2]));
        this.scale($V([1, -1]));
        this.scale($V([yScale, yScale]));
    }
}

/*****************************************************************************/

/** Compute the sup-norm of a vector.

    @param {Vector} The vector to find the norm of.
    @return {number} The sup-norm.
*/
PrairieDraw.prototype.supNorm = function(vector) {
    return Math.abs(vector.max());
};

/** Create a 2D unit vector pointing at a given angle.

    @param {number} angle The counterclockwise angle from the positive x axis (radians).
    @return {Vector} A unit vector in direction angle.
*/
PrairieDraw.prototype.vector2DAtAngle = function(angle) {
    return $V([Math.cos(angle), Math.sin(angle)]);
}

/** Find the counterclockwise angle of the vector from the x axis.

    @param {Vector} vec The vector to find the angle of.
    @return {number} The counterclockwise angle of vec from the x axis.
*/
PrairieDraw.prototype.angleOf = function(vec) {
    var a = Math.atan2(vec.e(2), vec.e(1));
    if (a < 0) {
        a = a + 2 * Math.PI;
    }
    return a;
}

/** Find the counterclockwise angle from the vector vFrom to the vector vTo.

    @param {Vector} vFrom The starting vector.
    @param {Vector} vTo The ending vector.
    @return {number} The counterclockwise angle from vFrom to vTo.
*/
PrairieDraw.prototype.angleFrom = function(vFrom, vTo) {
    return this.angleOf(vTo) - this.angleOf(vFrom);
};

/** Return the sign of the argument.

    @param {number} x The argument to find the sign of.
    @return {number} Either -1/0/+1 if x is negative/zero/positive.
*/
PrairieDraw.prototype.sign = function(x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}

/** Linearly interpolate between two numbers.

    @param {number} x0 The first number.
    @param {number} x1 The second number.
    @param {number} alpha The proportion of x1 versus x0 (between 0 and 1).
    @return {number} The quanity (1 - alpha) * x0 + alpha * x1.
*/
PrairieDraw.prototype.linearInterp = function(x0, x1, alpha) {
    return (1 - alpha) * x0 + alpha * x1;
}

/** Linearly interpolate between two states (objects with scalar members).

    @param {Object} s0 The first state.
    @param {Object} s1 The second state.
    @param {number} alpha The proportion of s1 versus s0 (between 0 and 1).
    @return {Object} The state (1 - alpha) * s0 + alpha * s1.
*/
PrairieDraw.prototype.linearInterpState = function(s0, s1, alpha) {
    var newState = {};
    for (e in s0) {
        newState[e] = this.linearInterp(s0[e], s1[e], alpha);
    }
    return newState;
}

/** Duplicate a state (object with scalar membes).

    @param {Object} state The state to duplicate.
    @return {number} A copy of the state.
*/
PrairieDraw.prototype.dupState = function(state) {
    var newState = {};
    for (e in state) {
        newState[e] = state[e];
    }
    return newState;
}

/*****************************************************************************/

/** Draw a point.

    @param {Vector} posDw Position of the point (drawing coords).
*/
PrairieDraw.prototype.point = function(posDw) {
    var posPx = this.pos2Px(posDw);
    this._ctx.beginPath();
    this._ctx.arc(posPx.e(1), posPx.e(2), this._props.pointRadiusPx, 0, 2 * Math.PI);
    this._ctx.fillStyle = this._props.shapeOutlineColor;
    this._ctx.fill();
}

/*****************************************************************************/

/** @private Set the stroke/fill styles for drawing lines.

    @param {string} type The type of line being drawn.
*/
PrairieDraw.prototype._setLineStyles = function(type) {
    var col = this._getColorProp(type);
    this._ctx.strokeStyle = col;
    this._ctx.fillStyle = col;
}

/** Return the dash array for the given line pattern.

    @param {string} type The type of the dash pattern ('solid', 'dashed', 'dotted').
    @return {Array} The numerical array of dash segment lengths.
*/
PrairieDraw.prototype._dashPattern = function(type) {
    if (type === 'solid') {
        return [];
    } else if (type === 'dashed') {
        return [6, 6];
    } else if (type === 'dotted') {
        return [2, 2];
    } else {
        throw new Error("PrairieDraw: unknown dash pattern: " + type);
    }
};

/** Draw a single line given start and end positions.

    @param {Vector} startDw Initial point of the line (drawing coords).
    @param {Vector} endDw Final point of the line (drawing coords).
    @param {string} type Optional type of line being drawn.
*/
PrairieDraw.prototype.line = function(startDw, endDw, type) {
    var startPx = this.pos2Px(startDw);
    var endPx = this.pos2Px(endDw);
    this._ctx.save();
    this._setLineStyles(type);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.beginPath();
    this._ctx.moveTo(startPx.e(1), startPx.e(2));
    this._ctx.lineTo(endPx.e(1), endPx.e(2));
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** @private Draw an arrowhead.

    @param {Vector} posDw Position of the tip (drawing coords).
    @param {Vector} dirDw Direction vector that the arrowhead point in (drawing coords).
    @param {number} lenPx Length of the arrowhead (pixel coords).
*/
PrairieDraw.prototype._arrowhead = function(posDw, dirDw, lenPx) {
    var posPx = this.pos2Px(posDw);
    var dirPx = this.vec2Px(dirDw);
    var dxPx = - (1 - this._props.arrowheadOffsetRatio) * lenPx;
    var dyPx = this._props.arrowheadWidthRatio * lenPx;
    
    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(dirPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(-lenPx, dyPx);
    this._ctx.lineTo(dxPx, 0);
    this._ctx.lineTo(-lenPx, -dyPx);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
}

/** Draw an arrow given start and end positions.

    @param {Vector} startDw Initial point of the arrow (drawing coords).
    @param {Vector} endDw Final point of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrow = function(startDw, endDw, type) {
    var offsetDw = endDw.subtract(startDw);
    var offsetPx = this.vec2Px(offsetDw);
    var arrowLengthPx = offsetPx.modulus();
    var lineEndDw, drawArrowHead, arrowheadLengthPx;
    if (arrowLengthPx < 1) {
        // if too short, just draw a simple line
        lineEndDw = endDw;
        drawArrowHead = false;
    } else {
        var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
        arrowheadLengthPx = Math.min(arrowheadMaxLengthPx, arrowLengthPx / 2);
        var arrowheadCenterLengthPx = (1 - this._props.arrowheadOffsetRatio) * arrowheadLengthPx;
        var lineLengthPx = arrowLengthPx - arrowheadCenterLengthPx;
        lineEndDw = startDw.add(offsetDw.x(lineLengthPx / arrowLengthPx));
        drawArrowHead = true;
    }

    var startPx = this.pos2Px(startDw);
    var lineEndPx = this.pos2Px(lineEndDw);
    this.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.arrowLinePattern));
    this._setLineStyles(type);
    this._ctx.beginPath();
    this._ctx.moveTo(startPx.e(1), startPx.e(2));
    this._ctx.lineTo(lineEndPx.e(1), lineEndPx.e(2));
    this._ctx.stroke();
    if (drawArrowHead) {
        this._arrowhead(endDw, offsetDw, arrowheadLengthPx);
    }
    this.restore();
}

/** Draw an arrow given the start position and offset.

    @param {Vector} startDw Initial point of the arrow (drawing coords).
    @param {Vector} offsetDw Offset vector of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowFrom = function(startDw, offsetDw, type) {
    var endDw = startDw.add(offsetDw);
    this.arrow(startDw, endDw, type);
}

/** Draw an arrow given the end position and offset.

    @param {Vector} endDw Final point of the arrow (drawing coords).
    @param {Vector} offsetDw Offset vector of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowTo = function(endDw, offsetDw, type) {
    var startDw = endDw.subtract(offsetDw);
    this.arrow(startDw, endDw, type);
}

/*****************************************************************************/

/** Draw a circle arrow by specifying the center and extent.

    @param {Vector} posDw The center of the circle arrow.
    @param {number} radDw The radius at the mid-angle.
    @param {number} centerAngleDw The center angle (counterclockwise from x axis, in radians).
    @param {number} extentAngleDw The extent of the arrow (counterclockwise, in radians).
    @param {string} type (Optional) The type of the arrow.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype.circleArrowCentered = function(posDw, radDw, centerAngleDw, extentAngleDw, type, fixedRad) {
    var startAngleDw = centerAngleDw - extentAngleDw / 2;
    var endAngleDw = centerAngleDw + extentAngleDw / 2;
    this.circleArrow(posDw, radDw, startAngleDw, endAngleDw, type, fixedRad)
}

/** Draw a circle arrow.

    @param {Vector} posDw The center of the circle arrow.
    @param {number} radDw The radius at the mid-angle.
    @param {number} startAngleDw The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAngleDw The ending angle (counterclockwise from x axis, in radians).
    @param {string} type (Optional) The type of the arrow.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype.circleArrow = function(posDw, radDw, startAngleDw, endAngleDw, type, fixedRad) {
    this.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.arrowLinePattern));
    this._setLineStyles(type);

    // convert to Px coordinates
    var startOffsetDw = this.vector2DAtAngle(startAngleDw).x(radDw);
    var posPx = this.pos2Px(posDw);
    var startOffsetPx = this.vec2Px(startOffsetDw);
    var radiusPx = startOffsetPx.modulus();
    var startAnglePx = this.angleOf(startOffsetPx);
    var deltaAngleDw = endAngleDw - startAngleDw;
    // assume a possibly reflected/rotated but equally scaled Dw/Px transformation
    var deltaAnglePx = this._transIsReflection() ? (- deltaAngleDw) : deltaAngleDw;
    var endAnglePx = startAnglePx + deltaAnglePx;

    // compute arrowhead properties
    var startRadiusPx = this._circleArrowRadius(radiusPx, startAnglePx, startAnglePx, endAnglePx, fixedRad);
    var endRadiusPx = this._circleArrowRadius(radiusPx, endAnglePx, startAnglePx, endAnglePx, fixedRad);
    var arrowLengthPx = radiusPx * Math.abs(endAnglePx - startAnglePx);
    var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
    var arrowheadLengthPx = Math.min(arrowheadMaxLengthPx, arrowLengthPx / 2);
    var arrowheadCenterLengthPx = (1 - this._props.arrowheadOffsetRatio) * arrowheadLengthPx;
    var arrowheadExtraCenterLengthPx = (1 - this._props.arrowheadOffsetRatio / 3) * arrowheadLengthPx;
    var arrowheadAnglePx = arrowheadCenterLengthPx / endRadiusPx;
    var arrowheadExtraAnglePx = arrowheadExtraCenterLengthPx / endRadiusPx;
    var preEndAnglePx = endAnglePx - this.sign(endAnglePx - startAnglePx) * arrowheadAnglePx;
    var arrowBaseAnglePx = endAnglePx - this.sign(endAnglePx - startAnglePx) * arrowheadExtraAnglePx;

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    var idealSegmentSize = 0.2; // radians
    var numSegments = Math.ceil(Math.abs(preEndAnglePx - startAnglePx) / idealSegmentSize);
    var i, anglePx, rPx;
    var offsetPx = this.vector2DAtAngle(startAnglePx).x(startRadiusPx);
    this._ctx.beginPath();
    this._ctx.moveTo(offsetPx.e(1), offsetPx.e(2));
    for (i = 1; i <= numSegments; i++) {
        anglePx = this.linearInterp(startAnglePx, preEndAnglePx, i / numSegments);
        rPx = this._circleArrowRadius(radiusPx, anglePx, startAnglePx, endAnglePx, fixedRad);
        offsetPx = this.vector2DAtAngle(anglePx).x(rPx);
        this._ctx.lineTo(offsetPx.e(1), offsetPx.e(2));
    }
    this._ctx.stroke();
    this._ctx.restore();

    var arrowBaseRadiusPx = this._circleArrowRadius(radiusPx, arrowBaseAnglePx, startAnglePx, endAnglePx, fixedRad);
    var arrowPosPx = posPx.add(this.vector2DAtAngle(endAnglePx).x(endRadiusPx));
    var arrowBasePosPx = posPx.add(this.vector2DAtAngle(arrowBaseAnglePx).x(arrowBaseRadiusPx));
    var arrowDirPx = arrowPosPx.subtract(arrowBasePosPx)
    var arrowPosDw = this.pos2Dw(arrowPosPx);
    var arrowDirDw = this.vec2Dw(arrowDirPx);
    this._arrowhead(arrowPosDw, arrowDirDw, arrowheadLengthPx);

    this.restore();
}

/** @private Compute the radius at a certain angle within a circle arrow.

    @param {number} midRadPx The radius at the midpoint of the circle arrow.
    @param {number} anglePx The angle at which to find the radius.
    @param {number} startAnglePx The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAnglePx The ending angle (counterclockwise from x axis, in radians).
    @return {number} The radius at the given angle (pixel coords).
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype._circleArrowRadius = function(midRadPx, anglePx, startAnglePx, endAnglePx, fixedRad) {
    if (fixedRad !== undefined && fixedRad === true) {
        return midRadPx;
    }
    if (Math.abs(endAnglePx - startAnglePx) < 1e-4) {
        return midRadPx;
    }
    var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
    var spacingPx = arrowheadMaxLengthPx * this._props.arrowheadWidthRatio
        * this._props.circleArrowWrapOffsetRatio;
    var circleArrowWrapDensity = midRadPx * Math.PI * 2 / spacingPx;
    var midAnglePx = (startAnglePx + endAnglePx) / 2;
    var offsetAnglePx = (anglePx - midAnglePx) * this.sign(endAnglePx - startAnglePx);
    if (offsetAnglePx > 0) {
        return midRadPx * (1 + offsetAnglePx / circleArrowWrapDensity);
    } else {
        return midRadPx * Math.exp(offsetAnglePx / circleArrowWrapDensity);
    }
}

/*****************************************************************************/

/** Draw an arc.

    @param {Vector} centerDw The center of the circle.
    @param {Vector} radiusDw The radius of the circle.
    @param {number} startAngle The start angle of the arc (radians).
    @param {number} endAngle The end angle of the arc (radians).
*/
PrairieDraw.prototype.arc = function(centerDw, radiusDw, startAngle, endAngle) {
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();
    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1), centerPx.e(2), radiusPx, startAngle, endAngle);
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a polyLine (closed or open).

    @param {Array} pointsDw A list of drawing coordinates that form the polyLine.
    @param {bool} closed (Optional) Whether the shape should be closed (default: false).
    @param {bool} filled (Optional) Whether the shape should be filled (default: true).
*/
PrairieDraw.prototype.polyLine = function(pointsDw, closed, filled) {
    if (pointsDw.length < 2) {
        return;
    }
    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;

    this._ctx.beginPath();
    var pDw = pointsDw[0];
    var pPx = this.pos2Px(pDw);
    this._ctx.moveTo(pPx.e(1), pPx.e(2));
    for (var i = 1; i < pointsDw.length; i++) {
        pDw = pointsDw[i];
        pPx = this.pos2Px(pDw);
        this._ctx.lineTo(pPx.e(1), pPx.e(2));
    }
    if (closed !== undefined && closed === true) {
        this._ctx.closePath();
        if (filled === undefined || filled === true) {
            this._ctx.fill();
        }
    }
    this._ctx.stroke();
    this._ctx.restore();
}

/** Covert an array of offsets to absolute points.

    @param {Array} offsets A list of offset vectors.
    @return {Array} The corresponding absolute points.
*/
PrairieDraw.prototype.offsets2Points = function(offsets) {
    var points = [];
    if (offsets.length < 1) {
        return;
    }
    points[0] = offsets[0].dup();
    for (var i = 1; i < offsets.length; i++) {
        points[i] = points[i-1].add(offsets[i]);
    }
    return points;
}

/** Rotate a list of points by a given angle.

    @param {Array} points A list of points.
    @param {number} angle The angle to rotate by (radians, counterclockwise).
    @return {Array} A list of rotated points.
*/
PrairieDraw.prototype.rotatePoints = function(points, angle) {
    var rotM = Matrix.RotationZ(angle);
    var newPoints = [], p;
    for (var i = 0; i < points.length; i++) {
        p = rotM.x($V([points[i].e(1), points[i].e(2), 0]));
                newPoints.push($V([p.e(1), p.e(2)]));
    }
    return newPoints;
}

/** Translate a list of points by a given offset.

    @param {Array} points A list of points.
    @param {Vector} offset The offset to translate by.
    @return {Array} A list of translated points.
*/
PrairieDraw.prototype.translatePoints = function(points, offset) {
    var newPoints = [];
    for (var i = 0; i < points.length; i++) {
        newPoints.push(points[i].add(offset));
    }
    return newPoints;
}

/** Scale a list of points by given horizontal and vertical factors.

    @param {Array} points A list of points.
    @param {Vector} scale The scale in each component.
    @return {Array} A list of scaled points.
*/
PrairieDraw.prototype.scalePoints = function(points, scale) {
    var newPoints = [], p;
    for (var i = 0; i < points.length; i++) {
        p = $V([points[i].e(1) * scale.e(1), points[i].e(2) * scale.e(2)]);
        newPoints.push(p);
    }
    return newPoints;
}

/** Print a list of points to the console as an array of vectors.

    @param {string} name The name of the array.
    @param {Array} points A list of points.
    @param {number} numDecPlaces The number of decimal places to print.
*/
PrairieDraw.prototype.printPoints = function(name, points, numDecPlaces) {
    console.log(name + ": [");
    for (var i = 0; i < points.length; i++) {
        console.log("$V([" + points[i].e(1).toFixed(numDecPlaces)
                    + ", " + points[i].e(2).toFixed(numDecPlaces)
                    + "]),");
    }
    console.log("],");
}

/*****************************************************************************/

/** Draw a circle.

    @param {Vector} centerDw The center in drawing coords.
    @param {number} radiusDw the radius in drawing coords.
*/
PrairieDraw.prototype.circle = function(centerDw, radiusDw) {
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();

    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1),centerPx.e(2), radiusPx, 0, 2 * Math.PI);
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a filled circle.

    @param {Vector} centerDw The center in drawing coords.
    @param {number} radiusDw the radius in drawing coords.
*/
PrairieDraw.prototype.filledCircle = function(centerDw, radiusDw) {
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();

    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.fillStyle = this._props.shapeOutlineColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1),centerPx.e(2), radiusPx, 0, 2 * Math.PI);
    this._ctx.fill();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a rod with hinge points at start and end and the given width.

    @param {Vector} startDw The first hinge point (center of circular end) in drawing coordinates.
    @param {Vector} startDw The second hinge point (drawing coordinates).
    @param {number} widthDw The width of the rod (drawing coordinates).
*/
PrairieDraw.prototype.rod = function(startDw, endDw, widthDw) {
    var offsetLengthDw = endDw.subtract(startDw);
    var offsetWidthDw = offsetLengthDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(widthDw);

    var startPx = this.pos2Px(startDw);
    var offsetLengthPx = this.vec2Px(offsetLengthDw);
    var offsetWidthPx = this.vec2Px(offsetWidthDw);
    var lengthPx = offsetLengthPx.modulus();
    var rPx = offsetWidthPx.modulus() / 2;

    this._ctx.save();
    this._ctx.translate(startPx.e(1), startPx.e(2));
    this._ctx.rotate(this.angleOf(offsetLengthPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, rPx);
    this._ctx.arcTo(lengthPx + rPx, rPx, lengthPx + rPx, -rPx, rPx);
    this._ctx.arcTo(lengthPx + rPx, -rPx, 0, -rPx, rPx);
    this._ctx.arcTo(-rPx, -rPx, -rPx, rPx, rPx);
    this._ctx.arcTo(-rPx, rPx, 0, rPx, rPx);
    if (this._props.shapeInsideColor !== "none") {
        this._ctx.fillStyle = this._props.shapeInsideColor;
        this._ctx.fill();
    }
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a pivot.

    @param {Vector} baseDw The center of the base (drawing coordinates).
    @param {Vector} hingeDw The hinge point (center of circular end) in drawing coordinates.
    @param {number} widthDw The width of the pivot (drawing coordinates).
*/
PrairieDraw.prototype.pivot = function(baseDw, hingeDw, widthDw) {
    var offsetLengthDw = hingeDw.subtract(baseDw);
    var offsetWidthDw = offsetLengthDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(widthDw);

    var basePx = this.pos2Px(baseDw);
    var offsetLengthPx = this.vec2Px(offsetLengthDw);
    var offsetWidthPx = this.vec2Px(offsetWidthDw);
    var lengthPx = offsetLengthPx.modulus();
    var rPx = offsetWidthPx.modulus() / 2;

    this._ctx.save();
    this._ctx.translate(basePx.e(1), basePx.e(2));
    this._ctx.rotate(this.angleOf(offsetLengthPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, rPx);
    this._ctx.arcTo(lengthPx + rPx, rPx, lengthPx + rPx, -rPx, rPx);
    this._ctx.arcTo(lengthPx + rPx, -rPx, 0, -rPx, rPx);
    this._ctx.lineTo(0, -rPx);
    this._ctx.closePath();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a square with a given base point and center.

    @param {Vector} baseDw The mid-point of the base (drawing coordinates).
    @param {Vector} centerDw The center of the square (drawing coordinates).
*/
PrairieDraw.prototype.square = function(baseDw, centerDw) {
    var basePx = this.pos2Px(baseDw);
    var centerPx = this.pos2Px(centerDw);
    var offsetPx = centerPx.subtract(basePx);
    var rPx = offsetPx.modulus();
    this._ctx.save();
    this._ctx.translate(basePx.e(1), basePx.e(2));
    this._ctx.rotate(this.angleOf(offsetPx));
    this._ctx.beginPath();
    this._ctx.rect(0, -rPx, 2 * rPx, 2 * rPx);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw an axis-aligned rectangle with a given width and height, centered at the origin.

    @param {number} widthDw The width of the rectangle.
    @param {number} heightDw The height of the rectangle.
*/
PrairieDraw.prototype.rectangle = function(widthDw, heightDw) {
    var pointsDw = [
        $V([-widthDw / 2, -heightDw / 2]),
        $V([ widthDw / 2, -heightDw / 2]),
        $V([ widthDw / 2,  heightDw / 2]),
        $V([-widthDw / 2,  heightDw / 2])
    ];
    var closed = true;
    this.polyLine(pointsDw, closed);
}

/** Draw a ground element.

    @param {Vector} posDw The position of the ground center (drawing coordinates).
    @param {Vector} normDw The outward normal (drawing coordinates).
    @param (number} lengthDw The total length of the ground segment.
*/
PrairieDraw.prototype.ground = function(posDw, normDw, lengthDw) {
    var tangentDw = normDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(lengthDw);
    var posPx = this.pos2Px(posDw);
    var normPx = this.vec2Px(normDw);
    var tangentPx = this.vec2Px(tangentDw);
    var lengthPx = tangentPx.modulus();
    var groundDepthPx = Math.min(lengthPx, this._props.groundDepthPx);

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(normPx) - Math.PI/2);
    this._ctx.beginPath();
    this._ctx.rect(-lengthPx / 2, -groundDepthPx,
                   lengthPx, groundDepthPx);
    this._ctx.fillStyle = this._props.groundInsideColor;
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.moveTo(- lengthPx / 2, 0);
    this._ctx.lineTo(lengthPx / 2, 0);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.groundOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a ground element with hashed shading.

    @param {Vector} posDw The position of the ground center (drawing coords).
    @param {Vector} normDw The outward normal (drawing coords).
    @param (number} lengthDw The total length of the ground segment (drawing coords).
    @param {number} offsetDw (Optional) The offset of the shading (drawing coords).
*/
PrairieDraw.prototype.groundHashed = function(posDw, normDw, lengthDw, offsetDw) {
    var tangentDw = normDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(lengthDw);
    var offsetVecDw = tangentDw.toUnitVector().x(offsetDw);
    var posPx = this.pos2Px(posDw);
    var normPx = this.vec2Px(normDw);
    var tangentPx = this.vec2Px(tangentDw);
    var lengthPx = tangentPx.modulus();
    var offsetVecPx = this.vec2Px(offsetVecDw);
    var offsetPx = offsetVecPx.modulus() * this.sign(offsetDw);

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(normPx) + Math.PI/2);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.groundOutlineColor;

    this._ctx.beginPath();
    this._ctx.moveTo(- lengthPx / 2, 0);
    this._ctx.lineTo(lengthPx / 2, 0);
    this._ctx.stroke();

    var startX = offsetPx % this._props.groundSpacingPx;
    var x = startX;
    while (x < lengthPx / 2) {
        this._ctx.beginPath();
        this._ctx.moveTo(x, 0);
        this._ctx.lineTo(x - this._props.groundWidthPx, this._props.groundDepthPx);
        this._ctx.stroke();
        x += this._props.groundSpacingPx;
    }
    x = startX - this._props.groundSpacingPx;
    while (x > -lengthPx / 2) {
        this._ctx.beginPath();
        this._ctx.moveTo(x, 0);
        this._ctx.lineTo(x - this._props.groundWidthPx, this._props.groundDepthPx);
        this._ctx.stroke();
        x -= this._props.groundSpacingPx;
    }

    this._ctx.restore();
}

/** Draw a center-of-mass object.

    @param {Vector} posDw The position of the center of mass.
*/
PrairieDraw.prototype.centerOfMass = function(posDw) {
    var posPx = this.pos2Px(posDw);
    var r = this._props.centerOfMassRadiusPx;
    this._ctx.save();
    this._ctx.lineWidth = this._props.centerOfMassStrokeWidthPx;
    this._ctx.strokeStyle = this._props.centerOfMassColor;
    this._ctx.translate(posPx.e(1), posPx.e(2));

    this._ctx.beginPath();
    this._ctx.moveTo(-r, 0);
    this._ctx.lineTo(r, 0);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(0, -r);
    this._ctx.lineTo(0, r);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.arc(0, 0, r, 0, 2 * Math.PI);
    this._ctx.stroke();

    this._ctx.restore();
}

/** Draw a measurement line.

    @param {Vector} startDw The start position of the measurement.
    @param {Vector} endDw The end position of the measurement.
    @param {string} text The measurement label.
*/
PrairieDraw.prototype.measurement = function(startDw, endDw, text) {
    var startPx = this.pos2Px(startDw);
    var endPx = this.pos2Px(endDw);
    var offsetPx = endPx.subtract(startPx);
    var d = offsetPx.modulus();
    var h = this._props.measurementEndLengthPx;
    var o = this._props.measurementOffsetPx;
    this._ctx.save();
    this._ctx.lineWidth = this._props.measurementStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.measurementStrokePattern));
    this._ctx.strokeStyle = this._props.measurementColor;
    this._ctx.translate(startPx.e(1), startPx.e(2));
    this._ctx.rotate(this.angleOf(offsetPx));

    this._ctx.beginPath();
    this._ctx.moveTo(0, o);
    this._ctx.lineTo(0, o + h);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(d, o);
    this._ctx.lineTo(d, o + h);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(0, o + h / 2);
    this._ctx.lineTo(d, o + h / 2);
    this._ctx.stroke();

    this._ctx.restore();

    var orthPx = offsetPx.rotate(-Math.PI/2, $V([0, 0])).toUnitVector().x(-o - h/2);
    var lineStartPx = startPx.add(orthPx);
    var lineEndPx = endPx.add(orthPx);
    var lineStartDw = this.pos2Dw(lineStartPx);
    var lineEndDw = this.pos2Dw(lineEndPx);
    this.labelLine(lineStartDw, lineEndDw, $V([0, -1]), text);
}

/*****************************************************************************/

/** Draw text.

    @param {Vector} posDw The position to draw at.
    @param {Vector} anchor The anchor on the text that will be located at pos (in -1 to 1 local coordinates).
    @param {string} text The text to draw. If text begins with "TEX:" then it is interpreted as LaTeX.
    @param {bool} boxed (Optional) Whether to draw a white box behind the text (default: false).
*/
PrairieDraw.prototype.text = function(posDw, anchor, text, boxed) {
    var posPx = this.pos2Px(posDw);
    if (text.slice(0,4) == "TEX:") {
        var tex_text = text.slice(4);
        var hash = Sha1.hash(tex_text);
        this._texts = this._texts || {};
        if (hash in this._texts) {
            var img = this._texts[hash];
            var xPx =  - (anchor.e(1) + 1) / 2 * img.width;
            var yPx = (anchor.e(2) - 1) / 2 * img.height;
            //var offsetPx = anchor.toUnitVector().x(Math.abs(anchor.max()) * this._props.textOffsetPx);
            var offsetPx = anchor.x(this._props.textOffsetPx);
            var textBorderPx = 5;
            this._ctx.save();
            this._ctx.translate(posPx.e(1), posPx.e(2));
            if (boxed !== undefined && boxed === true) {
                this._ctx.save();
                this._ctx.fillStyle = "white";
                this._ctx.fillRect(xPx - offsetPx.e(1) - textBorderPx,
                                   yPx + offsetPx.e(2) - textBorderPx,
                                   img.width + 2 * textBorderPx,
                                   img.height + 2 * textBorderPx);
                this._ctx.restore();
            }
            this._ctx.drawImage(img, xPx - offsetPx.e(1), yPx + offsetPx.e(2));
            this._ctx.restore();
        } else {
            var imgSrc = "text/" + hash + ".png";
            var img = new Image();
            img.onload = this.redraw.bind(this);
            img.src = imgSrc;
            this._texts[hash] = img;
        }
    } else {
        var align, baseline;
        switch (this.sign(anchor.e(1))) {
        case -1: align = "left"; break;
        case  0: align = "center"; break;
        case  1: align = "right"; break;
        }
        switch (this.sign(anchor.e(2))) {
        case -1: baseline = "bottom"; break;
        case  0: baseline = "middle"; break;
        case  1: baseline = "top"; break;
        }
        this._ctx.save();
        this._ctx.textAlign = align;
        this._ctx.textBaseline = baseline;
        this._ctx.translate(posPx.e(1), posPx.e(2));
        var offsetPx = anchor.toUnitVector().x(Math.abs(anchor.max()) * this._props.textOffsetPx);
        this._ctx.fillText(text, - offsetPx.e(1), offsetPx.e(2));
        this._ctx.restore();
    }
}

/** Draw text to label a line.

    @param {Vector} startDw The start position of the line.
    @param {Vector} endDw The end position of the line.
    @param {Vector} pos The position relative to the line (-1 to 1 local coordinates, x along the line, y orthogonal).
    @param {string} text The text to draw.
*/
PrairieDraw.prototype.labelLine = function(startDw, endDw, pos, text) {
    var midpointDw = (startDw.add(endDw)).x(0.5);
    var offsetDw = endDw.subtract(startDw).x(0.5);
    var pDw = midpointDw.add(offsetDw.x(pos.e(1)));
    var u1Dw = offsetDw.toUnitVector();
    var u2Dw = u1Dw.rotate(Math.PI/2, $V([0,0]));
    var oDw = u1Dw.x(pos.e(1)).add(u2Dw.x(pos.e(2)));
    var a = oDw.x(-1).toUnitVector().x(Math.abs(pos.max()));
    this.text(pDw, a, text);
}

/** Draw text to label a circle line.

    @param {Vector} posDw The center of the circle line.
    @param {number} radDw The radius at the mid-angle.
    @param {number} startAngleDw The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAngleDw The ending angle (counterclockwise from x axis, in radians).
    @param {Vector} pos The position relative to the line (-1 to 1 local coordinates, x along the line, y orthogonal).
    @param {string} text The text to draw.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype.labelCircleLine = function(posDw, radDw, startAngleDw, endAngleDw, pos, text, fixedRad) {
    // convert to Px coordinates
    var startOffsetDw = this.vector2DAtAngle(startAngleDw).x(radDw);
    var posPx = this.pos2Px(posDw);
    var startOffsetPx = this.vec2Px(startOffsetDw);
    var radiusPx = startOffsetPx.modulus();
    var startAnglePx = this.angleOf(startOffsetPx);
    var deltaAngleDw = endAngleDw - startAngleDw;
    // assume a possibly reflected/rotated but equally scaled Dw/Px transformation
    var deltaAnglePx = this._transIsReflection() ? (- deltaAngleDw) : deltaAngleDw;
    var endAnglePx = startAnglePx + deltaAnglePx;

    var textAnglePx = (1.0 - pos.e(1)) / 2.0 * startAnglePx + (1.0 + pos.e(1)) / 2.0 * endAnglePx;
    var u1Px = this.vector2DAtAngle(textAnglePx);
    var u2Px = u1Px.rotate(Math.PI / 2, $V([0, 0]));
    var oPx = u1Px.x(pos.e(2)).add(u2Px.x(pos.e(1)));
    var oDw = this.vec2Dw(oPx);
    var aDw = oDw.x(-1).toUnitVector();
    var a = aDw.x(1.0 / Math.abs(aDw.max())).x(Math.abs(pos.max()));

    var rPx = this._circleArrowRadius(radiusPx, textAnglePx, startAnglePx, endAnglePx, fixedRad);
    var pPx = u1Px.x(rPx).add(posPx);
    var pDw = this.pos2Dw(pPx);
    this.text(pDw, a, text);
};

/** Find the anchor for the intersection of two lines.

    @param {Vector} labelPoint The point to be labeled.
    @param {Array} points The end of the lines that meet at labelPoint.
    @return {Vector} The anchor offset.
*/
PrairieDraw.prototype.findAnchorForIntersection = function(labelPoint, points) {
    // find the angles on the unit circle for each of the lines
    var i, v;
    var angles = [];
    for (i = 0; i < points.length; i++) {
        v = points[i].subtract(labelPoint);
        if (v.modulus() > 1e-6) {
            angles.push(this.angleOf(v));
        }
    }
    if (angles.length == 0) {
        return $V([1, 0]);
    }
    // save the first angle to tie-break later
    var tieBreakAngle = angles[0];

    // find the biggest gap between angles (might be multiple)
    angles.sort(function(a, b) {return (a - b);});
    var maxAngleDiff = angles[0] - angles[angles.length - 1] + 2 * Math.PI;
    var maxIs = [0];
    var angleDiff;
    for (i = 1; i < angles.length; i++) {
        angleDiff = angles[i] - angles[i - 1];
        if (angleDiff > maxAngleDiff - 1e-6) {
            if (angleDiff > maxAngleDiff + 1e-6) {
                // we are clearly greater
                maxAngleDiff = angleDiff;
                maxIs = [i];
            } else {
                // we are basically equal
                maxIs.push(i);
            }
        }
    }

    // tie-break by choosing the first angle CCW from the tieBreakAngle
    var minCCWDiff = 2 * Math.PI;
    var angle, bestAngle;
    for (i = 0; i < maxIs.length; i++) {
        angle = angles[maxIs[i]] - maxAngleDiff / 2;
        angleDiff = angle - tieBreakAngle;
        if (angleDiff < 0) {
            angleDiff += 2 * Math.PI;
        }
        if (angleDiff < minCCWDiff) {
            minCCWDiff = angleDiff;
            bestAngle = angle;
        }
    }

    // find anchor from bestAngle
    var dir = this.vector2DAtAngle(bestAngle);
    dir = dir.x(1 / this.supNorm(dir));
    return dir.x(-1);
};

/*****************************************************************************/

PrairieDraw.prototype.numDiff = function(f, t) {
    var eps = 1e-4;

    var x0 = f(t - eps);
    var x1 = f(t);
    var x2 = f(t + eps);
    var d = {}
    d.diff = {};
    d.ddiff = {};
    for (e in x0) {
        if (x0[e] instanceof Vector) {
            d[e] = x1[e];
            d.diff[e] = x1[e].subtract(x0[e]).x(1 / eps);
            d.ddiff[e] = x2[e].subtract(x1[e].x(2)).add(x0[e]).x(1 / (eps * eps));
        } else {
            d[e] = x1[e];
            d.diff[e] = (x1[e] - x0[e]) / eps;
            d.ddiff[e] = (x2[e] - 2 * x1[e] + x0[e]) / (eps * eps);
        }
    }
    return d;
};

/*****************************************************************************/

PrairieDraw.prototype.clearHistory = function(name) {
    if (name in this._history) {
        delete this._history[name];
    }
}

PrairieDraw.prototype.clearAllHistory = function() {
    this._history = {};
}

/** Save the history of a data value.

    @param {string} name The history variable name.
    @param {number} dt The time resolution to save at.
    @param {number} maxTime The maximum age of history to save.
    @param {number} curTime The current time.
    @param {object} curValue The current data value.
    @return {Array} A history array of vectors of the form [time, value].
*/
PrairieDraw.prototype.history = function(name, dt, maxTime, curTime, curValue) {
    if (!(name in this._history)) {
        this._history[name] = [[curTime, curValue]];
    } else {
        var h = this._history[name];
        if (h.length < 2) {
            h.push([curTime, curValue]);
        } else {
            var prevPrevTime = h[h.length - 2][0];
            if (curTime - prevPrevTime < dt) {
                // new time jump will still be short, replace the last record
                h[h.length - 1] = [curTime, curValue];
            } else {
                // new time jump would be too long, just add the new record
                h.push([curTime, curValue]);
            }
        }

        // discard old values as necessary
        var i = 0;
        while ((curTime - h[i][0] > maxTime) && (i < h.length - 1)) {
            i++;
        }
        if (i > 0) {
            this._history[name] = h.slice(i);
        }
    }
    return this._history[name];
};

PrairieDraw.prototype.pairsToVectors = function(pairArray) {
    var vectorArray = [];
    for (var i = 0; i < pairArray.length; i++) {
        vectorArray.push($V(pairArray[i]));
    }
    return vectorArray;
}

PrairieDraw.prototype.historyToTrace = function(data) {
    var trace = [];
    for (var i = 0; i < data.length; i++) {
        trace.push(data[i][1]);
    }
    return trace;
}

/** Plot a history sequence.

    @param {Vector} originDw The lower-left position of the axes.
    @param {Vector} sizeDw The size of the axes (vector from lower-left to upper-right).
    @param {Vector} sizeData The size of the axes in data coordinates.
    @param {string} yLabel The vertical axis label.
    @param {Array} data An array of [time, value] vectors to plot.
    @param {string} type Optional type of line being drawn.
*/
PrairieDraw.prototype.plotHistory = function(originDw, sizeDw, sizeData, timeOffset, yLabel, data, type) {
    var scale = $V([sizeDw.e(1) / sizeData.e(1), sizeDw.e(2) / sizeData.e(2)]);
    var lastTime = data[data.length - 1][0];
    var offset = $V([timeOffset - lastTime, 0]);
    var plotData = this.scalePoints(this.translatePoints(this.pairsToVectors(data), offset), scale);

    this.save();
    this.translate(originDw);
    this.save();
    this.setProp("arrowLineWidthPx", 1);
    this.setProp("arrowheadLengthRatio", 11);
    this.arrow($V([0, 0]), $V([sizeDw.e(1), 0]));
    this.arrow($V([0, 0]), $V([0, sizeDw.e(2)]));
    this.text($V([sizeDw.e(1), 0]), $V([1, 1.5]), "TEX:$t$");
    this.text($V([0, sizeDw.e(2)]), $V([1.5, 1]), yLabel);
    this.restore();
    var col = this._getColorProp(type);
    this.setProp("shapeOutlineColor", col);
    this.setProp("pointRadiusPx", "4");
    this.save();
    this._ctx.beginPath();
    var bottomLeftPx = this.pos2Px($V([0, 0]));
    var topRightPx = this.pos2Px(sizeDw);
    var offsetPx = topRightPx.subtract(bottomLeftPx);
    this._ctx.rect(bottomLeftPx.e(1), 0, offsetPx.e(1), this._height);
    this._ctx.clip();
    this.polyLine(plotData, false);
    this.restore();
    this.point(plotData[plotData.length - 1]);
    this.restore();
};

/*****************************************************************************/

/** Creates a PrairieDrawAnim object.

    @constructor
    @this {PrairieDraw}
    @param {HTMLCanvasElement or string} canvas The canvas element to draw on or the ID of the canvas elemnt.
    @param {Function} drawfcn An optional function that draws on the canvas at time t.
*/
function PrairieDrawAnim(canvas, drawFcn) {
    PrairieDraw.call(this, canvas, null);
    this._drawTime = 0;
    this._running = false;
    this._sequences = {};
    this._animStateCallbacks = [];
    if (drawFcn) {
        this.draw = drawFcn.bind(this);
    }
    this.draw(0);
}
PrairieDrawAnim.prototype = new PrairieDraw;

/** @private Store the appropriate version of requestAnimationFrame.

    Use this like:
    prairieDraw.requestAnimationFrame.call(window, this.callback.bind(this));

    We can't do prairieDraw.requestAnimationFrame(callback), because
    that would run requestAnimationFrame in the context of prairieDraw
    ("this" would be prairieDraw), and requestAnimationFrame needs
    "this" to be "window".

    We need to pass this.callback.bind(this) as the callback function
    rather than just this.callback as otherwise the callback functions
    is called from "window" context, and we want it to be called from
    the context of our own object.
*/
PrairieDrawAnim.prototype._requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

/** Prototype function to draw on the canvas, should be implemented by children.

    @param {number} t Current animation time in seconds.
*/
PrairieDrawAnim.prototype.draw = function(t) {
}

/** Start the animation.
*/
PrairieDrawAnim.prototype.startAnim = function() {
    if (!this._running) {
        this._running = true;
        this._startFrame = true;
        this._requestAnimationFrame.call(window, this._callback.bind(this));
        for (var i = 0; i < this._animStateCallbacks.length; i++) {
            this._animStateCallbacks[i](true);
        }
    }
}

/** Stop the animation.
*/
PrairieDrawAnim.prototype.stopAnim = function() {
    this._running = false;
    for (var i = 0; i < this._animStateCallbacks.length; i++) {
        this._animStateCallbacks[i](false);
    }
}

/** Toggle the animation.
*/
PrairieDrawAnim.prototype.toggleAnim = function() {
    if (this._running) {
        this.stopAnim();
    } else {
        this.startAnim();
    }
}

/** Register a callback on animation state changes.

    @param {Function} callback The callback(animated) function.
*/
PrairieDrawAnim.prototype.registerAnimCallback = function(callback) {
    this._animStateCallbacks.push(callback);
    callback(this._running);
}

/** @private Callback function to handle the animationFrame events.
*/
PrairieDrawAnim.prototype._callback = function(t_ms) {
    if (this._startFrame) {
        this._startFrame = false;
        this._timeOffset = t_ms - this._drawTime;
    }
    var animTime = t_ms - this._timeOffset;
    this._drawTime = animTime;
    this.draw(animTime / 1000);
    if (this._running) {
        this._requestAnimationFrame.call(window, this._callback.bind(this));
    }
}

/** Redraw the drawing at the current time.
*/
PrairieDrawAnim.prototype.redraw = function() {
    if (!this._running) {
        this.draw(this._drawTime / 1000);
    }
}

/** Reset the animation time to zero.

    @param {bool} redraw (Optional) Whether to redraw (default: true).
*/
PrairieDrawAnim.prototype.resetTime = function(redraw) {
    this._drawTime = 0;
    this._startFrame = true;
    if (redraw === undefined || redraw === true) {
        this.redraw();
    }
}

/** Reset everything to the intial state.
*/
PrairieDrawAnim.prototype.reset = function() {
    for (optionName in this._options) {
        this.resetOptionValue(optionName)
    }
    this._sequences = {};
    this.clearAllHistory();
    this.stopAnim();
    this.resetTime();
}

/** Stop all action and computation.
*/
PrairieDrawAnim.prototype.stop = function() {
    this.stopAnim();
}

/*****************************************************************************/

/** Interpolate between different states in a sequence.

    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} holdTimes Hold times for the corresponding state.
    @param {Array} t Current time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.sequence = function(states, transTimes, holdTimes, t) {
    var totalTime = 0;
    var i;
    for (i = 0; i < states.length; i++) {
        totalTime += transTimes[i];
        totalTime += holdTimes[i];
    }
    var ts = t % totalTime;
    totalTime = 0;
    var state = {};
    var e, ip;
    var lastTotalTime = 0;
    for (i = 0; i < states.length; i++) {
        ip = i == states.length - 1 ? 0 : i + 1;
        totalTime += transTimes[i];
        if (totalTime > ts) {
            // in transition from i to i+1
            state.t = ts - lastTotalTime;
            state.index = i;
            state.alpha = state.t / (totalTime - lastTotalTime);
            for (e in states[i]) {
                state[e] = this.linearInterp(states[i][e], states[ip][e], state.alpha);
            }
            return state;
        }
        lastTotalTime = totalTime;
        totalTime += holdTimes[i];
        if (totalTime > ts) {
            // holding at i+1
            state.t = 0;
            state.index = ip;
            state.alpha = 0;
            for (e in states[i]) {
                state[e] = states[ip][e];
            }
            return state;
        }
        lastTotalTime = totalTime;
    }
}

/*****************************************************************************/

/** Interpolate between different states in a sequence under external prompting.

    @param {string} name Name of this transition sequence.
    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} t Current animation time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.controlSequence = function(name, states, transTimes, t) {
    if (!(name in this._sequences)) {
        this._sequences[name] = {
            index: 0,
            inTransition: false,
            startTransition: false,
            indefiniteHold: true,
            callbacks: []
        };
    }
    var seq = this._sequences[name];
    var state;
    var transTime = 0;
    if (seq.startTransition) {
        seq.startTransition = false;
        seq.inTransition = true;
        seq.indefiniteHold = false;
        seq.startTime = t;
    }
    if (seq.inTransition) {
        transTime = t - seq.startTime;
    }
    if ((seq.inTransition) && (transTime >= transTimes[seq.index])) {
        seq.inTransition = false;
        seq.indefiniteHold = true;
        seq.index = (seq.index + 1) % states.length;
        delete seq.startTime;
    }
    if (!seq.inTransition) {
        state = this.dupState(states[seq.index]);
        state.index = seq.index;
        state.t = 0;
        state.alpha = 0;
        state.inTransition = false;
        return state;
    }
    var alpha = transTime / transTimes[seq.index];
    var nextIndex = (seq.index + 1) % states.length;
    state = this.linearInterpState(states[seq.index], states[nextIndex], alpha);
    state.t = transTime;
    state.index = seq.index;
    state.alpha = alpha;
    state.inTransition = true;
    return state;
}

/** Start the next transition for the given sequence.

    @param {string} name Name of the sequence to transition.
*/
PrairieDrawAnim.prototype.stepSequence = function(name) {
    if (!(name in this._sequences)) {
        throw new Error("PrairieDraw: unknown sequence: " + name);
    }
    var seq = this._sequences[name];
    if (!seq.lastState.indefiniteHold) {
        return;
    }
    seq.startTransition = true;
    this.startAnim();
}

/*****************************************************************************/

/** Interpolate between different states (new version).

    @param {string} name Name of this transition sequence.
    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} holdtimes Hold times for each state. A negative value means to hold until externally triggered.
    @param {Array} t Current animation time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.newSequence = function(name, states, transTimes, holdTimes, interps, names, t) {
    var seq = this._sequences[name];
    if (seq === undefined) {
        this._sequences[name] = {
            startTransition: false,
            lastState: {},
            callbacks: []
        };
        seq = this._sequences[name];
        for (var e in states[0]) {
            if (typeof states[0][e] === "number") {
                seq.lastState[e] = states[0][e];
            } else if (typeof states[0][e] === "function") {
                seq.lastState[e] = states[0][e](null, 0);
            }
        }
        seq.lastState.inTransition = false,
        seq.lastState.indefiniteHold = false,
        seq.lastState.index = 0;
        seq.lastState.name = names[seq.lastState.index];
        seq.lastState.t = t;
        if (holdTimes[0] < 0) {
            seq.lastState.indefiniteHold = true;
        }
    }
    if (seq.startTransition) {
        seq.startTransition = false;
        seq.lastState.inTransition = true;
        seq.lastState.indefiniteHold = false;
        seq.lastState.t = t;
        for (var i = 0; i < seq.callbacks.length; i++) {
            seq.callbacks[i]("exit", seq.lastState.index, seq.lastState.name);
        }
    }
    var alpha, endTime, nextIndex;
    while (true) {
        nextIndex = (seq.lastState.index + 1) % states.length;
        if (seq.lastState.inTransition) {
            endTime = seq.lastState.t + transTimes[seq.lastState.index];
            if (t >= endTime) {
                seq.lastState = this._interpState(seq.lastState, states[nextIndex], interps, endTime, endTime);
                seq.lastState.inTransition = false;
                seq.lastState.index = nextIndex;
                seq.lastState.name = names[seq.lastState.index];
                if (holdTimes[nextIndex] < 0) {
                    seq.lastState.indefiniteHold = true;
                } else {
                    seq.lastState.indefiniteHold = false;
                }
                for (var i = 0; i < seq.callbacks.length; i++) {
                    seq.callbacks[i]("enter", seq.lastState.index, seq.lastState.name);
                }
            } else {
                return this._interpState(seq.lastState, states[nextIndex], interps, t, endTime);
            }
        } else {
            endTime = seq.lastState.t + holdTimes[seq.lastState.index];
            if ((holdTimes[seq.lastState.index] >= 0) && (t > endTime)) {
                seq.lastState = this._extrapState(seq.lastState, states[seq.lastState.index], endTime);
                seq.lastState.inTransition = true;
                seq.lastState.indefiniteHold = false;
                for (var i = 0; i < seq.callbacks.length; i++) {
                    seq.callbacks[i]("exit", seq.lastState.index, seq.lastState.name);
                }
            } else {
                return this._extrapState(seq.lastState, states[seq.lastState.index], t);
            }
        }
    }
}

PrairieDrawAnim.prototype._interpState = function(lastState, nextState, interps, t, tFinal) {
    var s1 = this.dupState(nextState);
    s1.t = tFinal;

    var s = {};
    var alpha = (t - lastState.t) / (tFinal - lastState.t);
    for (e in nextState) {
        if (e in interps) {
            s[e] = interps[e](lastState, s1, t - lastState.t);
        } else {
            s[e] = this.linearInterp(lastState[e], s1[e], alpha);
        }
    }
    s.t = t;
    s.index = lastState.index;
    s.inTransition = lastState.inTransition;
    s.indefiniteHold = lastState.indefiniteHold;
    return s;
}

PrairieDrawAnim.prototype._extrapState = function(lastState, lastStateData, t) {
    var s = {};
    for (e in lastStateData) {
        if (typeof lastStateData[e] === "number") {
            s[e] = lastStateData[e];
        } else if (typeof lastStateData[e] === "function") {
            s[e] = lastStateData[e](lastState, t - lastState.t);
        }
    }
    s.t = t;
    s.index = lastState.index;
    s.inTransition = lastState.inTransition;
    s.indefiniteHold = lastState.indefiniteHold;
    return s;
}

/** Register a callback on animation sequence events.

    @param {string} seqName The sequence to register on.
    @param {Function} callback The callback(event, index, stateName) function.
*/
PrairieDrawAnim.prototype.registerSeqCallback = function(seqName, callback) {
    if (!(seqName in this._sequences)) {
        throw new Error("PrairieDraw: unknown sequence: " + seqName);
    }
    var seq = this._sequences[seqName];
    seq.callbacks.push(callback);
    if (seq.inTransition) {
        callback("exit", seq.lastState.index, seq.lastState.name);
    } else {
        callback("enter", seq.lastState.index, seq.lastState.name);
    }
}

/** Make a two-state sequence transitioning to and from 0 and 1.

    @param {string} name The name of the sequence;
    @param {number} transTime The transition time between the two states.
    @return {number} The current state (0 to 1).
*/
PrairieDrawAnim.prototype.activationSequence = function(name, transTime, t) {
    var stateZero = {trans: 0};
    var stateOne = {trans: 1};
    var states = [stateZero, stateOne];
    var transTimes = [transTime, transTime];
    var holdTimes = [-1, -1];
    var interps = {};
    var names = ["zero", "one"];
    var state = this.newSequence(name, states, transTimes, holdTimes, interps, names, t);
    return state.trans;
}

/*****************************************************************************/

PrairieDraw.prototype.drawImage = function(imgSrc, posDw, anchor, widthDw) {
    if (imgSrc in this._images) {
        // FIXME: should check that the image is really loaded, in case we are fired beforehand (also for text images).
        var img = this._images[imgSrc];
        var posPx = this.pos2Px(posDw);
        var scale;
        if (widthDw === undefined) {
            scale = 1;
        } else {
            var offsetDw = $V([widthDw, 0]);
            var offsetPx = this.vec2Px(offsetDw);
            var widthPx = offsetPx.modulus();
            scale = widthPx / img.width;
        }
        var xPx =  - (anchor.e(1) + 1) / 2 * img.width;
        var yPx = (anchor.e(2) - 1) / 2 * img.height;
        this._ctx.save();
        this._ctx.translate(posPx.e(1), posPx.e(2));
        this._ctx.scale(scale, scale);
        this._ctx.translate(xPx, yPx);
        this._ctx.drawImage(img, 0, 0);
        this._ctx.restore();
    } else {
        var img = new Image();
        img.onload = this.redraw.bind(this);
        img.src = imgSrc;
        this._images[imgSrc] = img;
    }
};

/*****************************************************************************/

PrairieDraw.prototype.reportMouseSample = function(event) {
    var xPx = event.pageX - this._canvas.offsetLeft;
    var yPx = event.pageY - this._canvas.offsetTop;
    var posPx = $V([xPx, yPx]);
    var posDw = this.pos2Dw(posPx);
    var numDecPlaces = 2;
    console.log("$V([" + posDw.e(1).toFixed(numDecPlaces)
                + ", " + posDw.e(2).toFixed(numDecPlaces)
                + "]),");
}

PrairieDraw.prototype.activateMouseSampling = function() {
    this._canvas.addEventListener('click', this.reportMouseSample.bind(this));
};

/*****************************************************************************/
