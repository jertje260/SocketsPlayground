function Pad(x, y, width, height, xdir, ydir, color) {
    var self = this;
    Object.call(self, x, y, width, height, xdir, ydir, color);
    self.updateY = self.pos.y;

    self.update = function (fieldsize) {
        self.pos.y = self.updateY;
        if (self.pos.y < self.size.height / 2) {
            self.pos.y = self.size.height / 2;
        }
        if (self.pos.y > fieldsize.height - self.size.height / 2) {
            self.pos.y = fieldsize.height - self.size.height / 2;
        }
    }


}