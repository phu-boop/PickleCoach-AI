import numpy as np
import os

def generate_dummy_keypoints(num_samples, num_keypoints=33, num_coords=3):
    return np.random.rand(num_samples, num_keypoints * num_coords)

output_dir = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/python/keypoints"
os.makedirs(output_dir, exist_ok=True)

labels = ["forehand", "backhand", "serve"]
for label in labels:
    keypoints = generate_dummy_keypoints(100, 33, 3)
    np.save(os.path.join(output_dir, f"{label}_dummy.npy"), keypoints)