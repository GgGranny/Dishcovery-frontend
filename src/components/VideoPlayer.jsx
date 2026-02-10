import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ src, handelAdCheck }) => {
    const videoRef = useRef(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);
    const [adUrl, setAdUrl] = useState("");

    useEffect(() => {
        const fetchAd = async () => {
            const response = await axios.get("http://localhost:8080/api/ad/v1", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("response", response);
            setAdUrl(response.config.url);
        }
        fetchAd();
    }, [])

    useEffect(() => {
        if (!src) return;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                debug: false,
                xhrSetup: (xhr) => (xhr.withCredentials = true),
            });

            hls.loadSource(src);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setLevels(data.levels);
                setCurrentLevel(hls.currentLevel);
                videoRef.current.play();
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                setCurrentLevel(data.level);
            });

        }

        return () => hls && hls.destroy();
    }, [src]);


    const handleQualityChange = (index) => {
        if (index === -1) {
            // auto quality
            hls.currentLevel = -1;
        } else {
            hls.currentLevel = index;
        }
        setCurrentLevel(index);
    };

    const handelAdCheck = () => {
        console.log("this is ad check");
    }

    return (
        <div className="h-full border border-green-400 relative">
            <div className="overlay absolute w-full h-full cursor-pointer z-10 bg-red-500" />
            <video
                className="outline-2 outline-green-500 "
                ref={videoRef}
                controls
                onPlay={handelAdCheck}
                style={{
                    width: "100%",
                    backgroundColor: "black",
                    borderRadius: "8px",
                }}
            />

            {levels.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                    <select
                        value={currentLevel}
                        onChange={(e) => handleQualityChange(Number(e.target.value))}
                    >
                        <option value={-1}>Auto</option>
                        {levels.map((level, i) => (
                            <option key={i} value={i}>
                                {level.height}p
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
