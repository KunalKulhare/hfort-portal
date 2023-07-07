import React, { useEffect, useState } from 'react';
import { base_url, getNavigation, editNavigations, showNavigationGet, addImageFile, getActionType, getAction, addNavigations, deleteNavigation } from '../component/Hfortapi';

function Navigations() {

    const [navigations, setNavigations] = useState([]);
    const [action_types, setActionTypes] = useState([]);
    const [actions, setActions] = useState([]);
    const [actions_filtered, setActionsFiltered] = useState([]);

    const [navigationID, setNavigationID] = useState(null);
    const [action_type, setActionType] = useState("");
    const [action, setAction] = useState("");
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState("");

    const [addNavigation, setAddNavigation] = useState(false);
    const [action_dropdown, setActionDropDown] = useState([]);
    const [showNavigationBtn, setShowNavigationBtn] = useState(false);

    const fetchNavigations = async () => {
        let result = await getNavigation();
        setNavigations(result.data);
    }

    const fetchActions = async () => {
        let result = await getAction();
        let arr = [];
        Array.from(result.data).forEach(action => {
            arr[action.id] = action;
        });
        setActions(arr);
    }

    useEffect(() => {
        let isApiSubscribed = true;
        fetchNavigations();
        const fetchActionTypes = async () => {
            let result = await getActionType();
            setActionDropDown(result.data)
            if (isApiSubscribed) {
                let perm = [];
                let infoDisk = result.data;
                Array.from(infoDisk).forEach(actionType => {
                    perm[actionType.id] = actionType;
                });
                setActionTypes(perm);
            }
        }
        fetchActionTypes()
        fetchActions();
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddNavigations = async (e) => {
        e.preventDefault();
        let response = await addNavigations(logo, title, action);
        setAddNavigation(response);
        window.location.reload();
    }

    const showNavigations = async (id) => {
        let result = await showNavigationGet(id);
        setNavigationID(result.data.id);
        setLogo(result.data.logo);
        setTitle(result.data.title);
        setActionType(action_types[actions[result.data.action]['action_type']]['id']);
        await handleSelectActionType(action_types[actions[result.data.action]['action_type']]['id']);
        setAction(result.data.action);
    }

    const handleEditNavigations = async (e) => {
        e.preventDefault();
        let response = await editNavigations(navigationID, logo, title, action);
        window.location.reload();
    }

    function clearNavigationForm() {
        setNavigationID("");
        setLogo("");
        setTitle("");
        setActionType("");
        setAction("");
    }

    const handleSelectActionType = async (id) => {
        const actionSelect = actions.filter((action) => action.action_type == id);
        setActionsFiltered(actionSelect);
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        setLogo(result.data.id);
    }

    const deleteNavigations = async (id) => {
        let response = await deleteNavigation(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>TV APP Navigation</h1></div>
                <div className="float-end"><button className="btn btn-light" data-bs-toggle="modal" data-bs-target="#NavigationModel" onClick={() => { clearNavigationForm(); setShowNavigationBtn(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>

            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            <th scope="col">Logo</th>
                            <th scope="col">Title</th>
                            <th scope="col">Activity</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            navigations.map((infoDisk) =>
                                <tr key={infoDisk.id} className='text-center'>
                                    <td>{infoDisk.logo == null || <img src={base_url + "/assets/" + infoDisk.logo} className="img-fluid" style={{ maxWidth: '5rem' }} alt="image" />}</td>
                                    <td>{infoDisk.title}</td>
                                    <td>{(infoDisk.action in actions) && action_types[actions[infoDisk.action]['action_type']]['title'] + " -> " + actions[infoDisk.action]['title'] || '-'}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { showNavigations(infoDisk.id); setShowNavigationBtn(false); }} data-bs-toggle="modal" data-bs-target="#NavigationModel">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteNavigations(infoDisk.id)
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

            <div className="modal fade" id="NavigationModel" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">TV APP Navigation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { clearNavigationForm(); }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="action_types" className="col-form-label-lg fw-bold">Action Type</label>
                                <div className="input-group">
                                    <select id="action_types" className="form-select form-select-lg mb-3"
                                        value={action_type ? action_type : ""} onChange={(e) => { setActionType(e.target.value); handleSelectActionType(e.target.value); }}  >
                                        <option value="">Select Action Type</option>
                                        {
                                            action_types && action_types !== undefined &&
                                            action_types.map((actionType, index) => (
                                                <option key={index} value={actionType.id}>
                                                    {actionType.title}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="action" className="col-form-label-lg fw-bold">Action</label>
                                <div className="input-group">
                                    <select id="action" className="form-select form-select-lg mb-3"
                                        value={action ? action : ""} onChange={(e) => { setAction(e.target.value); }}>
                                        <option value="">Select Action</option>
                                        {
                                            actions_filtered && actions_filtered !== undefined &&
                                            actions_filtered.map((actionType, index) => (
                                                <option key={index} value={actionType.id}>
                                                    {actionType.title}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="col-form-label-lg fw-bold">Title</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="title" aria-label="Text input" placeholder="Enter title"
                                        value={title ? title : ""} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="logo" className="col-form-label-lg fw-bold">logo</label>
                                <div className="input-group input-group-lg border">
                                    <input type="file" onChange={imageFileSelect} />
                                    {logo && (
                                        <img src={"/assets/" + logo} className="img-thumbnail" style={{ maxWidth: '20rem' }} alt="image" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearNavigationForm(); }}>Close</button>
                            {showNavigationBtn ? (
                                <button onClick={handleAddNavigations} type="button" className="btn btn-dark">Add</button>
                            ) : (
                                <button type="button" onClick={handleEditNavigations} className="btn btn-dark">Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navigations;