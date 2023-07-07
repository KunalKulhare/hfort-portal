import React, { useState, useEffect } from 'react';
import { getActionType, AddActionType, editActionTypeGet, editActionType, deleteActionType } from '../component/Hfortapi'

function ActionType() {
    const [action_types, setActionTypes] = useState([]);
    const [action_type_add, setActionTypeAdd] = useState(false);
    const [actionTypeID, setActionTypeID] = useState(null);
    const [btn_show, setBtnShow] = useState(false);

    const [title, setTitle] = useState("");
    const [action_type, setActionType] = useState("")

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchAction = async () => {
            let result = await getActionType(action_types);
            if (isApiSubscribed) {
                setActionTypes(result.data);
            }
        }
        fetchAction();
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddActionType = async (e) => {
        e.preventDefault();
        let result = await AddActionType(title, action_type)
        setActionTypeAdd(result)
        window.location.reload();
    }

    const updateActionType = async (id) => {
        let result = await editActionTypeGet(id)
        setActionTypeID(result.data.id);
        setTitle(result.data.title);
        setActionType(result.data.action_type);
    }

    const handleUpdateActionType = async (e) => {
        e.preventDefault();
        let response = await editActionType(actionTypeID, title, action_type,);
        window.location.reload();
    }

    function clearForm() {
        setTitle("");
        setActionType("");
    }

    const deleteAtcType = async (id) => {
        let response = await deleteActionType(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>Action Type</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddActionType" onClick={() => { clearForm(); setBtnShow(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            {/* <th scope="col">Id</th> */}
                            <th scope="col">Title</th>
                            <th scope="col">Action Type</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            action_types.map((action_type) =>
                                <tr key={action_type.id} className='text-center'>
                                    <td>{action_type.title}</td>
                                    <td>{action_type.action_type}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { updateActionType(action_type.id); setBtnShow(false); }} data-bs-toggle="modal" data-bs-target="#AddActionType">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteAtcType(action_type.id)
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

            <div className="modal fade" id="AddActionType" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">Action Type</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label htmlFor="title" className="col-form-label-lg fw-bold">Title</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="name" aria-label="Text input" placeholder="Enter Title"
                                        value={title ? title : ""} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="action_type" className="col-form-label-lg fw-bold">Action Type</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="action_type" aria-label="Text input" placeholder="Enter Action Type"
                                        value={action_type ? action_type : ""} onChange={(e) => setActionType(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearForm() }}>Close</button>
                                {btn_show ? (
                                    <button onClick={handleUpdateActionType} type="button" className="btn btn-dark">Add</button>
                                ) : (
                                    <button type="button" onClick={handleAddActionType} className="btn btn-dark">Update</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActionType;