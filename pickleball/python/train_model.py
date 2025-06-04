import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os

# Load data
data_dir = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/python/keypoints"
X = []
y = []
labels = ["forehand", "backhand", "serve"]
for label in labels:
    keypoints = np.load(os.path.join(data_dir, f"{label}_dummy.npy"))
    X.extend(keypoints)
    y.extend([label] * len(keypoints))

X = np.array(X)
y = np.array(y)

# Encode labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X.shape[1],)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(len(labels), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train model
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))

# Save model
model.save("D:/LTJAVA/Project/PickleCoach-AI/pickleball/python/movement_classifier.h5")