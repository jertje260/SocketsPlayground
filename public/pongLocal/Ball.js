function Ball(x, y, width, height, xdir, ydir, color) {
    var self = this;
    Object.call(self, x, y, width, height, xdir, ydir, color);

    self.update = function (fieldsize) {
        if ((self.pos.x + 0.5 * self.size.width) >= fieldsize.width) {
            ball.direction.x = -1;
        }
        if ((self.pos.x - 0.5 * self.size.width) <= 0) {
            ball.direction.x = 1;
        }

        if ((self.pos.y + 0.5 * self.size.height) >= fieldsize.height) {
            ball.direction.y = -1;
        }
        if ((self.pos.y - 0.5 * self.size.height) <= 0) {
            ball.direction.y = 1;
        }
        self.pos.x += self.direction.x;
        self.pos.y += self.direction.y;
    }

}