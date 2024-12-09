/**
 * Adjusts the canvas size to match the window's inner width and height.
 */
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function normalizeArray(arr) {
  let minVal = Math.min(...arr);
  let maxVal = Math.max(...arr);
  return arr.map((x) => (x - minVal) / (maxVal - minVal));
}

/**
 * @param {string} arg The message to be displayed in the console
 * @param {[number, number, number]} [color] The rgb color specification to be used in the console
 */
function info(arg, color = [81, 142, 255]) {
  console.log(
    `%c${arg}`,
    `color: rgba(${color.toString()}, 1); font-weight: bold; background-color: rgba(${color.toString()}, .075); padding: 5px; border-radius: 5px; padding: 5px;`
  );
}

/**
 * @param {string} url The endpoint of the API
 * @param {object} payload The main data to be sent within the body attribute of the request
 */
async function post(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
}
