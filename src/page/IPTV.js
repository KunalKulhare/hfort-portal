import React, { useEffect, useState } from 'react';
import { getIPTV, deleteIPTV, editIPTV, editIPTVGet, addImageFile, AddIPTVData } from '../component/Hfortapi'

const IPTV = () => {

    const [addIpTvItem, setIPTVItem] = useState(false);
    const [ip_tv, setIPTV] = useState([])
    const [iptvID, setIPTVID] = useState(null);
    const [btn_show, setBtnShow] = useState(false);

    const [logo, setLogo] = React.useState("");
    const [name, setName] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [port, setPort] = React.useState("");
    const [mip, setMip] = React.useState("");
    const [protocol, setProtocol] = React.useState("");

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchIPTV = async () => {
            let result = await getIPTV(ip_tv);
            if (isApiSubscribed) {
                setIPTV(result.data);
            }
        }
        fetchIPTV();
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddIPTV = async (e) => {
        e.preventDefault();
        let response = await AddIPTVData(logo, name, number);
        setIPTVItem(response);
        window.location.reload();
    }

    const editIPTVs = async (id) => {
        let result = await editIPTVGet(id);
        setIPTVID(result.data.id);
        setLogo(result.data.logo);
        setName(result.data.name);
        setNumber(result.data.number);
        setProtocol(result.data.protocol);
        setPort(result.data.port);
        setMip(result.data.mip);
    }

    const handleEditIPTV = async (e) => {
        e.preventDefault();
        let response = await editIPTV(iptvID, logo, name, number, protocol, port, mip);
        window.location.reload();
    }

    function clearForm() {
        setLogo("");
        setName("");
        setNumber("");
        setPort("");
        setMip("");
        setProtocol("");
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        setLogo(result.data.id);
    }

    const deleteIPTVItem = async (id) => {
        let response = await deleteIPTV(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>IPTV</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddIpTv" onClick={() => { clearForm(); setBtnShow(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            <th scope="col">Logo</th>
                            <th scope="col">Name</th>
                            <th scope="col">Number</th>
                            <th scope="col">Protocol</th>
                            <th scope="col">Mip</th>
                            <th scope="col">Port</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ip_tv.map((IPTV) =>
                                <tr key={IPTV.id} className='text-center'>
                                    <td>{IPTV.logo == null || <img src={"/assets/" + IPTV.logo} className="img-fluid" style={{ maxWidth: '5rem' }} alt="Logo" />}</td>
                                    <td>{IPTV.name}</td>
                                    <td>{IPTV.number}</td>
                                    <td>{IPTV.protocol}</td>
                                    <td>{IPTV.mip}</td>
                                    <td>{IPTV.port}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { editIPTVs(IPTV.id); setBtnShow(false); }} data-bs-toggle="modal" data-bs-target="#AddIpTv">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteIPTVItem(IPTV.id)
                                                window.location.reload();
                                            }
                                        }}>Delete</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="AddIpTv" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">IPTV</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { clearForm(); }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label htmlFor="logo" className="col-form-label-lg fw-bold">Logo</label>
                                <div className="input-group  border">
                                    <input type="file" className='form-control' onChange={imageFileSelect} />
                                    {logo && (
                                        <img src={"/assets/" + logo} className="img-thumbnail" style={{ maxWidth: '5rem' }} alt="image" />
                                    )}
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="name" className="col-form-label-lg fw-bold">Name</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="name" aria-label="Text input" placeholder="Enter Name"
                                        value={name ? name : ""} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="price" className="col-form-label-lg fw-bold">Number</label>
                                <div className="input-group input-group-lg ">
                                    <input type="number" className="form-control" id="number" aria-label="Text input" placeholder="Enter Number"
                                        value={number ? number : ""} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="input-group mb-3">
                                    <label htmlFor="protocol" className="col-form-label-lg fw-bold">Protocol</label>
                                    <div className="input-group">
                                        <select id="protocol" className="form-select form-select-lg mb-3" aria-label="Default select example"
                                            value={protocol ? protocol : ""} onChange={(e) => setProtocol(e.target.value)} >
                                            <option >Open this select menu </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="port" className="col-form-label-lg fw-bold">Port</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="port" aria-label="Text input" placeholder="Enter port"
                                        value={port ? port : ""} onChange={(e) => setPort(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="mip" className="col-form-label-lg fw-bold">Mip</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="port" aria-label="Text input" placeholder="Enter mip"
                                        value={mip ? mip : ""} onChange={(e) => setMip(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearForm(); }}>Close</button>
                            {btn_show ? (
                                <button onClick={handleAddIPTV} type="button" className="btn btn-dark">Add</button>
                            ) : (
                                <button type="button" onClick={handleEditIPTV} className="btn btn-dark">Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IPTV;