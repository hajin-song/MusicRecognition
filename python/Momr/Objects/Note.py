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
        
    def __eq__(self, other):
        if isinstance(other, self.__class__):
            return (self.x == other.x) or (self.y == other.y) and (self.note_type == other.note_type)
        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        return 'Type {} at {},{} with tail direction of {}  and type of {}, ending at {},{}'.format(
        self.note_type,
        self.x,
        self.y,
        self.tail_direction,
        self.tail_type,
        self.tail_x,
        self.tail_y
        )
