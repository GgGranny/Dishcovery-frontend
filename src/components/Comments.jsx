import VideoPlayer from "./VideoPlayer";
import { GiEgyptianProfile } from "react-icons/gi";
import Profile from "../assets/profile.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

const Comments = () => {
    const [comments, setComments] = useState([]); // <-- FIX: start with empty array

    useEffect(() => {
        axios.get("http://localhost:8080/api/comments/c1/get-comments/2", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                setComments(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // FIX: destructure props
    const Comment = ({ comment }) => {
        return (
            <div style={{ marginLeft: "15px" }} className="flex flex-row gap-1">
                <div className="w-5 h-5 border shrink-0 rounded-full overflow-hidden">
                    <img src={`data:image/jpeg;base64,` + comment?.user?.profilePicture} className="w-full h-full" alt="profile" />
                </div>
                <div>
                    <p>{comment.user?.username}</p>
                    <p>{comment.content}</p>

                    {comment.replies && comment.replies.length > 0 && (
                        <div>
                            {comment.replies.map(reply => (
                                <Comment key={reply.id} comment={reply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="border border-red-400 flex flex-col h-screen">
            <div className="h-[50%]">
                <VideoPlayer />
            </div>
            <div className="flex flex-col">
                Recipe
                <div>Description</div>
                Comments
                <div>
                    {comments.map(c => (
                        <Comment key={c.id} comment={c} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Comments;
