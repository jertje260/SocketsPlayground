function Sprite(x, y, w, h, image, name, type) {
    var self = this;
    self.name = name;
    self.type = type;
    self.canvas;

    function init() {
        self.canvas = document.createElement('canvas');
        self.canvas.width = w;
        self.canvas.height = h;
        var context = self.canvas.getContext('2d');
        context.drawImage(image, x, y, w, h, 0, 0, w, h);
    }

    init();

}