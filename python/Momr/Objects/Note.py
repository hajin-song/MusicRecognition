class Note:
    def __init__(self, x, y, note_type, w, h):
        self.x = x
        self.y = y
        self.note_type = note_type
        self.w = w
        self.h = h
        self.tail_direction = 0
        self.tail_x = 0
        self.tail_y = 0
        self.tail_type =0
        self.pitch = 0

    def __eq__(self, other):
        if isinstance(other, self.__class__):
            return (self.x == other.x) or (self.y == other.y) and (self.note_type == other.note_type)
        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        return 'Pitch {}, Type {} at {},{} with tail direction of {}  and type of {}, ending at {},{}'.format(
        self.pitch,
        self.note_type,
        self.x,
        self.y,
        self.tail_direction,
        self.tail_type,
        self.tail_x,
        self.tail_y
        )

    def json(self):
        return '{' + '"x":{},"y":{},"note_type":{},"tail_direction":{},"tail_type":{}, "pitch":{}'.format(
            self.x, self.y, self.note_type, self.tail_direction, self.tail_type, self.pitch
        ) +'}'

    def center(self):
        return (self.x + self.w/2, self.y + self.h/2)

    def setPitch(self, pitch):
        #print '\t\t\t\t', pitch
        self.pitch = pitch
