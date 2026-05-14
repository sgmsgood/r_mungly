from __future__ import annotations

from pathlib import Path
import math
import random
import struct
import zlib

SIZE = 48
SCALE = 5
HI = SIZE * SCALE
OUT_DIR = Path("public/assets/png/foods")
PROTECTED = {"pizza", "pork", "donut", "tteok", "egg_tart"}

Color = tuple[int, int, int, int]
T: Color = (0, 0, 0, 0)
INK: Color = (34, 25, 22, 255)
DARK: Color = (58, 38, 28, 255)
SHADOW: Color = (0, 0, 0, 48)
WHITE: Color = (255, 248, 232, 255)


def blend(bg: Color, fg: Color) -> Color:
    r, g, b, a = fg
    if a == 255:
        return fg
    br, bg_g, bb, ba = bg
    fa = a / 255
    oa = a + ba * (1 - fa)
    if oa <= 0:
        return T
    return (
        round((r * a + br * ba * (1 - fa)) / oa),
        round((g * a + bg_g * ba * (1 - fa)) / oa),
        round((b * a + bb * ba * (1 - fa)) / oa),
        round(oa),
    )


class Art:
    def __init__(self) -> None:
        self.p = [[T for _ in range(HI)] for _ in range(HI)]

    def ellipse(self, cx, cy, rx, ry, c: Color) -> None:
        cx, cy, rx, ry = [v * SCALE for v in (cx, cy, rx, ry)]
        for y in range(max(0, int(cy - ry)), min(HI, int(cy + ry) + 1)):
            for x in range(max(0, int(cx - rx)), min(HI, int(cx + rx) + 1)):
                if ((x - cx) / max(rx, 1)) ** 2 + ((y - cy) / max(ry, 1)) ** 2 <= 1:
                    self.p[y][x] = blend(self.p[y][x], c)

    def rect(self, x, y, w, h, c: Color) -> None:
        x, y, w, h = [round(v * SCALE) for v in (x, y, w, h)]
        for yy in range(max(0, y), min(HI, y + h)):
            for xx in range(max(0, x), min(HI, x + w)):
                self.p[yy][xx] = blend(self.p[yy][xx], c)

    def poly(self, pts, c: Color) -> None:
        pts = [(x * SCALE, y * SCALE) for x, y in pts]
        min_x = max(0, int(min(x for x, _ in pts)))
        max_x = min(HI - 1, int(max(x for x, _ in pts)) + 1)
        min_y = max(0, int(min(y for _, y in pts)))
        max_y = min(HI - 1, int(max(y for _, y in pts)) + 1)
        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                inside = False
                j = len(pts) - 1
                for i, (xi, yi) in enumerate(pts):
                    xj, yj = pts[j]
                    if (yi > y) != (yj > y):
                        hit = (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi
                        if x < hit:
                            inside = not inside
                    j = i
                if inside:
                    self.p[y][x] = blend(self.p[y][x], c)

    def line(self, x0, y0, x1, y1, c: Color, w=1.0) -> None:
        x0, y0, x1, y1, w = [v * SCALE for v in (x0, y0, x1, y1, w)]
        steps = max(1, round(math.hypot(x1 - x0, y1 - y0)))
        r = max(1, w / 2)
        for i in range(steps + 1):
            t = i / steps
            x = x0 + (x1 - x0) * t
            y = y0 + (y1 - y0) * t
            for yy in range(round(y - r), round(y + r) + 1):
                for xx in range(round(x - r), round(x + r) + 1):
                    if 0 <= xx < HI and 0 <= yy < HI and (xx - x) ** 2 + (yy - y) ** 2 <= r * r:
                        self.p[yy][xx] = blend(self.p[yy][xx], c)

    def dot(self, x, y, c: Color, s=1.0) -> None:
        self.ellipse(x, y, s, s, c)

    def shadow(self, cx=24, cy=40, rx=14, ry=3) -> None:
        self.ellipse(cx, cy, rx, ry, SHADOW)

    def texture(self, seed: int, colors: list[Color], count: int, area=(6, 6, 36, 34)) -> None:
        rng = random.Random(seed)
        x0, y0, w, h = area
        for _ in range(count):
            x = rng.uniform(x0, x0 + w)
            y = rng.uniform(y0, y0 + h)
            ix, iy = int(x * SCALE), int(y * SCALE)
            if 0 <= ix < HI and 0 <= iy < HI and self.p[iy][ix][3]:
                self.rect(x, y, rng.choice([0.5, 0.7, 1.0]), rng.choice([0.5, 0.7, 1.0]), rng.choice(colors))

    def down(self) -> list[list[Color]]:
        out = []
        for y in range(SIZE):
            row = []
            for x in range(SIZE):
                rs = gs = bs = al = 0
                for yy in range(SCALE):
                    for xx in range(SCALE):
                        r, g, b, a = self.p[y * SCALE + yy][x * SCALE + xx]
                        rs += r * a
                        gs += g * a
                        bs += b * a
                        al += a
                if al == 0:
                    row.append(T)
                else:
                    row.append((round(rs / al), round(gs / al), round(bs / al), round(al / (SCALE * SCALE))))
            out.append(row)
        return out


def plate(a: Art, soup: Color | None = None, rim=(246, 225, 190, 255), inner=(255, 241, 214, 255)) -> None:
    a.shadow()
    a.ellipse(24, 24, 20, 15, INK)
    a.ellipse(24, 23, 18, 13, rim)
    a.ellipse(24, 23, 15, 10, soup if soup else inner)


def garnish(a: Art, x, y) -> None:
    a.rect(x, y, 4, 3, (78, 162, 72, 255))
    a.rect(x + 1, y + 0.4, 2.5, 1, (151, 219, 105, 255))


def rice_cake(a: Art, x, y, angle=0, color=(255, 226, 188, 255)) -> None:
    a.ellipse(x, y, 5.5, 2.3, INK)
    a.ellipse(x, y, 4.2, 1.4, color)
    a.rect(x - 2.3, y - 0.8, 4.6, 1.3, (255, 245, 218, 255))


def mara_tang():
    a = Art()
    # Top-view malatang: red broth, packed toppings, green vegetables, noodles, fish cake, meatballs.
    plate(a, (191, 35, 42, 255), rim=(250, 218, 178, 255))
    for x, y in [(14, 17), (22, 15), (31, 19), (17, 28), (28, 27)]:
        a.ellipse(x, y, 4.3, 3.2, INK)
        a.ellipse(x, y, 3.1, 2.2, (222, 92, 55, 255))
        a.ellipse(x - 0.7, y - 0.8, 1.1, 0.7, (255, 168, 104, 255))
    for x, y in [(12, 22), (22, 25), (30, 15)]:
        a.line(x, y, x + 9, y + 1, (255, 211, 85, 255), 1.4)
        a.line(x + 1, y + 2, x + 8, y + 1, (245, 176, 66, 255), 0.8)
    for x, y in [(17, 14), (33, 24), (13, 29), (27, 18)]:
        garnish(a, x, y)
    a.rect(30, 29, 6, 3, (255, 237, 197, 255))
    a.rect(11, 18, 5, 3, (255, 237, 197, 255))
    a.texture(1, [(255, 91, 68, 255), (121, 16, 27, 255), (255, 214, 90, 255)], 115, (9, 12, 30, 24))
    return a.down()


def mara_xiangguo():
    a = Art()
    # Dry mala stir-fry: dark pan, glossy red oil, many chunky ingredients, no soup surface.
    a.shadow()
    a.ellipse(24, 25, 20, 14, INK)
    a.ellipse(24, 24, 17, 11, (82, 49, 36, 255))
    a.ellipse(24, 23, 14, 8, (171, 50, 36, 255))
    for x, y, c in [
        (12, 18, (77, 159, 72, 255)),
        (20, 16, (248, 200, 74, 255)),
        (29, 17, (255, 236, 196, 255)),
        (16, 26, (117, 68, 43, 255)),
        (30, 27, (225, 58, 48, 255)),
        (24, 24, (255, 210, 88, 255)),
    ]:
        a.rect(x, y, 7, 5, INK)
        a.rect(x + 0.8, y + 0.7, 5.2, 3.3, c)
    a.line(37, 25, 45, 20, INK, 4)
    a.line(37, 25, 45, 20, (95, 55, 35, 255), 2)
    a.texture(2, [(255, 111, 72, 255), (70, 135, 61, 255), (255, 219, 102, 255)], 120, (8, 14, 32, 25))
    return a.down()


def tteokbokki(kind: str):
    a = Art()
    plate(a, (211, 42, 42, 255), rim=(92, 145, 72, 255), inner=(211, 42, 42, 255))
    for x, y in [(15, 17), (24, 16), (31, 21), (17, 27), (26, 28)]:
        rice_cake(a, x, y)
    a.rect(12, 22, 22, 5, (228, 58, 46, 255))
    if kind == "rose":
        a.ellipse(24, 23, 13, 8, (236, 112, 92, 215))
        a.line(14, 23, 35, 24, (255, 177, 145, 255), 2)
    elif kind == "cheese":
        a.line(12, 18, 36, 25, (255, 224, 66, 255), 4)
        a.line(19, 15, 29, 33, (255, 234, 91, 255), 3)
        a.rect(26, 25, 5, 7, (255, 234, 91, 255))
    else:
        a.ellipse(34, 12, 4, 7, INK)
        a.ellipse(34, 12, 2.7, 5.4, (255, 70, 32, 255))
        a.ellipse(35, 12, 1.1, 2.5, (255, 213, 63, 255))
    garnish(a, 29, 14)
    a.texture(10 + len(kind), [(147, 20, 28, 255), (255, 111, 82, 255), (255, 238, 191, 255)], 90, (10, 13, 29, 24))
    return a.down()


def chicken(style: str):
    a = Art()
    a.shadow()
    a.ellipse(24, 25, 19, 13, INK)
    a.ellipse(24, 25, 17, 11, (255, 239, 197, 255))
    colors = {
        "boneless": ((221, 139, 58, 255), (255, 205, 91, 255), (128, 75, 37, 255)),
        "yangnyeom": ((184, 45, 38, 255), (255, 91, 69, 255), (116, 24, 24, 255)),
        "crispy": ((236, 171, 63, 255), (255, 227, 116, 255), (145, 87, 38, 255)),
    }
    base, hi, dark = colors[style]
    pieces = [(14, 19, 6, 5), (23, 16, 7, 5), (31, 21, 6, 5), (17, 29, 7, 5), (27, 29, 7, 5), (23, 24, 6, 5)]
    for cx, cy, rx, ry in pieces:
        a.ellipse(cx, cy, rx, ry, INK)
        a.ellipse(cx, cy, rx - 1.4, ry - 1.2, base)
        a.ellipse(cx - 1.2, cy - 1.4, rx * 0.35, ry * 0.22, hi)
        if style == "crispy":
            a.dot(cx + 1.6, cy + 1.2, dark, 0.7)
    if style == "yangnyeom":
        a.line(12, 16, 35, 30, (255, 120, 82, 255), 2.4)
        a.rect(22, 13, 4, 6, (255, 234, 196, 255))
    garnish(a, 34, 30)
    a.texture(20 + len(style), [dark, hi, (255, 239, 170, 255)], 95, (8, 12, 32, 25))
    return a.down()


def burger():
    a = Art()
    a.shadow()
    # Large side-view burger, because burger reads best by layers.
    a.ellipse(24, 15, 17, 8, INK)
    a.ellipse(24, 15, 15, 5.8, (224, 145, 67, 255))
    for x, y in [(17, 13), (24, 12), (31, 15)]:
        a.dot(x, y, WHITE, 0.9)
    a.rect(9, 20, 30, 4, (101, 56, 38, 255))
    a.rect(9, 23.5, 30, 4.5, (255, 221, 73, 255))
    a.rect(9, 27.5, 30, 4.5, (77, 157, 75, 255))
    a.rect(11, 32, 26, 7, INK)
    a.rect(13, 32, 22, 4.8, (225, 144, 70, 255))
    a.texture(31, [(164, 86, 39, 255), (255, 236, 119, 255), (111, 188, 88, 255)], 70, (9, 9, 31, 30))
    return a.down()


def fries():
    a = Art()
    a.shadow(24, 41, 12, 2.5)
    for x, y, h in [(12, 8, 24), (17, 6, 27), (22, 9, 23), (28, 7, 25), (34, 11, 20)]:
        a.rect(x - 1, y - 1, 5, h + 2, INK)
        a.rect(x, y, 3, h, (255, 210, 76, 255))
        a.rect(x + 0.2, y + 0.5, 1, h - 1, (255, 240, 138, 255))
    a.poly([(11, 22), (37, 22), (34, 41), (14, 41)], INK)
    a.poly([(13, 24), (35, 24), (32, 38), (16, 38)], (220, 50, 54, 255))
    a.rect(18, 28, 12, 4, (255, 239, 213, 255))
    a.texture(32, [(255, 231, 113, 255), (220, 139, 45, 255)], 40, (12, 6, 26, 33))
    return a.down()


def pasta():
    a = Art()
    plate(a, (255, 207, 91, 255), rim=(250, 230, 205, 255), inner=(255, 207, 91, 255))
    for y in [17, 19.5, 22, 24.5, 27]:
        a.line(12, y, 35, y + math.sin(y) * 1.5, (255, 219, 93, 255), 1.5)
        a.line(14, y + 1.3, 32, y - 0.5, (228, 157, 55, 255), 0.8)
    a.ellipse(24, 22, 5, 4, (209, 55, 47, 255))
    garnish(a, 18, 16)
    a.texture(33, [(255, 229, 122, 255), (209, 88, 53, 255)], 70, (10, 12, 28, 25))
    return a.down()


def pork_belly():
    a = Art()
    # New filename only. Do not overwrite protected pork.png.
    a.shadow()
    a.ellipse(24, 25, 19, 13, INK)
    a.ellipse(24, 24, 17, 11, (54, 48, 41, 255))
    for x, y, ang in [(14, 18, 0), (22, 22, 0), (17, 29, 0), (29, 28, 0)]:
        a.rect(x, y, 16, 4.8, INK)
        a.rect(x + 1, y + 0.7, 14, 3, (235, 137, 96, 255))
        a.line(x + 2, y + 2.2, x + 14, y + 2.4, (255, 220, 190, 255), 1)
    garnish(a, 12, 13)
    a.rect(30, 14, 5, 4, (216, 53, 48, 255))
    a.texture(34, [(169, 86, 61, 255), (255, 196, 163, 255)], 65, (8, 13, 32, 27))
    return a.down()


def gopchang():
    a = Art()
    a.shadow()
    a.ellipse(24, 25, 20, 14, INK)
    a.ellipse(24, 24, 17, 11, (58, 47, 39, 255))
    for cx, cy in [(15, 20), (24, 18), (32, 24), (19, 29), (28, 31), (23, 24)]:
        a.ellipse(cx, cy, 6, 4.8, INK)
        a.ellipse(cx, cy, 4.1, 3, (193, 126, 72, 255))
        a.ellipse(cx - 0.8, cy - 0.8, 2, 1.1, (241, 188, 109, 255))
    garnish(a, 12, 15)
    a.rect(32, 16, 5, 4, (221, 55, 50, 255))
    a.texture(35, [(116, 76, 49, 255), (232, 154, 88, 255)], 70, (8, 13, 32, 27))
    return a.down()


def ramen():
    a = Art()
    plate(a, (198, 80, 43, 255), rim=(245, 229, 205, 255), inner=(198, 80, 43, 255))
    for y in [17, 19.5, 22, 24.5]:
        a.line(12, y, 35, y + 1, (255, 211, 84, 255), 1.5)
    a.ellipse(16, 18, 5, 4, INK)
    a.ellipse(16, 18, 3.8, 2.8, (255, 239, 191, 255))
    a.ellipse(16.6, 18.3, 1.6, 1.2, (246, 181, 56, 255))
    a.rect(30, 17, 6, 4.5, (227, 91, 124, 255))
    a.rect(31, 18.2, 3, 1.8, WHITE)
    garnish(a, 25, 14)
    a.texture(36, [(255, 226, 115, 255), (132, 46, 37, 255)], 65, (10, 13, 30, 25))
    return a.down()


def croffle():
    a = Art()
    a.shadow(24, 39, 14, 3)
    # Croffle: irregular croissant-waffle oval, not a square waffle.
    a.ellipse(24, 25, 18, 12, INK)
    a.ellipse(24, 24, 16, 10, (206, 132, 54, 255))
    a.ellipse(15, 22, 8, 7, (222, 153, 71, 255))
    a.ellipse(32, 22, 8, 7, (222, 153, 71, 255))
    a.ellipse(24, 28, 13, 7, (187, 103, 45, 255))
    for x in [15, 21, 27, 33]:
        a.line(x, 15, x - 2, 34, (107, 62, 34, 255), 1.4)
    for y in [20, 26, 31]:
        a.line(10, y, 38, y + 1, (107, 62, 34, 255), 1.3)
    a.ellipse(24, 14, 6, 4, INK)
    a.ellipse(24, 14, 4.5, 2.8, (255, 245, 204, 255))
    a.rect(29, 12, 5, 5, (226, 57, 59, 255))
    a.line(16, 18, 31, 33, (255, 221, 96, 255), 1.5)
    a.texture(37, [(238, 177, 86, 255), (98, 58, 32, 255), (255, 222, 131, 255)], 95, (8, 12, 33, 26))
    return a.down()


def souffle_pancake():
    a = Art()
    a.shadow()
    for cx, cy, rx in [(24, 32, 15), (24, 24.5, 13), (24, 17.5, 10)]:
        a.ellipse(cx, cy, rx, 5.5, INK)
        a.ellipse(cx, cy - 1, rx - 2, 3.5, (255, 224, 142, 255))
        a.rect(cx - rx + 2, cy + 1, (rx - 2) * 2, 3, (229, 151, 74, 255))
    a.rect(21, 10.5, 7, 5, INK)
    a.rect(22, 10.5, 5, 4, (255, 238, 144, 255))
    a.line(20, 17, 31, 32, (166, 90, 43, 255), 2)
    a.rect(28.5, 25, 4, 5, (166, 90, 43, 255))
    a.texture(38, [(255, 240, 165, 255), (209, 122, 58, 255)], 65, (9, 11, 30, 26))
    return a.down()


def cake():
    a = Art()
    a.shadow(23, 40, 10, 2.5)
    a.poly([(11, 14), (37, 20), (18, 40)], INK)
    a.poly([(14, 16), (33, 20.5), (19, 36.5)], (255, 225, 205, 255))
    a.line(15, 22, 31, 25, (248, 112, 143, 255), 4.2)
    a.line(17, 29, 27, 31, (255, 248, 228, 255), 3)
    a.rect(27, 13, 5, 6, (82, 163, 76, 255))
    a.ellipse(30, 12, 5, 4, INK)
    a.ellipse(30, 12, 3, 2.3, (228, 59, 63, 255))
    a.texture(39, [(255, 243, 225, 255), (237, 94, 128, 255), (213, 130, 83, 255)], 60, (12, 15, 25, 24))
    return a.down()


def macaron():
    a = Art()
    a.shadow()
    specs = [
        (14, 12, (246, 144, 191, 255), (255, 231, 241, 255)),
        (10, 22, (177, 148, 226, 255), (238, 228, 255, 255)),
        (14, 32, (126, 211, 201, 255), (222, 255, 249, 255)),
    ]
    for x, y, color, cream in specs:
        a.ellipse(x + 11, y + 4, 13, 5, INK)
        a.ellipse(x + 11, y + 3, 11, 3.5, color)
        a.rect(x + 2, y + 5, 18, 2.2, cream)
        a.rect(x + 3, y + 8, 16, 2, color)
        a.ellipse(x + 7, y + 2.7, 3, 1, (255, 255, 255, 88))
    a.texture(40, [(255, 194, 218, 255), (146, 117, 196, 255), (85, 178, 172, 255)], 50, (10, 11, 28, 29))
    return a.down()


def ice_cream():
    a = Art()
    a.shadow(25, 42, 9, 2.5)
    a.poly([(17, 25), (33, 25), (25, 44)], INK)
    a.poly([(20, 26), (30, 26), (25, 40)], (219, 151, 80, 255))
    a.line(21, 28, 28, 36, (147, 90, 45, 255), 1)
    a.line(29, 28, 22, 36, (147, 90, 45, 255), 1)
    for cx, cy, color in [
        (18, 22, (255, 174, 207, 255)),
        (29, 21, (255, 236, 168, 255)),
        (24, 14, (154, 222, 212, 255)),
    ]:
        a.ellipse(cx, cy, 8.5, 7, INK)
        a.ellipse(cx, cy, 6.5, 5.2, color)
        a.ellipse(cx - 2, cy - 2, 2, 1.2, WHITE)
    a.texture(41, [(255, 105, 154, 255), (255, 224, 117, 255), (98, 188, 181, 255)], 50, (11, 8, 26, 29))
    return a.down()


ASSETS = {
    "mara_tang": mara_tang,
    "mara_xiangguo": mara_xiangguo,
    "rose_tteokbokki": lambda: tteokbokki("rose"),
    "spicy_tteokbokki": lambda: tteokbokki("spicy"),
    "cheese_tteokbokki": lambda: tteokbokki("cheese"),
    "boneless_chicken": lambda: chicken("boneless"),
    "yangnyeom_chicken": lambda: chicken("yangnyeom"),
    "crispy_chicken": lambda: chicken("crispy"),
    "burger": burger,
    "fries": fries,
    "pasta": pasta,
    "pork_belly": pork_belly,
    "gopchang": gopchang,
    "ramen": ramen,
    "croffle": croffle,
    "souffle_pancake": souffle_pancake,
    "cake": cake,
    "macaron": macaron,
    "ice_cream": ice_cream,
}


def write(path: Path, pixels: list[list[Color]]) -> None:
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for px in row:
            raw.extend(px)

    def chunk(kind: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + kind
            + data
            + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        )

    data = b"\x89PNG\r\n\x1a\n"
    data += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
    data += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    data += chunk(b"IEND", b"")
    path.write_bytes(data)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, maker in ASSETS.items():
        if name in PROTECTED:
            raise RuntimeError(f"{name}.png is protected and must not be generated")
        write(OUT_DIR / f"{name}.png", maker())
    print(f"generated {len(ASSETS)} non-protected food assets")


if __name__ == "__main__":
    main()
