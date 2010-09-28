/*
---
description: Provides rectangle as canvas object

license: LGPL

authors:
- Pavel Ponomarenko aka Shock <shocksilien@gmail.com>

requires:
- LibCanvas.Shape

provides: [LibCanvas.Shapes.Rectangle]
*/


LibCanvas.Shapes.Rectangle = new Class({
	Extends : LibCanvas.Shape,
	set : function () {
		var a = arguments;
		if ($type(a[0]) == 'array') {
			a = a[0];
		}
		if (a.length == 4) {
			this.from = new LibCanvas.Point(a[0], a[1]);
			this.to   = this.from.clone().move({x:a[2], y:a[3]});
		} else if (a.length == 2) {
			this.from = this.checkPoint(a[0]);
			this.to   = this.checkPoint(a[1]);
		} else {

			a = a[0];
			if (a.from) {
				this.from = this.checkPoint(a.from);
			} else if ($chk(a.x) && $chk(a.y)) {
				this.from = new LibCanvas.Point(a.x, a.y);
			}
			if (a.to) this.to = this.checkPoint(a.to);
		
			if (!a.from || !a.to) {
				var size = {
					w : [ a.w, a.width,  a.size && a.size.w, a.size && a.size[0] ].firstReal(),
					h : [ a.h, a.height, a.size && a.size.h, a.size && a.size[1] ].firstReal()
				}
				this.from ?
					(this.to = this.from.clone().move({x: size.w, y: size.h})) :
					(this.from = this.to.clone().move({x:-size.w, y:-size.h}));
			}
		
		}
 		this.to = this.to.clone();
		this.from = this.from.clone();
		return this;
	},
	hasPoint : function (point) {
		point = this.checkPoint(arguments);
		return $chk(point.x) && $chk(point.y)
			&& point.x.between(this.from.x, this.to.x, 1)
			&& point.y.between(this.from.y, this.to.y, 1);
	},
	move : function (distance) {
		this.from.x += distance.x || 0;
		this.from.y += distance.y || 0;
		this.to.x   += distance.x || 0;
		this.to.y   += distance.y || 0;
		return this.parent(distance);
	},
	draw : function (ctx, type) {
		ctx.original(type + 'Rect',
			[this.from.x, this.from.y, this.getWidth(), this.getHeight()]
		);
		return this;
	},
	getCoords : function () {
		return this.from;
	},
	getCenter : function () {
		return new LibCanvas.Point(
			this.from.x + this.getWidth()  / 2,
			this.from.y + this.getHeight() / 2
		);
	},
	processPath : function (ctx, noWrap) {
		if (!noWrap) {
			ctx.beginPath();
		}
		ctx
			.moveTo(this.from.x, this.from.y)
			.lineTo(this.to.x, this.from.y)
			.lineTo(this.to.x, this.to.y)
			.lineTo(this.from.x, this.to.y)
			.lineTo(this.from.x, this.from.y);
		if (!noWrap) {
			ctx.closePath();
		}
		return ctx;
	},
	getRandomPoint : function () {
		return new LibCanvas.Point(
			$random(0, this.getWidth()),
			$random(0, this.getHeight())
		);
	},
	clone : function () {
		return new LibCanvas.Shapes.Rectangle(this);
	},

	getWidth : function () {
		return this.to.x - this.from.x;
	},
	getHeight : function () {
		return this.to.y - this.from.y;
	},
	setWidth : function (width) {
		this.to.x = this.from.x + width;
		return this;
	},
	setHeight : function (height) {
		this.to.y = this.from.y + height;
		return this;
	},
});