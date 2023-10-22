const eps = 0.01;
export function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function calcDist(p1, p2) {
  return dist((p2.x - p1.x), (p2.y - p1.y))
}

function calcOffsetDist(p1, p2) {
  return dist(((p2.x + p2.offset[0]) - (p1.x + p1.offset[0])), ((p2.y + p2.offset[1]) - (p1.y + p1.offset[1])));
}
export function dist(l1, l2) {
  return Math.sqrt(l1 ** 2 + l2 ** 2)
}

export const calcCollision = (p1, p2, p, dist) => (calcOffsetDist(p1, p) + calcOffsetDist(p, p2)) == dist;

export function calcOffset(points, candidatePoint, cursorPosition, offsetWidth, maxWidth) {

  // console.log(offsetWidth)
  if (points.length === 0) return [0, 0];
  
  const calcUnitVector = (p1, p2, xdist, ydist) => {
    // console.log(xdist + " " + (xdist / Math.abs(xdist)))
    // console.log(ydist + " " + (ydist / Math.abs(ydist)))
    const dist = calcDist(p1.point, p2.point);
    return [Math.abs((p2.x - p1.x) / dist) * (ydist / Math.abs(ydist)), Math.abs((p2.y - p1.y) / dist) * (xdist / Math.abs(xdist))];
  }
  const lastPoint = points[points.length - 1].point;
  const dist = calcDist(lastPoint, candidatePoint);

  let offsetx = 0;
  let offsety = 0;
  candidatePoint.offset = [0,0];
  // 3 cases: current line co-linear with a larger line, current line co-linear with a smaller line, or no collision
  for(let i = 0; i < points.length-1; i++) {
    let p1 = points[i].point;
    let p2 = points[i + 1].point;
    if (calcCollision(p1, p2, candidatePoint, calcDist(p1, p2))) {
      const offsetVector = calcUnitVector(p1, p2, cursorPosition.x-candidatePoint.x + eps, cursorPosition.y - candidatePoint.y + eps);
      offsetx += offsetWidth * offsetVector[0];
      offsety += offsetWidth * offsetVector[1];
    }
    if (calcCollision(candidatePoint, lastPoint, p1, dist)) {
      const offsetVector = calcUnitVector(candidatePoint, lastPoint, cursorPosition.x-candidatePoint.x + eps, cursorPosition.y - candidatePoint.y + eps);
      offsetx += offsetWidth * offsetVector[0];
      offsety += offsetWidth * offsetVector[1];
      i++;
    }
  }
  // console.log(offsetx)
  // console.log(offsety)
  return offsetx < maxWidth && offsety < maxWidth ? [offsety, offsetx] : null;
}