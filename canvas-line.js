var canvas = (function() {
    function init(config) {
        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.style = "position: fixed; top: 0; left: 0; z-index: -1;"
        document.documentElement.appendChild(canvas);

        config = config || {};
        var canvasConfig = {
            count: config.count || 200,
            points: [],
            maxConn: config.maxConn || 10,
            dist: config.dist || 6000,
            vx: config.vx || 4,
            vy: config.vy || 4,
            mouse_dist: config.mouse_dist || 20000
        }
        var canvas = document.querySelector('#canvas');
        setCanvasSize(canvas, canvasConfig);

        window.onresize = function() {
            setCanvasSize(canvas, canvasConfig);
        }

        canvas.onmousemove = function(e) {
            var event = e || window.event;
            canvasConfig.mouse = {
                x: event.clientX,
                y: event.clientY
            }
        }

        document.onmouseleave = function() {
            config.mouse = null;
        }

        var ctx = canvas.getContext('2d');
        drawPoint(canvasConfig, ctx, canvas);
        setInterval(function() {
            drawPoint(canvasConfig, ctx, canvas);
        }, 40);
    }

    function drawPoint(canvasConfig, ctx, canvas) {
        ctx.clearRect(0, 0, canvasConfig.width, canvasConfig.height);
        ctx.beginPath();
        ctx.fillStyle = "rgb(130,255,255)"
        for (var i = 0, len = canvasConfig.count; i < len; i++) {
            if (canvasConfig.points.length !== canvasConfig.count) {
                point = {
                    x: Math.floor(Math.random() * canvasConfig.width),
                    y: Math.floor(Math.random() * canvasConfig.height),
                    vx: canvasConfig.vx / 2 - Math.random() * canvasConfig.vx,
                    vy: canvasConfig.vy / 2 - Math.random() * canvasConfig.vy
                }
            } else {
                point = borderPoint(canvasConfig.points[i], canvas, canvasConfig);
            }
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
            canvasConfig.points[i] = point;
        }
        drawLine(canvasConfig, ctx, canvasConfig.mouse);
        ctx.closePath();
    }

    function setCanvasSize(canvas, canvasConfig) {
        var width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvasConfig.width = Math.floor(width);
        canvasConfig.height = Math.floor(height);
    }

    function drawLine(canvasConfig, ctx, mouse) {
        for (var i = 0, len = canvasConfig.count; i < len; i++) {
            canvasConfig.points[i].max_conn = 0;
            for (var j = 0; j < len; j++) {
                if (i != j) {
                    dist = Math.round(canvasConfig.points[i].x - canvasConfig.points[j].x) * Math.round(canvasConfig.points[i].x - canvasConfig.points[j].x) +
                        Math.round(canvasConfig.points[i].y - canvasConfig.points[j].y) * Math.round(canvasConfig.points[i].y - canvasConfig.points[j].y);
                    // 两点距离小于吸附距离，而且小于最大连接数，则画线
                    if (dist <= canvasConfig.dist && canvasConfig.points[i].max_conn < canvasConfig.maxConn) {
                        canvasConfig.points[i].max_conn++;
                        // 距离越远，线条越细，而且越透明
                        ctx.lineWidth = 0.5 - dist / canvasConfig.dist;
                        ctx.strokeStyle = "rgba(130,255,255," + (1 - dist / canvasConfig.dist) + ")";
                        ctx.beginPath();
                        ctx.moveTo(canvasConfig.points[i].x, canvasConfig.points[i].y);
                        ctx.lineTo(canvasConfig.points[j].x, canvasConfig.points[j].y);
                        ctx.stroke();

                    }
                }
            }
            if (mouse) {
                dist = Math.round(canvasConfig.points[i].x - mouse.x) * Math.round(canvasConfig.points[i].x - mouse.x) + Math.round(canvasConfig.points[i].y - mouse.y) * Math.round(canvasConfig.points[i].y - mouse.y);
                if (dist < canvasConfig.mouse_dist && dist > canvasConfig.dist) {
                    canvasConfig.points[i].x = canvasConfig.points[i].x + (mouse.x - canvasConfig.points[i].x) / 20;
                    canvasConfig.points[i].y = canvasConfig.points[i].y + (mouse.y - canvasConfig.points[i].y) / 20
                }
                if (dist < canvasConfig.mouse_dist) {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "rgba(130,255,255," + (1 - dist / canvasConfig.mouse_dist) + ")";
                    ctx.beginPath();
                    ctx.moveTo(canvasConfig.points[i].x, canvasConfig.points[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function borderPoint(point, canvas, canvasConfig) {
        var p = point;
        if (point.x <= 0 || point.x >= canvasConfig.width) {
            p.vx = -p.vx;
            p.x += p.vx;
        } else if (point.y <= 0 || point.y >= canvasConfig.height) {
            p.vy = -p.vy;
            p.y += p.vy;
        } else {
            p = {
                x: p.x + p.vx,
                y: p.y + p.vy,
                vx: p.vx,
                vy: p.vy
            }
        }
        return p;
    }
    return {
        init: init
    }

}(window, document))