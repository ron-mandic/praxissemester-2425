import numpy as np

def normalize(val, min_val, max_val):
    return ((val - min_val) / (max_val - min_val)) * 100

def normalize_coords(coords: np.ndarray):
    x_values = coords[:, 0]
    y_values = coords[:, 1]

    x_min, x_max = x_values.min(), x_values.max()
    y_min, y_max = y_values.min(), y_values.max()

    return [
        {
            "x": x,
            "y": y,
            "top": float(normalize(y, y_min, y_max)),
            "left": float(normalize(x, x_min, x_max))
        }
        for x, y in zip(x_values.tolist(), y_values.tolist())
    ]
