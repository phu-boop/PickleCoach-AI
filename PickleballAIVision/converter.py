import subprocess
import shutil
import os

def convert_to_browser_compatible(input_path, output_path):
    print(">>> [DEBUG] converter.py loaded")
    print(">>> [DEBUG] PATH env:", os.environ.get("PATH"))
    print(">>> [DEBUG] shutil.which('ffmpeg'):", shutil.which("ffmpeg"))

    ffmpeg_path = shutil.which("ffmpeg")
    if not ffmpeg_path:
        raise RuntimeError("FFmpeg không tìm thấy trong PATH. Kiểm tra lại Dockerfile hoặc PATH env.")

    print(f">>> Using FFmpeg at: {ffmpeg_path}")
    print(f">>> Input: {input_path}")
    print(f">>> Output: {output_path}")

    try:
        result = subprocess.run(
            [
                ffmpeg_path, "-y", "-i", input_path,
                "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental",
                output_path
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print(">>> Conversion finished successfully.")
        if result.stderr:
            print(">>> FFmpeg STDERR:\n", result.stderr)
    except subprocess.CalledProcessError as e:
        print(">>> Conversion failed!")
        print(">>> FFmpeg STDERR:\n", e.stderr)
        raise RuntimeError("Video conversion failed") from e
