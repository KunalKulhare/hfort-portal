import React, { useEffect, useState } from 'react';
import { base_url, getPromotions, addImageFile, deletePromotions, editPromotionsGet, editPromotions, addPromotion } from '../component/Hfortapi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Promotions = () => {

    const [start_date, setStartTime] = React.useState(null);
    const [end_date, setEndTime] = React.useState(null);
    const [addPromotions, setAddPromotions] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [promotionsID, setPromotionsID] = useState(null);
    const [btn_show, setBtnShow] = useState(false);

    const [title, setTitle] = useState("");
    const [image, setImage] = React.useState("");

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchPromotions = async () => {
            let result = await getPromotions();
            if (isApiSubscribed) {
                setPromotions(result.data)
            }
        }
        fetchPromotions();
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddPromotions = async (e) => {
        e.preventDefault();
        let response = await addPromotion(title, image, start_date, end_date);
        setAddPromotions(response);
        console.log(response);
        window.location.reload();
    }

    const editPromotion = async (id) => {
        let result = await editPromotionsGet(id);
        setPromotionsID(result.data.id)
        setTitle(result.data.title);
        setImage(result.data.image);
        const startDate = new Date(result.data.start_date);
        setStartTime(startDate);
        const endDate = new Date(result.data.end_date);
        setEndTime(endDate);
    }

    const handleEditPromotions = async (e) => {
        e.preventDefault();
        let response = await editPromotions(promotionsID, title, image, start_date, end_date);
        window.location.reload();
    }

    function clearForm() {
        setTitle("")
        setImage("");
        setStartTime("");
        setEndTime("");
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        setImage(result.data.id);
    }

    const deletePromotion = async (id) => {
        let response = await deletePromotions(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>Promotions</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddPromotions" onClick={() => { clearForm(); setBtnShow(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            <th scope="col">Title</th>
                            <th scope="col">Image</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            promotions.map((promotion) =>
                                <tr key={promotion.id} className='text-center'>
                                    <td>{promotion.title}</td>
                                    <td>{promotion.image == null || <img src={base_url + "/assets/" + promotion.image} className="img-fluid" style={{ maxWidth: '5rem' }} alt="image" />}</td>
                                    <td>{promotion.start_date}</td>
                                    <td>{promotion.end_date}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { editPromotion(promotion.id); setBtnShow(false); }} data-bs-toggle="modal" data-bs-target="#AddPromotions">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deletePromotion(promotion.id)
                                                window.location.reload();
                                            }
                                        }}>Delete</button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="AddPromotions" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">Add Promotions</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className="col-form-label-lg fw-bold">Title</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="name" aria-label="Text input" placeholder="Enter title"
                                        value={title ? title : ""} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="col-form-label-lg fw-bold">Image</label>
                                <div className="input-group input-group-lg border">
                                    <input type="file" onChange={imageFileSelect} />
                                    {image && (
                                        <img src={"/assets/" + image} className="img-thumbnail" style={{ maxWidth: '20rem' }} alt="image" />
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="start_date" className="col-form-label-lg fw-bold">Start Date</label>
                                <div className="input-group input-group-lg ">
                                    <DatePicker
                                        className="form-control"
                                        showTimeSelect
                                        value={start_date}
                                        dateFormat="MMMM d, yyyy h:mm a"
                                        selected={start_date}
                                        selectsStart
                                        onChange={date => setStartTime(date)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="end_date" className="col-form-label-lg fw-bold">End Date</label>
                                <div className="input-group input-group-lg ">
                                    <DatePicker
                                        className="form-control"
                                        showTimeSelect
                                        value={end_date}
                                        dateFormat="MMMM d, yyyy h:mm a"
                                        selected={end_date}
                                        selectsEnd
                                        onChange={date => setEndTime(date)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearForm(); }}>Close</button>
                            {btn_show ? (
                                <button onClick={handleAddPromotions} type="button" className="btn btn-dark">Add</button>
                            ) : (
                                <button type="button" onClick={handleEditPromotions} className="btn btn-dark">Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Promotions;