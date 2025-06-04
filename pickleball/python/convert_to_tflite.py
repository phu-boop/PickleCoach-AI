import tensorflow as tf

# Load the saved model
model = tf.keras.models.load_model("D:/LTJAVA/Project/PickleCoach-AI/pickleball/python/movement_classifier.h5")

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save TFLite model
with open("D:/LTJAVA/Project/PickleCoach-AI/pickleball/python/movement_classifier.tflite", "wb") as f:
    f.write(tflite_model)