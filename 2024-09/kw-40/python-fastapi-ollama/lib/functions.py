import numpy as np

def map(value, in_min, in_max, out_min, out_max):
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

def normalize_coords(coords: np.ndarray):
    x_values = coords[:, 0]
    y_values = coords[:, 1]

    x_min = np.min(x_values).item()
    x_max = np.max(x_values).item()
    y_min = np.min(y_values).item()
    y_max = np.max(y_values).item()

    limes_x = {"value": abs(x_min), "label": "x_min"} if abs(x_min) >= abs(x_max) else {"value": abs(x_max), "label": "x_max"}
    limes_y = {"value": abs(y_min), "label": "y_min"} if abs(y_min) >= abs(y_max) else {"value": abs(y_max), "label": "y_max"}

    value_x, label_x = limes_x["value"], limes_x["label"]
    if label_x == "x_min":
        x_max = x_min + 2 * value_x
    else:
        x_min = x_max - 2 * value_x

    value_y, label_y = limes_y["value"], limes_y["label"]
    if label_y == "y_min":
        y_max = y_min + 2 * value_y
    else:
        y_min = y_max - 2 * value_y

    # Switch y_min with y_max
    y_min, y_max = y_max, y_min

    def map(value, in_min, in_max, out_min, out_max):
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

    x_values = [map(x, x_min, x_max, 0, 1) for x in x_values.tolist()]
    y_values = [map(y, y_min, y_max, 0, 1) for y in y_values.tolist()]

    return {
        "coords": [{"top": top, "left": left, "x": coord[0], "y": coord[1]} for coord, left, top in zip(coords.tolist(), x_values, y_values)],
        "limes": {"x": [x_min, x_max], "y": [y_min, y_max]}
    }
