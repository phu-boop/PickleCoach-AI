import subprocess
import os

def convert_to_browser_compatible(input_path, output_path):
    ffmpeg_path = "C:/Users/phudz/Downloads/ffmpeg-7.1.1-essentials_build/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe"

    if not os.path.exists(ffmpeg_path):
        raise FileNotFoundError("FFmpeg không tìm thấy. Kiểm tra lại đường dẫn.")

    subprocess.run([
        ffmpeg_path, "-y",
        "-i", input_path,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-strict", "experimental",
        output_path
    ], check=True)