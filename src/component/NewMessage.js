import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from './TextEditor';
import draftToHtml from 'draftjs-to-html';
import { getRoom, addMassage, addImageFile } from './Hfortapi';

function NewMessage({ setOpenModal }) {
    const navigate = useNavigate();
    const [room, setRoom] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [rooms, setRooms] = useState([]);
    const [addItemData, setAddItemData] = useState(false);
    const getContent = (value) => {
        setContent(draftToHtml(value));
    };

    useEffect(() => {
        fetchRoomItem();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        let response = await addMassage(room, title, content);
        setAddItemData(response);
        console.log(response);
        setTitle("");
        setContent("");
        window.location.reload();
    }
    const fetchRoomItem = async () => {
        let result = await getRoom(rooms);
        setRooms(result.data);
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        const fileImgPath = "/assets/" + result.data.id + "?key=system-large-cover";
        setContent(fileImgPath);
    }
    const uploadVideo = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        const fileVidPath = "/assets/" + result.data.id + "?key=system-medium-contain";
        setContent(fileVidPath);
    };

    return (
        <>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-100'>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className='mb-3'>Creating Item in Messages</h1>
                            <button type="button" className="btn-close" onClick={() => { setOpenModal(false); }}></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                            <div onClick={() => navigate(-1)} className="float-start"><i className="fas fa-arrow-circle-left fa-2x me-2 p-2"></i></div>
                            <div className="mb-3">
                                <div className="input-group mb-3">
                                    <label htmlFor="room" className="col-form-label-lg fw-bold">Room Number</label>
                                    <div className="input-group">
                                        <select id="room" className="form-select" aria-label="Example select with button addon"
                                            value={room} onChange={(e) => setRoom(e.target.value)} >
                                            {rooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.room_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="col-form-label-lg fw-bold">Model Title</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="title" aria-label="Text input" placeholder="Enter Title Name"
                                        value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3 border">
                                <label htmlFor="" className="col-form-label-lg fw-bold">Model Body</label>
                                <ul className="nav nav-tabs " id="myTab">
                                    <li className="nav-item">
                                        <a href="#home" className="nav-link active" data-bs-toggle="tab">Text</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#profile" className="nav-link" data-bs-toggle="tab">Images</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#messages" className="nav-link" data-bs-toggle="tab">Video</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="home">
                                        <TextEditor initialValue={content} getContent={getContent} />
                                    </div>
                                    <div className="tab-pane fade" id="profile">
                                        {content && (
                                            <img src={"/assets/" + content} alt="Image" style={{ width: '100%', height: '100%' }} />
                                        )}
                                        <input type="file" onChange={imageFileSelect} />
                                    </div>
                                    <div className="tab-pane fade" id="messages">
                                        {content && (
                                            <video style={{ width: '100%', height: '100%' }} controls>
                                                <source src={content} />
                                            </video>
                                        )}
                                        <input type="file" onChange={uploadVideo} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="float-start modal-footer">
                            <button onClick={handleAddItem} type="button" className="btn btn-dark">Add</button>
                            <button type="button" className="btn btn-secondary" onClick={() => { setOpenModal(false); }} id="cancelBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewMessage;