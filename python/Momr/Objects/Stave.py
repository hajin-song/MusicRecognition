
from collections import defaultdict


class Stave:
    def __init__(self, y0, y1, lines):
        self.sections = []
        self.lines = lines
        self.height = y1 - y0
        self.y0 = y0
        self.y1 = y1
        self.staveFactor = 0.0
        self.isStave = False
        self.notes = defaultdict(list)

    def __eq__(self, other):
        if isinstance(other, self.__class__):
            return (self.y0 == other.y0) or (self.y1 == other.y1)
        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        return 'Between {} - {} with height of {} = {}, Line at {}. Has {} notes'.format(
        self.y0,
        self.y1,
        self.height,
        ','.join(list(map(lambda x: str(x), self.sections))),
        ','.join(list(map(lambda x: str(x), self.lines))),
        sum(list(map(lambda x: int(x), [len(self.notes[x]) for x in self.notes.keys()])))
        )

    def json(self):
        return '{' + '"y0":{},"y1":{},"lines":{},"sections":{}'.format(
            str(self.y0), str(self.y1),
            '[' + ','.join(list(map(lambda x: str(x), self.lines))) + ']',
            '[' + ','.join(list(map(lambda x: str(x), self.sections))) +']'
        ) + '}'

    def setSection(self, sections):
        slf.sections = sorted(sections)

    def addNote(self, section, note):
        self.notes[section].append(note)

    def isSuperSet(self, other):
        if self == other:
            if len(self.sections) < len(other.sections):
                return 0
            return 1
        return -1

    def setStaveFactor(self, factor):
        self.staveFactor = factor

    def setIsStave(self, isStave):
        self.isStave = isStave
