import React, { useEffect, useState } from 'react';
import { base_url, getFoodMenu, deleteFoodMenu, showFoodMenuGet, editFoodMenu, addImageFile, addFoodMenuList } from '../component/Hfortapi';

const FoodMenu = () => {
    const [foodMenu, setFoodMenu] = useState([]);
    const [addFoodMenu, setAddFoodMenu] = useState(false);
    const [foodMenuID, setFoodMenuID] = useState(null);
    const [ShowFoodMenuBtn, setFoodMenuBtn] = useState(false);

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [pic, setPic] = React.useState("");
    const [desc, setDesc] = React.useState("");

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchFoodMenu = async () => {
            let result = await getFoodMenu();
            if (isApiSubscribed) {
                setFoodMenu(result.data);
            }
        }
        fetchFoodMenu();
        return () => {
            isApiSubscribed = false;
        }
    }, [])

    const handleAddFoodmenu = async (e) => {
        e.preventDefault();
        let response = await addFoodMenuList(name, price, pic, desc);
        setAddFoodMenu(response);
        window.location.reload();
    }

    const showFoodMenu = async (id) => {
        let result = await showFoodMenuGet(id);
        setFoodMenuID(result.data.id);
        setName(result.data.name);
        setPrice(result.data.price);
        setDesc(result.data.desc);
        setPic(result.data.pic);
    }

    const handleEditFoodmenu = async (e) => {
        e.preventDefault();
        let result = await editFoodMenu(foodMenuID, name, price, pic, desc);
        window.location.reload();
    }

    function clearFoodMenuForm() {
        setName("");
        setPrice("");
        setPic("");
        setDesc("");
    }

    const imageFileSelect = async (e) => {
        let result = await addImageFile(e.target.files[0]);
        setPic(result.data.id);
    }

    const deleteFoodMenus = async (id) => {
        let response = await deleteFoodMenu(id);
        window.location.reload();
    }

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>Food Menu</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddFoodMenu" onClick={() => { clearFoodMenuForm(); setFoodMenuBtn(true); }} ><i className="fas fa-plus-circle fa-2x"></i></button></div>
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center' >
                            <th scope="col">Name</th>
                            <th scope="col">Pic</th>
                            <th scope="col">Price</th>
                            <th scope="col">Description</th>
                            <th scope="col">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            foodMenu.map((foodMenu) =>
                                <tr key={foodMenu.id} className='text-center'>
                                    <td>{foodMenu.name}</td>
                                    <td>{foodMenu.pic == null || <img src={base_url + "/assets/" + foodMenu.pic} className="img-fluid" style={{ maxWidth: '5rem' }} alt="image" />}</td>
                                    <td>{foodMenu.price}</td>
                                    <td>{foodMenu.desc}</td>
                                    <td>
                                        <button className="btn btn-secondary me-md-2" onClick={() => { showFoodMenu(foodMenu.id); setFoodMenuBtn(false); }} data-bs-toggle="modal" data-bs-target="#AddFoodMenu">Edit</button>
                                        <button className="btn btn-secondary gap-2" onClick={() => {
                                            const confirmBox = window.confirm(
                                                "Do you really want to delete"
                                            )
                                            if (confirmBox === true) {
                                                deleteFoodMenus(foodMenu.id)
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

            <div className="modal fade" id="AddFoodMenu" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">Food Menu</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { clearFoodMenuForm(); }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="name" className="col-form-label-lg fw-bold">Food Name</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="name" aria-label="Text input" placeholder="Enter Food Name"
                                        value={name ? name : ""} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="col-form-label-lg fw-bold">Food price</label>
                                <div className="input-group input-group-lg ">
                                    <input type="text" className="form-control" id="price" aria-label="Text input" placeholder="Enter Food price"
                                        value={price ? price : ""} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="desc" className="col-form-label-lg fw-bold">Food Description</label>
                                <div className="input-group input-group-lg ">
                                    <textarea className="form-control" aria-label="With textarea" placeholder="Enter Food Description"
                                        value={desc ? desc : ""} onChange={(e) => setDesc(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="col-form-label-lg fw-bold">Food Image</label>
                                <div className="input-group input-group-lg">
                                    <input type="file" onChange={imageFileSelect} />
                                    {pic && (
                                        <img src={"/assets/" + pic} className="img-thumbnail" style={{ maxWidth: '20rem' }} alt="image" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { clearFoodMenuForm(); }}>Close</button>
                            {ShowFoodMenuBtn ? (
                                <button onClick={handleAddFoodmenu} type="button" className="btn btn-dark">Add</button>
                            ) : (
                                <button type="button" onClick={handleEditFoodmenu} className="btn btn-dark">Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FoodMenu;