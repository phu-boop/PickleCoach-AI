import { Upload } from "lucide-react";
import { useState } from "react";

export default function UploadVideo({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = () => {
    if (!file) {
      setError("Please select a video to upload.");
      return;
    }
    setError("");
    onSubmit({ file });
  };

  return (
    <Card className="mb-6 bg-white shadow-lg rounded-xl">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Upload Skill Demo Video
        </h2>

        <p className="text-gray-600">
          Upload a short video (max 2 minutes) demonstrating your pickleball skills.
        </p>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="w-full text-gray-700 border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
        />

        {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          onClick={handleUpload}
          disabled={!file}
          className={`w-full px-6 py-3 rounded-lg transition-colors ${
            !file
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Upload Video
        </Button>
      </CardContent>
    </Card>
  );
}