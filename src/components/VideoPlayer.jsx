import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);

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

    return (
        <div>
            <video
                ref={videoRef}
                controls
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
