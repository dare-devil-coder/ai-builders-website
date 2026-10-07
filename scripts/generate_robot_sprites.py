"""Draw aligned, transparent ink sprites for the AI Builders page mascot."""

from pathlib import Path
from PIL import Image, ImageDraw

SCALE = 3
CELL = 256
INK = (238, 241, 255, 255)
SOFT = (173, 188, 255, 245)


def draw_head(draw, left, top, dx=0, dy=0, expression="neutral"):
    def p(x, y):
        return ((left + x) * SCALE, (top + y) * SCALE)

    def line(points, color=INK, width=2.4, joint="curve"):
        draw.line([p(x, y) for x, y in points], fill=color, width=round(width * SCALE), joint=joint)

    def ellipse(box, color=INK, width=2.4):
        draw.ellipse((*p(box[0], box[1]), *p(box[2], box[3])), outline=color, width=round(width * SCALE))

    def rounded(box, radius, color=INK, width=2.4):
        draw.rounded_rectangle((*p(box[0], box[1]), *p(box[2], box[3])), radius=radius * SCALE, outline=color, width=round(width * SCALE))

    # All parts share one baseline. The face shifts inside the frame to indicate gaze.
    line([(121, 199), (121, 211), (135, 211), (135, 199)], SOFT)
    rounded((108, 204, 148, 217), 5, SOFT)
    lean = dx * 7
    line([(128, 47), (128 + lean * .45, 28), (128 + lean, 19)])
    ellipse((121 + lean, 11, 135 + lean, 25))
    rounded((34, 91, 49, 139), 5, SOFT)
    rounded((207, 91, 222, 139), 5, SOFT)
    line([(41, 98), (41, 132)], SOFT, 1.5)
    line([(215, 98), (215, 132)], SOFT, 1.5)
    # Soft hexagon with rounded corners, followed by a restrained inner faceplate.
    outline = [(83, 43), (173, 43), (205, 64), (215, 101), (210, 155),
               (185, 188), (165, 199), (91, 199), (71, 188), (46, 155),
               (41, 101), (51, 64), (83, 43)]
    line(outline, INK, 3.2)
    rounded((57, 58, 199, 184), 34, SOFT, 1.8)
    for x, y in ((72, 73), (184, 73), (72, 169), (184, 169)):
        ellipse((x - 3, y - 3, x + 3, y + 3), SOFT, 1.6)

    eye_x = dx * 13
    eye_y = dy * 11
    left_eye = (93 + eye_x, 112 + eye_y)
    right_eye = (163 + eye_x, 112 + eye_y)

    if expression == "happy":
        for ex, ey in (left_eye, right_eye):
            line([(ex - 17, ey + 5), (ex - 9, ey - 5), (ex, ey - 9), (ex + 9, ey - 5), (ex + 17, ey + 5)], INK, 3)
    elif expression == "focused":
        for ex, ey in (left_eye, right_eye):
            line([(ex - 17, ey - 2), (ex + 17, ey - 2)], INK, 3)
            line([(ex - 11, ey + 7), (ex + 11, ey + 7)], SOFT, 1.6)
    elif expression == "celebrating":
        for ex, ey in (left_eye, right_eye):
            line([(ex, ey - 17), (ex + 4, ey - 4), (ex + 17, ey), (ex + 4, ey + 4),
                  (ex, ey + 17), (ex - 4, ey + 4), (ex - 17, ey), (ex - 4, ey - 4), (ex, ey - 17)], INK, 2.4)
    else:
        for index, (ex, ey) in enumerate((left_eye, right_eye)):
            radius = 18 + (5 if expression == "surprised" else 3 if expression == "curious" and index == 0 else 0)
            ellipse((ex - radius, ey - radius, ex + radius, ey + radius), INK, 2.6)
            if expression == "confused" and index == 1:
                line([(ex - 8, ey + 3), (ex - 2, ey - 5), (ex + 4, ey + 4), (ex + 10, ey - 3)], SOFT, 2)
            else:
                ellipse((ex - 8 + dx * 3, ey - 8 + dy * 3, ex + 8 + dx * 3, ey + 8 + dy * 3), SOFT, 1.8)
                ellipse((ex - 2 + dx * 4, ey - 2 + dy * 4, ex + 2 + dx * 4, ey + 2 + dy * 4), INK, 1.5)

    mouth_y = 153 + dy * 4
    if expression == "surprised":
        ellipse((121 + eye_x, mouth_y - 8, 135 + eye_x, mouth_y + 8), INK, 2.6)
    elif expression in ("happy", "celebrating", "greeting"):
        line([(112 + eye_x, mouth_y - 2), (118 + eye_x, mouth_y + 7),
              (128 + eye_x, mouth_y + 11), (138 + eye_x, mouth_y + 7), (144 + eye_x, mouth_y - 2)], INK, 2.8)
    elif expression == "confused":
        line([(115, mouth_y + 5), (122, mouth_y), (129, mouth_y + 4), (140, mouth_y - 2)], INK, 2.4)
    else:
        line([(113 + eye_x, mouth_y), (128 + eye_x, mouth_y + (2 if expression == "neutral" else 0)), (143 + eye_x, mouth_y)], INK, 2.4)

    if expression == "thinking":
        line([(151, 67), (157, 62), (163, 66), (160, 72), (155, 71)], SOFT, 1.5)
    if expression == "confused":
        line([(189, 38), (194, 32), (199, 39), (195, 44), (195, 47)], SOFT, 2)
        ellipse((194, 51, 197, 54), SOFT, 1.5)
    if expression == "celebrating":
        line([(30, 73), (20, 64)], SOFT, 2)
        line([(226, 73), (236, 64)], SOFT, 2)
    if expression == "greeting":
        line([(215, 97), (227, 88), (226, 115)], SOFT, 2)


def sheet(kind):
    image = Image.new("RGBA", (CELL * 3 * SCALE, CELL * 3 * SCALE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    directions = [(-1, -1), (0, -1), (1, -1), (-1, 0), (0, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
    reactions = ["neutral", "happy", "curious", "thinking", "surprised", "focused", "confused", "celebrating", "greeting"]
    for index in range(9):
        x = index % 3 * CELL
        y = index // 3 * CELL
        if kind == "directions":
            draw_head(draw, x, y, *directions[index])
        else:
            draw_head(draw, x, y, expression=reactions[index])
    image = image.resize((CELL * 3, CELL * 3), Image.Resampling.LANCZOS)
    destination = Path("public/mascots")
    destination.mkdir(parents=True, exist_ok=True)
    image.save(destination / f"builder-bot-{kind}.png", optimize=True)


if __name__ == "__main__":
    sheet("directions")
    sheet("reactions")
