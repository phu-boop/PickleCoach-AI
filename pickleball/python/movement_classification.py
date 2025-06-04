from flask import Flask, request, jsonify
import cv2

app = Flask(__name__)

@app.route('/movement-classification', methods=['POST'])
def movement_classification():
    video_url = request.json
    cap = cv2.VideoCapture(video_url)
    if not cap.isOpened():
        return jsonify({"error": "Cannot open video"}), 400

    # Giả lập phân loại (thay bằng mô hình TensorFlow Lite)
    label = "forehand"  # Cần mô hình AI thực tế
    cap.release()
    return jsonify({"label": label})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)