
    var p, ps, i, seg, x, y, dx, dy, point_strs, seg_strs, path_strs;
    for (var c in d) {
        p = d[c].path;
        ps = p.split('Z');
        path_strs = [];
        for (i = 0; i < ps.length; i++) {
            if (ps[i].length == 0) {
                continue;
            }
            if (ps[i][0] != 'M') {
                console.log('**********************************************');
                continue;
            }
            seg = ps[i].slice(1).split('l');
            x = 0;
            y = 0;
            seq_strs = [];
            for (j = 0; j < seg.length; j++) {
                point_strs = seg[j].split(', ');
                dx = parseFloat(point_strs[0]);
                dy = parseFloat(point_strs[1]);
                x += dx;
                y += dy;
                seq_strs.push("[" + x.toFixed(2) + ", " + y.toFixed(2) + "]");
            }
            path_strs.push("[" + seq_strs.join(", ") + "]")
        }
        console.log('"' + c + '": {');
        console.log('"name": "' + d[c].name + '",');
        console.log('"paths": [' + path_strs.join(", ") + ']');
        console.log('},');
    }

