import React, { useEffect, useState } from 'react';
import { base_url, getWorldClock, editWorldClockGet, editWorldClock, addImageFile, deleteWorldClock, addWorld_Clock } from '../component/Hfortapi';

const WorldClock = () => {
    const [world_clock, setWorld_Clock] = useState([]);
    const [worldclockID, setWorldClockID] = useState(null);
    const [addWorldClock, setAddWorldClock] = useState(false);
    const [btn_show, setBtnShow] = useState(false);

    const [icon, setIcon] = React.useState("");
    const [city_name, setCityName] = React.useState("");
    const [time_zone, setTimeZone] = React.useState("");
    const [current_time, setCurrentTime] = React.useState("");

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchWorldClock = async () => {
            let result = await getWorldClock(world_clock);
            if (isApiSubscribed) {
                setWorld_Clock(result.data)
            }
        }
        fetchWorldClock();
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const handleAddWorldClock = async (e) => {
        e.preventDefault();
        let response = await addWorld_Clock(icon, city_name, time_zone, current_time);
        setAddWorldClock(response);
        window.location.reload();
    }

    const editWorldClocks = async (id) => {
        let result = await editWorldClockGet(id);
        setWorldClockID(result.data.id)
        setIcon(result.data.icon);
        setCityName(result.data.city_name);
        setTimeZone(result.data.time_zone);
        setCurrentTime(result.data.current_time);
    }

    const handleEditWorldClock = async (e) => {
        e.preventDefault();
        let response = await editWorldClock(worldclockID, icon, city_name, time_zone, current_time);
        window.location.reload();
    }

    function clearForm() {
        setIcon("");
        setCityName("");
        setTimeZone("");
        setCurrentTime("");
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        setIcon(result.data.id)
    }

    const deleteWorld = async (id) => {
        let response = await deleteWorldClock(id);
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>World Clock</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddWorldClock" onClick={() => { clearForm(); setBtnShow(true); }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center'>
                            <th scope="col">City Name</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Time Zone</th>
                            <th scope="col">Current Time</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            world_clock.map((worldClock) =>
                                <tr key={worldClock.id} className='text-center'>
                                    <td>{worldClock.city_name}</td>
                                    <td>{worldClock.icon == null || <img src={base_url + "/assets/" + worldClock.icon} className="img-fluid" style={{ maxWidth: '5rem' }} alt="image" />}</td>
                                    <td>{worldClock.time_zone}</td>
                                    <td>{worldClock.current_time}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { editWorldClocks(worldClock.id); setBtnShow(false); }} data-bs-toggle="modal" data-bs-target="#AddWorldClock">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to Delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteWorld(worldClock.id)
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

            <div className="modal fade" id="AddWorldClock" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">Add World Clock</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="icon" className="col-form-label-lg fw-bold">Image</label>
                                <div className="input-group input-group-lg border">
                                    <input type="file" onChange={imageFileSelect} />
                                    {icon && (
                                        <img src={"/assets/" + icon} className="img-thumbnail" style={{ maxWidth: '20rem' }} alt="image" />
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="city_name" className="col-form-label-lg fw-bold">City Name</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="city_name" aria-label="Text input" placeholder="Enter City Name"
                                        value={city_name ? city_name : ""} onChange={(e) => setCityName(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="time_zone" className="col-form-label-lg fw-bold">Time Zone</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="time_zone" aria-label="Text input" placeholder="Enter  TimeZone"
                                        value={time_zone ? time_zone : ""} onChange={(e) => setTimeZone(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="current_time" className="col-form-label-lg fw-bold">Current Time</label>
                                <div className="input-group input-group-lg ">
                                    <input type="time" className="form-control" id="current_time" aria-label="Text input" placeholder="Enter Current Time"
                                        value={current_time ? current_time : ""} onChange={(e) => setCurrentTime(e.target.value)} />
                                    {/* <DatePicker
                                        className="form-control"
                                        showTimeSelect
                                        showTimeSelectOnly
                                        dateFormat="HH:mm"
                                        timeIntervals={30}
                                        value={current_time}
                                        selected={current_time}
                                        onChange={date => setCurrentTime(date)}
                                    /> */}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearForm(); }}>Close</button>
                            {btn_show ? (
                                <button onClick={handleAddWorldClock} type="button" className="btn btn-dark">Add</button>
                            ) : (
                                <button type="button" onClick={handleEditWorldClock} className="btn btn-dark">Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WorldClock;