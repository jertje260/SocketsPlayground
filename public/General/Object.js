function Object(x, y, width, height, xdir, ydir, color) {
    var self = this;
    self.pos = new Position(x, y);
    self.size = new Size(width, height);
    self.direction = new Direction(xdir, ydir);
    self.color = color;

    self.update = function () {
        self.pos.x += self.direction.x;
        self.pos.y += self.direction.y;
    }

    self.draw = function (ctx, xFactor, yFactor) {
        ctx.fillStyle = color;
        ctx.fillRect((self.pos.x - 0.5 * self.size.width)*xFactor, (self.pos.y - 0.5 * self.size.height)*yFactor, self.size.width * xFactor, self.size.height * yFactor);
    }

    self.intersects = function (object) {
        var thisx, thisy, otherx, othery;

        thisx = self.pos.x - self.size.width / 2;
        thisy = self.pos.y - self.size.height / 2;
        otherx = object.pos.x - object.size.width / 2;
        othery = object.pos.y - object.size.height / 2;

        return (thisx <= otherx+object.size.width &&
            otherx <= thisx+self.size.width &&
            thisy <= othery+object.size.height &&
            othery <= thisy+self.size.height);

    }
}