import React, { useState, useEffect } from 'react';
import { getAction, addAction, getActionType, editActionGet, editAction, deleteAction } from '../component/Hfortapi'

function Action() {
    const [action, setAction] = useState([]);
    const [action_add, setActionAdd] = useState(false);
    const [action_dropdown, setActionDropDown] = useState([]);
    const [actionID, setActionID] = useState(null);
    const [btn_show, setBtnShow] = useState(false);

    const [title, setTitle] = useState("");
    const [action_type, setActionType] = useState("");
    const [action_details, setActionDetails] = useState("");

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchAction = async () => {
            let result = await getAction(action);
            if (isApiSubscribed) {
                setAction(result.data);
            }
        }

        fetchAction();

        const fetchActionType = async () => {
            let result = await getActionType(action_dropdown);
            //   setActionDropDown(result.data)
            if (isApiSubscribed) {
                let perm = [];
                let action = result.data;
                Array.from(action).forEach(actionType => {
                    perm[actionType.id] = actionType;
                });
                setActionDropDown(perm);
            }
        }
        fetchActionType()
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddAction = async (e) => {
        e.preventDefault();
        let result = await addAction(title, action_type, action_details)
        setActionAdd(result)
    }

    const updateAction = async (id) => {
        let result = await editActionGet(id);
        setActionID(result.data.id);
        setTitle(result.data.title);
        setActionType(result.data.action_type);
        setActionDetails(result.data.action_details);
    }

    const handleUpdateAction = async (e) => {
        e.preventDefault();
        let response = await editAction(actionID, title, action_type, action_details);
        window.location.reload();
    }

    function clearForm() {
        setTitle("");
        setActionType("");
        setActionDetails("");
    }

    const deleteAtc = async (id) => {
        let response = await deleteAction(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>Action</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddAction" onClick={() => { clearForm(); setBtnShow(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            {/* <th scope="col">Id</th> */}
                            <th scope="col">Title</th>
                            <th scope="col">Action Type</th>
                            <th scope="col">action Details</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            action.map((action) =>
                                <tr key={action.id} className='text-center'>
                                    <td>{action.title}</td>
                                    <td>{action.action_type}</td>
                                    <td>{action.action_details}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { updateAction(action.id); setBtnShow(false); }} data-bs-toggle="modal" data-bs-target="#AddAction">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteAtc(action.id)
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
            <div className="modal fade" id="AddAction" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">Action</h1>
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
                                <div className="input-group mb-3">
                                    <label htmlFor="action_type" className="col-form-label-lg fw-bold">Action Type</label>
                                    <div className="input-group">
                                        <select id="action_type" className="form-select form-select-lg mb-3" aria-label="Default select example"
                                            value={action_type ? action_type : ""} onChange={(e) => setActionType(e.target.value)} >
                                            <option >Open this select action </option>
                                            {
                                                action_dropdown.map((actionType, index) => (
                                                    <option key={index} value={actionType.id}>
                                                        {actionType.title}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="action_details" className="col-form-label-lg fw-bold">Action Details</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="action_details" aria-label="Text input" placeholder="Enter Action Details"
                                        value={action_details ? action_details : ""} onChange={(e) => setActionDetails(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearForm(); }}>Close</button>
                                {btn_show ? (
                                    <button onClick={handleAddAction} type="button" className="btn btn-dark">Add</button>
                                ) : (
                                    <button type="button" onClick={handleUpdateAction} className="btn btn-dark">Update</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Action;