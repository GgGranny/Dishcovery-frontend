import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";



const UploadVideo = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [data, setData] = useState({
        title: '',
        description: ''
    });

    const [videoData, setVideoData] = useState(null);
    const [videoId, setVideoId] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title);
        formData.append("description", data.description);

        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/videos/upload",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        console.log(progressEvent);
                    }
                });
            console.log(res);

            setMessage(res.data);
        } catch (err) {
            setMessage("Upload failed: " + err.message);
        }
    };

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setData({
            ...data,
            [name]: value
        })

        console.log(data);
    }
    useEffect(() => {
        console.log(file);
    }, [file])
    return (
        <div className="upload-container h-screen border border-red-500 flex flex-col justify-center items-center">
            <h1>Upload Video</h1>
            <form onSubmit={handleUpload} className="flex flex-col h-[50%] w-[50%] p-6">
                <label htmlFor="title">title</label>
                <input className="bg-white outline-gray-400" type="text" name="title" id="title" onChange={handleChange} value={data.title} />
                <label htmlFor="description">description</label>
                <input type="text" name="description" id="description" onChange={handleChange} value={data.description} />
                <label htmlFor="select a file">select a file</label>
                <input className="bg-white outline-gray-400" type="file" accept="video/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>

            {videoId && (
                <div className="h-[500px] w-[500px] ">
                    <h1>Stream video</h1>
                    {/* <video controls src={`http://localhost:8080/api/v1/videos/stream/2d86e12c-7921-4e70-a779-48726e3f92a5`}></video> */}
                    {/* <video src={`http://localhost:8080/api/v1/videos/stream/segment/ffd7fa1e-a94e-47b5-983d-fb180f820008/master.m3u8`} controls /> */}
                    <VideoPlayer src={`http://localhost:8080/api/v1/videos/stream/segment/${videoId}/master.m3u8`} />
                </div>

            )}
            <div>
                <input type="text" placeholder="Enter video ID" onChange={(e) => setVideoId(e.target.value)} value={videoId} />
            </div>
        </div>
    );

}

export default UploadVideo;